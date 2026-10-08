'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { CAROUSEL_MS } from '@/lib/config'

interface Props {
  images: string[]
  alt: string
  /** Se llama al tocar la foto (sin deslizar). */
  onOpen?: () => void
  /** Foto apagada (artículo agotado). */
  dim?: boolean
  /** Carga inmediata (para la vista ampliada). */
  eager?: boolean
  className?: string
}

export default function ImageCarousel({ images, alt, onOpen, dim = false, eager = false, className = '' }: Props) {
  const count = images.length
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const swiped = useRef(false)
  const resume = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Respeta "reducir movimiento" del dispositivo
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = () => setReduced(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Cambio automático de foto
  useEffect(() => {
    if (count < 2 || paused || reduced) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), CAROUSEL_MS)
    return () => clearInterval(timer)
  }, [count, paused, reduced])

  useEffect(() => {
    if (index >= count) setIndex(0)
  }, [count, index])

  useEffect(() => {
    return () => {
      if (resume.current) clearTimeout(resume.current)
    }
  }, [])

  const go = (next: number) => setIndex(((next % count) + count) % count)

  function onTouchStart(e: React.TouchEvent) {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    swiped.current = false
    setPaused(true)
    if (resume.current) clearTimeout(resume.current)
  }

  function onTouchEnd(e: React.TouchEvent) {
    const start = touch.current
    touch.current = null
    if (start && count > 1) {
      const dx = e.changedTouches[0].clientX - start.x
      const dy = e.changedTouches[0].clientY - start.y
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        go(index + (dx < 0 ? 1 : -1))
        swiped.current = true
      }
    }
    // Vuelve a avanzar solo unos segundos después de dejar de tocar
    resume.current = setTimeout(() => setPaused(false), 4000)
  }

  function handleClick() {
    if (swiped.current) {
      swiped.current = false
      return
    }
    onOpen?.()
  }

  if (count === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-lavanda-suave text-lavanda ${className}`}
        onClick={onOpen}
        role="img"
        aria-label={`${alt} (sin foto todavía)`}
      >
        <Heart className="size-10 fill-current opacity-60" aria-hidden />
      </div>
    )
  }

  return (
    <div
      className={`group/carousel relative overflow-hidden bg-rosa-claro ${onOpen ? 'cursor-pointer' : ''} ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={handleClick}
    >
      <div
        className={`flex h-full ${reduced ? '' : 'transition-transform duration-700 ease-out'}`}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={i === 0 ? alt : `${alt} (foto ${i + 1})`}
            loading={eager || i === 0 ? 'eager' : 'lazy'}
            draggable={false}
            className={`h-full w-full min-w-full select-none object-cover transition duration-300 ${dim ? 'opacity-60 grayscale' : ''}`}
          />
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Foto anterior"
            onClick={(e) => {
              e.stopPropagation()
              go(index - 1)
            }}
            className="absolute left-2 top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-tinta opacity-0 shadow transition group-hover/carousel:opacity-100 focus-visible:opacity-100 md:flex"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Foto siguiente"
            onClick={(e) => {
              e.stopPropagation()
              go(index + 1)
            }}
            className="absolute right-2 top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-tinta opacity-0 shadow transition group-hover/carousel:opacity-100 focus-visible:opacity-100 md:flex"
          >
            <ChevronRight className="size-5" />
          </button>

          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ver foto ${i + 1} de ${count}`}
                aria-current={i === index}
                onClick={(e) => {
                  e.stopPropagation()
                  setIndex(i)
                }}
                className="flex size-5 items-center justify-center"
              >
                <span
                  className={`block rounded-full transition-all ${
                    i === index ? 'h-2 w-5 bg-white shadow' : 'size-2 bg-white/70 shadow'
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
