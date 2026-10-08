'use client'

import { useRef, useState } from 'react'
import { Camera, ChevronLeft, ChevronRight, ImagePlus, Trash2 } from 'lucide-react'
import { supabase, BUCKET } from '@/lib/supabase'
import { categories, MAX_IMAGES, sectionInfo, sizeOptions } from '@/lib/config'
import { compressImage } from '@/lib/images'
import { formatBytes, storagePathFromUrl } from '@/lib/format'
import type { Product, Section } from '@/lib/types'

interface Photo {
  id: string
  url: string
  file?: File // si tiene archivo, es nueva y falta subirla
  info?: string
}

const OTHER = '__otra__'
const uid = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

function parseNum(v: string): number | null {
  const t = v.replace(',', '.').trim()
  if (!t) return null
  const n = Number(t)
  return Number.isFinite(n) ? n : null
}

const inputCls =
  'min-h-12 w-full rounded-2xl border-2 border-rosa-suave bg-white px-4 text-base focus:border-lavanda focus:outline-none'

function Switch({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4">
      <div>
        <p className="font-bold">{label}</p>
        {hint && <p className="text-sm text-tinta-suave">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-8 w-14 shrink-0 rounded-full transition ${checked ? 'bg-lavanda-osc' : 'bg-tinta-suave/40'}`}
      >
        <span className={`absolute top-1 size-6 rounded-full bg-white shadow transition-all ${checked ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  )
}

export default function ProductForm({
  product,
  onCancel,
  onSaved,
}: {
  product: Product | null
  onCancel: () => void
  onSaved: (message: string) => void
}) {
  const initialSection: Section = product?.section ?? 'creaciones'
  const knownCategory = product ? categories[initialSection].includes(product.category) : true

  const [section, setSection] = useState<Section>(initialSection)
  const [category, setCategory] = useState(product ? (knownCategory ? product.category : OTHER) : categories[initialSection][0])
  const [customCategory, setCustomCategory] = useState(product && !knownCategory ? product.category : '')
  const [name, setName] = useState(product?.name ?? '')
  const [note, setNote] = useState(product?.note ?? '')
  const [price, setPrice] = useState(product ? String(product.price) : '')
  const [onSale, setOnSale] = useState(!!product && product.old_price != null && Number(product.old_price) > Number(product.price))
  const [oldPrice, setOldPrice] = useState(product?.old_price != null ? String(product.old_price) : '')
  const [sizes, setSizes] = useState<string[]>(product?.sizes ?? [])
  const [available, setAvailable] = useState(product ? !product.sold_out : true)
  const [visible, setVisible] = useState(product ? product.visible : true)
  const [photos, setPhotos] = useState<Photo[]>(product ? product.images.map((url) => ({ id: uid(), url })) : [])

  const [compressing, setCompressing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  function changeSection(next: Section) {
    setSection(next)
    setCategory(categories[next][0])
    setCustomCategory('')
    if (next === 'creaciones') setSizes([])
  }

  function toggleSize(s: string) {
    setSizes((list) => (list.includes(s) ? list.filter((x) => x !== s) : [...list, s]))
  }

  async function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setError('')
    const room = MAX_IMAGES - photos.length
    const chosen = Array.from(files).slice(0, Math.max(room, 0))
    if (files.length > room) setError(`Solo caben ${MAX_IMAGES} fotos por artículo. Se agregaron las primeras ${Math.max(room, 0)}.`)
    if (chosen.length === 0) return

    setCompressing(true)
    const added: Photo[] = []
    for (const file of chosen) {
      try {
        const small = await compressImage(file)
        added.push({
          id: uid(),
          url: URL.createObjectURL(small),
          file: small,
          info: `${formatBytes(file.size)} → ${formatBytes(small.size)}`,
        })
      } catch (e) {
        console.error(e)
        setError('Una de las fotos no se pudo procesar. Prueba con otra.')
      }
    }
    setPhotos((list) => [...list, ...added])
    setCompressing(false)
  }

  function movePhoto(i: number, dir: -1 | 1) {
    setPhotos((list) => {
      const j = i + dir
      if (j < 0 || j >= list.length) return list
      const copy = [...list]
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
      return copy
    })
  }

  function removePhoto(id: string) {
    setPhotos((list) => list.filter((p) => p.id !== id))
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!supabase) return

    const cleanName = name.trim()
    if (!cleanName) return setError('Escribe el nombre del artículo.')
    const priceNum = parseNum(price)
    if (priceNum === null || priceNum < 0) return setError('Escribe un precio válido en Bs (solo números).')
    let oldNum: number | null = null
    if (onSale) {
      oldNum = parseNum(oldPrice)
      if (oldNum === null || oldNum <= priceNum) return setError('El precio anterior debe ser mayor que el precio con descuento.')
    }
    const finalCategory = category === OTHER ? customCategory.trim() : category
    if (!finalCategory) return setError('Escribe la categoría.')

    setSaving(true)
    try {
      const urls: string[] = []
      const total = photos.filter((p) => p.file).length
      let done = 0
      for (const photo of photos) {
        if (!photo.file) {
          urls.push(photo.url)
          continue
        }
        done += 1
        setStatus(`Subiendo foto ${done} de ${total}…`)
        const path = `${uid()}.jpg`
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, photo.file, { contentType: 'image/jpeg', cacheControl: '31536000' })
        if (upErr) throw upErr
        urls.push(supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl)
      }

      setStatus('Guardando…')
      const payload = {
        section,
        category: finalCategory,
        name: cleanName,
        note: note.trim() || null,
        price: priceNum,
        old_price: onSale ? oldNum : null,
        sizes: section === 'ropa' ? sizes : [],
        images: urls,
        sold_out: !available,
        visible,
      }

      const res = product
        ? await supabase.from('products').update(payload).eq('id', product.id)
        : await supabase.from('products').insert(payload)
      if (res.error) throw res.error

      // Si quitaste fotos de un artículo, las borramos también del almacenamiento
      if (product) {
        const removed = product.images
          .filter((u) => !urls.includes(u))
          .map(storagePathFromUrl)
          .filter((x): x is string => !!x)
        if (removed.length) await supabase.storage.from(BUCKET).remove(removed)
      }

      onSaved(product ? 'Artículo actualizado ✓' : 'Artículo guardado ✓')
    } catch (err) {
      console.error(err)
      const detail = err instanceof Error ? err.message : ''
      setError(`No se pudo guardar. Revisa tu conexión e inténtalo de nuevo.${detail ? ` (${detail})` : ''}`)
    } finally {
      setSaving(false)
      setStatus('')
    }
  }

  const pct = onSale && parseNum(price) && parseNum(oldPrice) && Number(parseNum(oldPrice)) > Number(parseNum(price))
    ? Math.round((1 - Number(parseNum(price)) / Number(parseNum(oldPrice))) * 100)
    : 0

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-rosa-osc">{product ? 'Editar artículo' : 'Agregar artículo'}</h1>
        <button type="button" onClick={onCancel} className="min-h-11 rounded-full border-2 border-lavanda px-4 text-sm font-bold text-lavanda-osc hover:bg-lavanda-suave">
          Cancelar
        </button>
      </div>

      <form onSubmit={save} className="mt-6 flex flex-col gap-5">
        {/* Pestaña */}
        <fieldset>
          <legend className="mb-2 font-bold">¿En qué pestaña va?</legend>
          <div className="grid grid-cols-2 gap-2">
            {(['creaciones', 'ropa'] as Section[]).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={section === s}
                onClick={() => changeSection(s)}
                className={`min-h-12 rounded-2xl border-2 font-bold ${section === s ? 'border-rosa-osc bg-rosa-osc text-white' : 'border-rosa-suave bg-white'}`}
              >
                {sectionInfo[s].label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Categoría */}
        <div>
          <label htmlFor="cat" className="mb-2 block font-bold">Categoría</label>
          <select id="cat" value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
            {categories[section].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            <option value={OTHER}>Otra (escribir)…</option>
          </select>
          {category === OTHER && (
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Escribe la categoría"
              aria-label="Nueva categoría"
              className={`${inputCls} mt-2`}
            />
          )}
        </div>

        {/* Nombre */}
        <div>
          <label htmlFor="name" className="mb-2 block font-bold">Nombre del artículo *</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} className={inputCls} placeholder="Ej: Agenda lila con corazón" />
        </div>

        {/* Comentario */}
        <div>
          <label htmlFor="note" className="mb-2 block font-bold">Comentario o descripción</label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            maxLength={600}
            className="w-full rounded-2xl border-2 border-rosa-suave bg-white p-4 text-base focus:border-lavanda focus:outline-none"
            placeholder="Cuenta algo del artículo: materiales, tamaño, colores…"
          />
        </div>

        {/* Precio */}
        <div>
          <label htmlFor="price" className="mb-2 block font-bold">{onSale ? 'Precio con descuento (Bs) *' : 'Precio (Bs) *'}</label>
          <input id="price" type="text" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} className={inputCls} placeholder="Ej: 45" />
        </div>

        <Switch checked={onSale} onChange={setOnSale} label="En promoción / con descuento" hint="Muestra el precio anterior tachado y la etiqueta Oferta." />
        {onSale && (
          <div>
            <label htmlFor="old" className="mb-2 block font-bold">Precio anterior, sin descuento (Bs) *</label>
            <input id="old" type="text" inputMode="decimal" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} className={inputCls} placeholder="Ej: 60" />
            {pct > 0 && <p className="mt-2 text-sm font-bold text-lavanda-osc">Descuento: -{pct}%</p>}
          </div>
        )}

        {/* Tallas (solo ropa) */}
        {section === 'ropa' && (
          <fieldset>
            <legend className="mb-2 font-bold">Tallas disponibles</legend>
            {([['Adultos', sizeOptions.adultos], ['Niños y bebés', sizeOptions.ninos]] as const).map(([label, list]) => (
              <div key={label} className="mb-3">
                <p className="mb-1.5 text-sm text-tinta-suave">{label}</p>
                <div className="flex flex-wrap gap-2">
                  {list.map((s) => (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={sizes.includes(s)}
                      onClick={() => toggleSize(s)}
                      className={`min-h-11 min-w-11 rounded-full border-2 px-4 text-sm font-bold ${sizes.includes(s) ? 'border-lavanda-osc bg-lavanda-osc text-white' : 'border-lavanda bg-white text-lavanda-osc'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </fieldset>
        )}

        <Switch checked={available} onChange={setAvailable} label="Disponible" hint={available ? 'Se puede pedir.' : 'Aparecerá como Agotado.'} />
        <Switch checked={visible} onChange={setVisible} label="Mostrar en la tienda" hint={visible ? 'Los clientes lo ven.' : 'Guardado como borrador, nadie lo ve.'} />

        {/* Fotos */}
        <fieldset>
          <legend className="mb-1 font-bold">Fotos ({photos.length}/{MAX_IMAGES})</legend>
          <p className="mb-3 text-sm text-tinta-suave">
            Si agregas varias, en la tienda cambian solas como un carrusel. La primera es la portada. Se comprimen automáticamente.
          </p>

          <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} />
          <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} />

          <div className="grid grid-cols-2 gap-2">
            <button type="button" disabled={compressing || photos.length >= MAX_IMAGES} onClick={() => cameraRef.current?.click()} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-lavanda-osc font-bold text-white disabled:opacity-50">
              <Camera className="size-5" aria-hidden /> Tomar foto
            </button>
            <button type="button" disabled={compressing || photos.length >= MAX_IMAGES} onClick={() => galleryRef.current?.click()} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-lavanda-osc font-bold text-lavanda-osc disabled:opacity-50">
              <ImagePlus className="size-5" aria-hidden /> Elegir de galería
            </button>
          </div>

          {compressing && <p className="mt-3 text-sm font-bold text-lavanda-osc" aria-live="polite">Comprimiendo fotos…</p>}

          {photos.length > 0 && (
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {photos.map((p, i) => (
                <li key={p.id} className="rounded-2xl bg-white p-2">
                  <div className="relative">
                    <img src={p.url} alt={`Foto ${i + 1}`} className="aspect-square w-full rounded-xl object-cover" />
                    {i === 0 && <span className="absolute left-2 top-2 rounded-full bg-rosa-osc px-2.5 py-0.5 text-xs font-bold text-white">Portada</span>}
                  </div>
                  {p.info && <p className="mt-1 text-center text-xs text-tinta-suave">{p.info}</p>}
                  <div className="mt-1 flex items-center justify-between">
                    <button type="button" onClick={() => movePhoto(i, -1)} disabled={i === 0} aria-label="Mover antes" className="flex size-11 items-center justify-center rounded-full hover:bg-lavanda-suave disabled:opacity-30">
                      <ChevronLeft className="size-5" />
                    </button>
                    <button type="button" onClick={() => removePhoto(p.id)} aria-label="Quitar foto" className="flex size-11 items-center justify-center rounded-full text-rosa-osc hover:bg-rosa-claro">
                      <Trash2 className="size-5" />
                    </button>
                    <button type="button" onClick={() => movePhoto(i, 1)} disabled={i === photos.length - 1} aria-label="Mover después" className="flex size-11 items-center justify-center rounded-full hover:bg-lavanda-suave disabled:opacity-30">
                      <ChevronRight className="size-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </fieldset>

        {error && <p role="alert" className="rounded-2xl bg-rosa-claro p-4 text-sm font-bold text-rosa-osc">{error}</p>}

        <button
          type="submit"
          disabled={saving || compressing}
          className="sticky bottom-4 min-h-14 rounded-full bg-rosa-osc text-lg font-bold text-white shadow-lg transition hover:bg-[#a33d55] disabled:opacity-60"
        >
          {saving ? status || 'Guardando…' : product ? 'Guardar cambios' : 'Guardar artículo'}
        </button>
      </form>
    </main>
  )
}
