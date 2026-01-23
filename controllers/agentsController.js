import * as agentService from '../services/agentService.js'
import { isValidObjectId } from '../utils/helpers.js'
import { getErrorMessage } from '../utils/helpers.js'

export function index(req, res, next) {
  res.render('new-agent')
}

export async function postNew(req, res, next) {
  try {
    const { name, age } = req.body
    const userId = req.session.userId

    // Convertir age a número si viene como string
    const ageNumber = age ? parseInt(age, 10) : null

    // Usar el servicio para crear el agente (incluye validaciones)
    await agentService.createAgent({
      name,
      age: ageNumber,
      owner: userId
    })

    res.redirect('/')

  } catch (error) {
    // Manejar errores de validación mostrándolos en la vista
    res.locals.error = getErrorMessage(error)
    res.locals.name = req.body.name || ''
    res.locals.age = req.body.age || ''
    res.render('new-agent')
  }
}

export async function deleteAgent(req, res, next) {
  try {
    const userId = req.session.userId
    const agentId = req.params.agentId

    // Validar que el agentId sea un ObjectId válido
    if (!isValidObjectId(agentId)) {
      return res.redirect('/?error=invalid_agent_id')
    }

    // Usar el servicio para eliminar el agente
    const deleted = await agentService.deleteAgent(agentId, userId)

    if (!deleted) {
      return res.redirect('/?error=agent_not_found')
    }

    res.redirect('/')

  } catch (error) {
    next(error)
  }
}

export async function editAgent(req, res, next) {

  const agentId = req.params.agentId;

  if (!isValidObjectId(agentId)) {
    return res.status(400).send('Invalid Object ID');
  }

  const agents = await agentService.getAgentsByOwner(req.session.userId);

  const agent = agents.find( i => i._id.toString() === agentId );

  if (!agent) {
    return res.status(404).send('Agent not found');
  }

  const updated = await agentService.updateAgent(agentId, req.session.userId, req.body);

  res.status(200).json(updated);
}