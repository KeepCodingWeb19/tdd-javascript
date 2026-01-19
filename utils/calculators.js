/**
 * Utilidades de cálculo
 * Funciones puras para realizar cálculos y operaciones matemáticas
 */

/**
 * Calcula el precio con un descuento aplicado
 * @param {number} basePrice - Precio base
 * @param {number} discountPercent - Porcentaje de descuento (0-100)
 * @returns {number} - Precio con descuento aplicado
 */
export function calculatePriceWithDiscount(basePrice, discountPercent) {
  if (typeof basePrice !== 'number' || isNaN(basePrice) || basePrice < 0) {
    throw new Error('El precio base debe ser un número positivo')
  }
  
  if (typeof discountPercent !== 'number' || isNaN(discountPercent)) {
    throw new Error('El porcentaje de descuento debe ser un número')
  }
  
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('El porcentaje de descuento debe estar entre 0 y 100')
  }
  
  const discount = basePrice * (discountPercent / 100)
  return Math.round((basePrice - discount) * 100) / 100
}

/**
 * Calcula el precio con impuestos aplicados
 * @param {number} basePrice - Precio base
 * @param {number} taxPercent - Porcentaje de impuesto (por defecto 21)
 * @returns {number} - Precio con impuestos aplicados
 */
export function calculatePriceWithTax(basePrice, taxPercent = 21) {
  if (typeof basePrice !== 'number' || isNaN(basePrice) || basePrice < 0) {
    throw new Error('El precio base debe ser un número positivo')
  }
  
  if (typeof taxPercent !== 'number' || isNaN(taxPercent) || taxPercent < 0) {
    throw new Error('El porcentaje de impuesto debe ser un número positivo')
  }
  
  const tax = basePrice * (taxPercent / 100)
  return Math.round((basePrice + tax) * 100) / 100
}

/**
 * Calcula la edad promedio de un array de edades
 * @param {number[]} ages - Array de edades
 * @returns {number} - Edad promedio
 */
export function calculateAverageAge(ages) {
  if (!Array.isArray(ages)) {
    throw new Error('Se espera un array de edades')
  }
  
  if (ages.length === 0) {
    throw new Error('El array de edades no puede estar vacío')
  }
  
  const validAges = ages.filter(age => typeof age === 'number' && !isNaN(age) && age > 0)
  
  if (validAges.length === 0) {
    throw new Error('No hay edades válidas en el array')
  }
  
  const sum = validAges.reduce((acc, age) => acc + age, 0)
  return Math.round((sum / validAges.length) * 100) / 100
}

/**
 * Calcula estadísticas de un array de números
 * @param {number[]} numbers - Array de números
 * @returns {object} - Objeto con min, max, promedio y suma
 */
export function calculateStatistics(numbers) {
  if (!Array.isArray(numbers)) {
    throw new Error('Se espera un array de números')
  }
  
  if (numbers.length === 0) {
    throw new Error('El array no puede estar vacío')
  }
  
  const validNumbers = numbers.filter(num => typeof num === 'number' && !isNaN(num))
  
  if (validNumbers.length === 0) {
    throw new Error('No hay números válidos en el array')
  }
  
  const sum = validNumbers.reduce((acc, num) => acc + num, 0)
  const min = Math.min(...validNumbers)
  const max = Math.max(...validNumbers)
  const average = sum / validNumbers.length
  
  return {
    min,
    max,
    average: Math.round(average * 100) / 100,
    sum,
    count: validNumbers.length
  }
}

/**
 * Calcula el número de días entre dos fechas
 * @param {Date} startDate - Fecha de inicio
 * @param {Date} endDate - Fecha de fin
 * @returns {number} - Número de días de diferencia
 */
export function calculateDaysBetween(startDate, endDate) {
  if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
    throw new Error('La fecha de inicio debe ser una fecha válida')
  }
  
  if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
    throw new Error('La fecha de fin debe ser una fecha válida')
  }
  
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

/**
 * Calcula el porcentaje de un valor sobre un total
 * @param {number} value - Valor parcial
 * @param {number} total - Valor total
 * @returns {number} - Porcentaje (0-100)
 */
export function calculatePercentage(value, total) {
  if (typeof value !== 'number' || isNaN(value) || value < 0) {
    throw new Error('El valor debe ser un número positivo')
  }
  
  if (typeof total !== 'number' || isNaN(total) || total <= 0) {
    throw new Error('El total debe ser un número positivo mayor que cero')
  }
  
  if (value > total) {
    throw new Error('El valor no puede ser mayor que el total')
  }
  
  return Math.round((value / total) * 100 * 100) / 100
}
