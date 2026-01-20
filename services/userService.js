import User from '../models/User.js'
import { isValidEmail, isValidPassword, isValidIP } from '../utils/validators.js'
import { formatEmail } from '../utils/formatters.js'

/**
 * Servicio de lógica de negocio para usuarios
 * Estas funciones tienen dependencias (modelos, otras funciones) y son perfectas para aprender mocks
 */

/**
 * Crea un nuevo usuario con validaciones
 * @param {object} userData - Datos del usuario { email, password }
 * @returns {Promise<object>} - Usuario creado
 */
export async function createUser(userData) {
  const { email, password } = userData
  
  // Validaciones
  if (!isValidEmail(email)) {
    throw new Error('El email no tiene un formato válido')
  }
  
  if (!isValidPassword(password)) {
    throw new Error('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número')
  }
  
  // Formatear el email
  const formattedEmail = formatEmail(email)
  
  // Verificar si el usuario ya existe
  const existingUser = await User.findOne({ email: formattedEmail })
  if (existingUser) {
    throw new Error('Ya existe un usuario con ese email')
  }
  
  // Hashear la contraseña
  const hashedPassword = await User.hashPassword(password)

  // Crear el usuario
  const user = new User({
    email: formattedEmail,
    password: hashedPassword
  });
  
  await user.save()
  return user
}

/**
 * Autentica un usuario con email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<object|null>} - Usuario si las credenciales son correctas, null en caso contrario
 */
export async function authenticateUser(email, password) {
  if (!email || !password) {
    throw new Error('Se requieren email y contraseña')
  }
  
  const formattedEmail = formatEmail(email)
  const user = await User.findOne({ email: formattedEmail })
  
  if (!user) {
    return null
  }
  
  const isPasswordValid = await user.comparePassword(password)
  if (!isPasswordValid) {
    return null
  }
  
  return user
}

/**
 * Registra un inicio de sesión para un usuario
 * @param {string} userId - ID del usuario
 * @param {string} ip - Dirección IP del inicio de sesión
 * @returns {Promise<object>} - Usuario actualizado
 */
export async function recordLogin(userId, ip) {
  if (!userId) {
    throw new Error('Se requiere un ID de usuario')
  }
  
  if (!isValidIP(ip)) {
    throw new Error('La dirección IP no es válida')
  }
  
  const user = await User.findById(userId)
  if (!user) {
    throw new Error('Usuario no encontrado')
  }
  
  user.addLoginRecord(ip)
  await user.save()
  
  return user
}

/**
 * Obtiene el historial de inicios de sesión de un usuario
 * @param {string} userId - ID del usuario
 * @param {number} limit - Número máximo de registros a devolver (por defecto 10)
 * @returns {Promise<Array>} - Array de registros de inicio de sesión
 */
export async function getLoginHistory(userId, limit = 10) {
  if (!userId) {
    throw new Error('Se requiere un ID de usuario')
  }
  
  if (typeof limit !== 'number' || limit < 1) {
    throw new Error('El límite debe ser un número positivo')
  }
  
  const user = await User.findById(userId)
  if (!user) {
    throw new Error('Usuario no encontrado')
  }
  
  if (!user.loginRecords || user.loginRecords.length === 0) {
    return []
  }
  
  // Ordenar por fecha descendente (más recientes primero) y limitar
  const sortedRecords = [...user.loginRecords]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit)
  
  return sortedRecords.map(record => ({
    ip: record.ip,
    timestamp: record.timestamp
  }))
}

/**
 * Obtiene estadísticas de un usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<object>} - Objeto con estadísticas { email, totalLogins, lastLogin }
 */
export async function getUserStatistics(userId) {
  if (!userId) {
    throw new Error('Se requiere un ID de usuario')
  }
  
  const user = await User.findById(userId)
  if (!user) {
    throw new Error('Usuario no encontrado')
  }
  
  const loginRecords = user.loginRecords || []
  const totalLogins = loginRecords.length
  
  let lastLogin = null
  if (totalLogins > 0) {
    const sortedRecords = [...loginRecords].sort((a, b) => b.timestamp - a.timestamp)
    lastLogin = sortedRecords[0].timestamp
  }
  
  return {
    email: user.email,
    totalLogins,
    lastLogin
  }
}

/**
 * Verifica si un email ya está registrado
 * @param {string} email - Email a verificar
 * @returns {Promise<boolean>} - true si el email ya existe, false en caso contrario
 */
export async function emailExists(email) {
  if (!isValidEmail(email)) {
    throw new Error('El email no tiene un formato válido')
  }
  
  const formattedEmail = formatEmail(email)
  const user = await User.findOne({ email: formattedEmail })
  
  return !!user
}
