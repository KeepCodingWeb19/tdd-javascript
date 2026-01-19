import { query, validationResult } from 'express-validator'
import * as agentService from '../services/agentService.js'
import * as userService from '../services/userService.js'
import { isEven } from '../utils/helpers.js'
import { escapeHTML, formatDate } from '../utils/formatters.js'
import { formatAge } from '../utils/formatters.js'
import { calculatePriceWithDiscount, calculatePriceWithTax, calculatePercentage } from '../utils/calculators.js'

export async function index(req, res, next) {
  try {
    const userId = req.session.userId

    // Usar el servicio para obtener los agentes
    if (userId) {
      res.locals.agents = await agentService.getAgentsByOwner(userId)
      
      // Formatear las edades de los agentes para la vista
      res.locals.agents = res.locals.agents.map(agent => ({
        ...agent.toObject(),
        formattedAge: formatAge(agent.age)
      }))
    } else {
      res.locals.agents = []
    }

    // Ejemplos de uso de helpers y formatters
    const now = new Date()
    res.locals.esPar = isEven(now.getSeconds())
    res.locals.segundoActual = now.getSeconds()

    // Ejemplo de escape HTML para prevenir XSS
    const dangerousCode = '<script>alert("inyectado!!!")</script>'
    res.locals.codigo = escapeHTML(dangerousCode)

    res.render('home')

  } catch (error) {
    next(error)
  }
}

// /param_in_route/45
export function paranInRoute(req, res, next) {
  const num = req.params.num

  res.send('me has pasado ' + num)
}

// /param_in_route_multiple/pantalon/size/M/color/blue
export function paranInRouteMultiple(req, res, next) {
  const product = req.params.product
  const size = req.params.size
  const color = req.params.color

  res.send(`quieres un ${product} de talla ${size} y color ${color}`)
}

// /param_in_query?color=rojo
export const validateParamInQuery = [
  query('color')
    // .notEmpty()
    .custom(value => {
      return ['red', 'blue'].includes(value)
    })
    .withMessage('must be red or blue'),
  query('talla')
    .isNumeric()
    .withMessage('must be numeric')
]
export function paramInQuery(req, res, next) {
  validationResult(req).throw()

  const color = req.query.color


  console.log(req.query)

  res.send(`el color es ${color}`)
}

// POST /post_with_body
export function postWithBody(req, res, next) {
  const { age, color } = req.body

  res.send('ok')
}

/**
 * Endpoint para obtener estadísticas de agentes del usuario
 * GET /api/agents/statistics
 */
export async function getAgentStatistics(req, res, next) {
  try {
    const userId = req.session.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      })
    }

    const statistics = await agentService.getAgentStatistics(userId)
    
    res.json({
      success: true,
      data: statistics
    })

  } catch (error) {
    next(error)
  }
}

/**
 * Endpoint para obtener historial de logins del usuario
 * GET /api/user/login-history
 */
export async function getLoginHistory(req, res, next) {
  try {
    const userId = req.session.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      })
    }

    const limit = parseInt(req.query.limit) || 10
    const history = await userService.getLoginHistory(userId, limit)
    
    // Formatear las fechas para la respuesta
    const formattedHistory = history.map(record => ({
      ...record,
      formattedDate: formatDate(record.timestamp)
    }))
    
    res.json({
      success: true,
      data: formattedHistory
    })

  } catch (error) {
    next(error)
  }
}

/**
 * Endpoint de ejemplo para calcular precios
 * POST /api/calculate/price
 * Body: { basePrice, discountPercent?, taxPercent? }
 */
export function calculatePrice(req, res, next) {
  try {
    const { basePrice, discountPercent, taxPercent } = req.body

    if (typeof basePrice !== 'number' || basePrice <= 0) {
      return res.status(400).json({
        success: false,
        error: 'El precio base debe ser un número positivo'
      })
    }

    let finalPrice = basePrice

    // Aplicar descuento si se proporciona
    if (discountPercent !== undefined) {
      finalPrice = calculatePriceWithDiscount(finalPrice, discountPercent)
    }

    // Aplicar impuesto si se proporciona
    if (taxPercent !== undefined) {
      finalPrice = calculatePriceWithTax(finalPrice, taxPercent)
    }

    // Calcular porcentajes
    const discountAmount = discountPercent ? basePrice * (discountPercent / 100) : 0
    const taxAmount = taxPercent ? finalPrice - (finalPrice / (1 + taxPercent / 100)) : 0

    res.json({
      success: true,
      data: {
        basePrice,
        discountPercent: discountPercent || 0,
        discountAmount,
        taxPercent: taxPercent || 0,
        taxAmount,
        finalPrice: Math.round(finalPrice * 100) / 100
      }
    })

  } catch (error) {
    next(error)
  }
}