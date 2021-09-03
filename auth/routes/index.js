const router = require("express").Router()
const bcrypt = require('bcrypt')
const User = require("../models/User.model")

router.get("/", (req, res, next) => res.render("index"))


// Signup
router.get('/registro', (req, res) => res.render('auth/signup-form'))
router.post('/registro', (req, res) => {

  const { username, userPwd } = req.body

  if (userPwd.length === 0) {       // Si la contraseña está vacía
    res.render('auth/signup-form', { errorMsg: 'La contraseña es obligatoria' })
    return
  }

  User
    .findOne({ username })
    .then(user => {

      if (user) {                   // Si el nombre de usuario ya existe
        res.render('auth/signup-form', { errorMsg: 'Usuario ya registrado' })
        return
      }

      const bcryptSalt = 10
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(userPwd, salt)     // Contraseña hasheada

      User
        .create({ username, password: hashPass })         // <== !!!
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))

    })
    .catch(err => console.log(err))
})



// Login
router.get('/iniciar-sesion', (req, res) => res.render('auth/login-form'))
router.post('/iniciar-sesion', (req, res) => {

  const { username, userPwd } = req.body

  if (userPwd.length === 0 || username.length === 0) {       // Si la contraseña está vacía
    res.render('auth/login-form', { errorMsg: 'Rellena los campos' })
    return
  }

  User
    .findOne({ username })
    .then(user => {

      if (!user) {
        res.render('auth/login-form', { errorMsg: 'Usuario no reconocido' })
        return
      }

      if (bcrypt.compareSync(userPwd, user.password) === false) {
        res.render('auth/login-form', { errorMsg: 'Contraseña incorrecta' })
        return
      }

      req.session.currentUser = user
      res.redirect('/perfil')
    })
    .catch(err => console.log(err))

})


// Logout
router.get('/cerrar-sesion', (req, res) => {
  req.session.destroy(() => res.redirect('/'))
})


// MIDDLEWARE DETECTOR DE SESIÓN
router.use((req, res, next) => {
  req.session.currentUser ? next() : res.render('auth/login-form', { errorMsg: 'Desautorizado' })
})

router.get('/perfil', (req, res) => {
  res.render('user/profile', { user: req.session.currentUser })
})


module.exports = router