/**
 * Utilidades de formateo de datos
 * Funciones puras para transformar y formatear datos
 */

/**
 * Formatea un nombre capitalizando la primera letra de cada palabra
 * @param {string} name - Nombre a formatear
 * @returns {string} - Nombre formateado
 */
export function formatName(name) {
  if (!name || typeof name !== 'string') {
    return ''
  }
  
  return name
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Formatea un email a minúsculas y sin espacios
 * @param {string} email - Email a formatear
 * @returns {string} - Email formateado
 */
export function formatEmail(email) {
  if (!email || typeof email !== 'string') {
    return ''
  }
  
  return email.trim().toLowerCase()
}

/**
 * Formatea una fecha a un string legible
 * @param {Date} date - Fecha a formatear
 * @param {string} locale - Locale para el formateo (por defecto 'es-ES')
 * @returns {string} - Fecha formateada
 */
export function formatDate(date, locale = 'es-ES') {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return ''
  }
  
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Formatea una fecha a un string con hora
 * @param {Date} date - Fecha a formatear
 * @param {string} locale - Locale para el formateo (por defecto 'es-ES')
 * @returns {string} - Fecha y hora formateadas
 */
export function formatDateTime(date, locale = 'es-ES') {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return ''
  }
  
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Formatea un número como edad con texto descriptivo
 * @param {number} age - Edad a formatear
 * @returns {string} - Edad formateada (ej: "25 años")
 */
export function formatAge(age) {
  if (typeof age !== 'number' || isNaN(age)) {
    return ''
  }
  
  return `${age} ${age === 1 ? 'año' : 'años'}`
}

/**
 * Escapa caracteres HTML peligrosos para prevenir XSS
 * @param {string} text - Texto a escapar
 * @returns {string} - Texto escapado
 */
export function escapeHTML(text) {
  if (!text || typeof text !== 'string') {
    return ''
  }
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  
  return text.replace(/[&<>"']/g, char => map[char])
}

/**
 * Trunca un texto a una longitud máxima añadiendo puntos suspensivos
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} - Texto truncado
 */
export function truncateText(text, maxLength = 50) {
  if (!text || typeof text !== 'string') {
    return ''
  }
  
  if (text.length <= maxLength) {
    return text
  }
  
  return text.substring(0, maxLength) + '...'
}
