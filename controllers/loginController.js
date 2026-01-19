import * as userService from '../services/userService.js'
import { getClientIP } from '../utils/helpers.js'
import { getErrorMessage } from '../utils/helpers.js'

export function index(req, res, next) {
  res.locals.error = ''
  res.locals.email = ''
  res.render('login')
}

export async function postLogin(req, res, next) {
  try {
    const { email, password } = req.body
    const redir = req.query.redir

    // Usar el servicio para autenticar el usuario
    const user = await userService.authenticateUser(email, password)

    if (!user) {
      res.locals.error = 'Invalid credentials'
      res.locals.email = email
      res.render('login')
      return
    }

    // Registrar el inicio de sesión usando el servicio
    const ip = getClientIP(req)
    await userService.recordLogin(user.id, ip)

    // Establecer la sesión
    req.session.userId = user.id

    res.redirect(redir ? redir : '/')

  } catch (error) {
    // Manejar errores mostrándolos en la vista
    res.locals.error = getErrorMessage(error)
    res.locals.email = req.body.email || ''
    res.render('login')
  }
}

export function logout(req, res, next) {
  req.session.regenerate(err => {
    if (err) {
      next(err)
      return
    }
    res.redirect('/')
  })
}