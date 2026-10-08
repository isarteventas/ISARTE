import type { Section } from './types'

/**
 * ============================================================
 *  DATOS DE ISARTE — AQUÍ CAMBIAS LO PERSONAL DE LA PÁGINA
 * ============================================================
 */
export const siteConfig = {
  name: 'Isarte Creaciones',
  tagline: 'Detalles hechos con amor',

  // WhatsApp: código de país + número, SIN "+" ni espacios. Bolivia = 591.
  // Ejemplo: 59171234567   <-- CAMBIA ESTE NÚMERO
  whatsapp: '59169356148',
  whatsappDisplay: '+591 69356148', // cómo se muestra en la página

  // Deja vacío ('') el que no uses y no aparecerá.
  instagram: '', // ej: 'https://instagram.com/isarte'
  facebook: '', // ej: 'https://facebook.com/isarte'
  tiktok: 'https://www.tiktok.com/@isabel456_1993',

  // Texto de "Sobre mí" (cámbialo por tu historia real)
  aboutTitle: 'Creaciones con intención, hechas con el corazón.',
  aboutText:
    'Isarte nace de la ilusión de transformar materiales sencillos en recuerdos que acompañen tu historia. Cada pieza se hace a mano, con cariño y pensando en quien la va a recibir. Gracias por elegir lo hecho a mano.',
}

// Categorías de cada pestaña (puedes agregar o quitar).
export const categories: Record<Section, string[]> = {
  creaciones: ['Papelería creativa', 'Recuerdos', 'Llaveros', 'Agendas', 'Otros'],
  ropa: ['Blusas', 'Vestidos', 'Conjuntos', 'Ropa de bebé', 'Accesorios', 'Otros'],
}

// Tallas disponibles para elegir en el panel (solo pestaña Ropa).
export const sizeOptions = {
  adultos: ['XS', 'S', 'M', 'L', 'XL', 'Única'],
  ninos: ['0-3 m', '3-6 m', '6-12 m', '2', '4', '6', '8', '10', '12'],
}

export const sectionInfo: Record<Section, { label: string; path: string }> = {
  creaciones: { label: 'Creaciones', path: '/creaciones' },
  ropa: { label: 'Ropa', path: '/ropa' },
}

export const NEW_DAYS = 14 // días que un artículo se marca como "Nuevo"
export const MAX_IMAGES = 8 // máximo de fotos por artículo
export const CAROUSEL_MS = 3500 // cada cuántos milisegundos cambia la foto
