/**
 * Funciones auxiliares y helpers
 * Utilidades generales para el proyecto
 */

/**
 * Obtiene la IP real del cliente desde el request
 * @param {object} req - Objeto request de Express
 * @returns {string} - Dirección IP del cliente
 */
export function getClientIP(req) {
  if (!req) {
    return ''
  }
  
  // Intentar obtener la IP de diferentes fuentes
  return req.ip || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress ||
         (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
         ''
}

/**
 * Genera un mensaje de error amigable a partir de un error
 * @param {Error} error - Error a procesar
 * @returns {string} - Mensaje de error amigable
 */
export function getErrorMessage(error) {
  if (!error) {
    return 'Ha ocurrido un error desconocido'
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return 'Ha ocurrido un error desconocido'
}

/**
 * Verifica si un valor es un ObjectId válido de MongoDB
 * @param {string} id - ID a verificar
 * @returns {boolean} - true si es un ObjectId válido, false en caso contrario
 */
export function isValidObjectId(id) {
  if (!id || typeof id !== 'string') {
    return false
  }
  
  // ObjectId de MongoDB tiene 24 caracteres hexadecimales
  const objectIdRegex = /^[0-9a-fA-F]{24}$/
  return objectIdRegex.test(id)
}

/**
 * Crea un objeto de respuesta estándar para APIs
 * @param {boolean} success - Indica si la operación fue exitosa
 * @param {any} data - Datos a incluir en la respuesta
 * @param {string} message - Mensaje opcional
 * @returns {object} - Objeto de respuesta estándar
 */
export function createResponse(success, data = null, message = '') {
  return {
    success,
    data,
    message,
    timestamp: new Date().toISOString()
  }
}

/**
 * Crea un objeto de error estándar para APIs
 * @param {string} message - Mensaje de error
 * @param {number} statusCode - Código de estado HTTP (por defecto 400)
 * @returns {object} - Objeto de error estándar
 */
export function createErrorResponse(message, statusCode = 400) {
  return {
    success: false,
    error: {
      message,
      statusCode
    },
    timestamp: new Date().toISOString()
  }
}

/**
 * Verifica si un número es par
 * @param {number} num - Número a verificar
 * @returns {boolean} - true si es par, false si es impar
 */
export function isEven(num) {
  if (typeof num !== 'number' || isNaN(num)) {
    return false
  }
  
  return num % 2 === 0
}

/**
 * Verifica si un número es impar
 * @param {number} num - Número a verificar
 * @returns {boolean} - true si es impar, false si es par
 */
export function isOdd(num) {
  return !isEven(num)
}

/**
 * Duerme durante un número determinado de milisegundos
 * Útil para simular operaciones asíncronas en tests
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  if (typeof ms !== 'number' || ms < 0) {
    throw new Error('Los milisegundos deben ser un número positivo')
  }
  
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retry una función asíncrona un número determinado de veces
 * @param {Function} fn - Función asíncrona a ejecutar
 * @param {number} maxRetries - Número máximo de intentos (por defecto 3)
 * @param {number} delay - Delay entre intentos en ms (por defecto 1000)
 * @returns {Promise<any>} - Resultado de la función
 */
export async function retry(fn, maxRetries = 3, delay = 1000) {
  if (typeof fn !== 'function') {
    throw new Error('Se espera una función')
  }
  
  if (typeof maxRetries !== 'number' || maxRetries < 1) {
    throw new Error('El número máximo de intentos debe ser al menos 1')
  }
  
  let lastError
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt < maxRetries) {
        await sleep(delay)
      }
    }
  }
  
  throw lastError
}
