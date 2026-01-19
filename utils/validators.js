/**
 * Utilidades de validación para el proyecto
 * Estas funciones son puras y perfectas para testing unitario
 */

/**
 * Valida si un email tiene un formato válido
 * @param {string} email - Email a validar
 * @returns {boolean} - true si el email es válido, false en caso contrario
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Valida si una contraseña cumple con los requisitos de seguridad
 * Requisitos: mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
 * @param {string} password - Contraseña a validar
 * @returns {boolean} - true si la contraseña es válida, false en caso contrario
 */
export function isValidPassword(password) {
  if (!password || typeof password !== 'string') {
    return false
  }
  
  if (password.length < 8) {
    return false
  }
  
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  
  return hasUpperCase && hasLowerCase && hasNumber
}

/**
 * Valida si una edad está en un rango válido
 * @param {number} age - Edad a validar
 * @param {number} min - Edad mínima (por defecto 18)
 * @param {number} max - Edad máxima (por defecto 130)
 * @returns {boolean} - true si la edad es válida, false en caso contrario
 */
export function isValidAge(age, min = 18, max = 130) {
  if (typeof age !== 'number' || isNaN(age)) {
    return false
  }
  
  return age >= min && age <= max
}

/**
 * Valida si un nombre es válido (no vacío, sin caracteres especiales peligrosos)
 * @param {string} name - Nombre a validar
 * @returns {boolean} - true si el nombre es válido, false en caso contrario
 */
export function isValidName(name) {
  if (!name || typeof name !== 'string') {
    return false
  }
  
  const trimmedName = name.trim()
  if (trimmedName.length === 0 || trimmedName.length > 100) {
    return false
  }
  
  // Permitir letras, espacios, guiones y apostrofes
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/
  return nameRegex.test(trimmedName)
}

/**
 * Valida si un objeto tiene todas las propiedades requeridas
 * @param {object} obj - Objeto a validar
 * @param {string[]} requiredFields - Array de nombres de propiedades requeridas
 * @returns {boolean} - true si todas las propiedades están presentes, false en caso contrario
 */
export function hasRequiredFields(obj, requiredFields) {
  if (!obj || typeof obj !== 'object' || !Array.isArray(requiredFields)) {
    return false
  }
  
  return requiredFields.every(field => {
    return obj.hasOwnProperty(field) && obj[field] != null
  })
}

/**
 * Valida si una IP tiene un formato válido (IPv4)
 * @param {string} ip - Dirección IP a validar
 * @returns {boolean} - true si la IP es válida, false en caso contrario
 */
export function isValidIP(ip) {
  if (!ip || typeof ip !== 'string') {
    return false
  }
  
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
  if (!ipRegex.test(ip)) {
    return false
  }
  
  const parts = ip.split('.')
  return parts.every(part => {
    const num = parseInt(part, 10)
    return num >= 0 && num <= 255
  })
}
