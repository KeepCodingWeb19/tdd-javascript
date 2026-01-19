import Agent from '../models/Agent.js'
import { isValidAge, isValidName } from '../utils/validators.js'
import { formatName } from '../utils/formatters.js'
import { calculateAverageAge } from '../utils/calculators.js'

/**
 * Servicio de lógica de negocio para agentes
 * Estas funciones tienen dependencias (modelos, otras funciones) y son perfectas para aprender mocks
 */

/**
 * Crea un nuevo agente con validaciones
 * @param {object} agentData - Datos del agente { name, age, owner }
 * @returns {Promise<object>} - Agente creado
 */
export async function createAgent(agentData) {
  const { name, age, owner } = agentData
  
  // Validaciones
  if (!isValidName(name)) {
    throw new Error('El nombre del agente no es válido')
  }
  
  if (!isValidAge(age)) {
    throw new Error('La edad del agente debe estar entre 18 y 130 años')
  }
  
  if (!owner) {
    throw new Error('El agente debe tener un propietario')
  }
  
  // Formatear el nombre
  const formattedName = formatName(name)
  
  // Crear el agente
  const agent = new Agent({
    name: formattedName,
    age,
    owner
  })
  
  await agent.save()
  return agent
}

/**
 * Obtiene todos los agentes de un usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} - Array de agentes
 */
export async function getAgentsByOwner(userId) {
  if (!userId) {
    throw new Error('Se requiere un ID de usuario')
  }
  
  const agents = await Agent.find({ owner: userId })
  return agents
}

/**
 * Elimina un agente si pertenece al usuario
 * @param {string} agentId - ID del agente
 * @param {string} userId - ID del usuario
 * @returns {Promise<boolean>} - true si se eliminó, false si no existía o no pertenecía al usuario
 */
export async function deleteAgent(agentId, userId) {
  if (!agentId || !userId) {
    throw new Error('Se requieren tanto el ID del agente como el ID del usuario')
  }
  
  const result = await Agent.deleteOne({ _id: agentId, owner: userId })
  return result.deletedCount > 0
}

/**
 * Obtiene estadísticas de los agentes de un usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<object>} - Objeto con estadísticas { count, averageAge, oldest, youngest }
 */
export async function getAgentStatistics(userId) {
  if (!userId) {
    throw new Error('Se requiere un ID de usuario')
  }
  
  const agents = await Agent.find({ owner: userId })
  
  if (agents.length === 0) {
    return {
      count: 0,
      averageAge: 0,
      oldest: null,
      youngest: null
    }
  }
  
  const ages = agents.map(agent => agent.age)
  const averageAge = calculateAverageAge(ages)
  
  const sortedByAge = [...agents].sort((a, b) => a.age - b.age)
  const youngest = sortedByAge[0]
  const oldest = sortedByAge[sortedByAge.length - 1]
  
  return {
    count: agents.length,
    averageAge,
    oldest: {
      name: oldest.name,
      age: oldest.age
    },
    youngest: {
      name: youngest.name,
      age: youngest.age
    }
  }
}

/**
 * Actualiza un agente si pertenece al usuario
 * @param {string} agentId - ID del agente
 * @param {string} userId - ID del usuario
 * @param {object} updateData - Datos a actualizar { name?, age? }
 * @returns {Promise<object|null>} - Agente actualizado o null si no existe o no pertenece al usuario
 */
export async function updateAgent(agentId, userId, updateData) {
  if (!agentId || !userId) {
    throw new Error('Se requieren tanto el ID del agente como el ID del usuario')
  }
  
  const { name, age } = updateData
  
  // Validar datos si se proporcionan
  if (name !== undefined && !isValidName(name)) {
    throw new Error('El nombre del agente no es válido')
  }
  
  if (age !== undefined && !isValidAge(age)) {
    throw new Error('La edad del agente debe estar entre 18 y 130 años')
  }
  
  // Preparar datos de actualización
  const updateFields = {}
  if (name !== undefined) {
    updateFields.name = formatName(name)
  }
  if (age !== undefined) {
    updateFields.age = age
  }
  updateFields.updated = new Date()
  
  // Actualizar solo si pertenece al usuario
  const agent = await Agent.findOneAndUpdate(
    { _id: agentId, owner: userId },
    updateFields,
    { new: true }
  )
  
  return agent
}
