const router = require("express").Router()

const Book = require('./../models/Book.model')
const Author = require('./../models/Author.model')

router.get("/", (req, res, next) => {
  res.render("index")
})

// Listado de libros
router.get('/libros', (req, res) => {

  Book
    .find()
    .select('title author')
    .populate('author')     // Nombre del campo a popular
    .then(books => res.render('books/list', { books }))
    .catch(err => console.log(err))
})


// Detalles de libros
router.get('/libros/detalles/:book_id', (req, res) => {

  const { book_id } = req.params
  console.log('NO ARRIESGO =====>', book_id)

  Book
    .findById(book_id)
    .populate('author')
    .then(theBook => res.render('books/details', theBook))
    .catch(err => console.log(err))
})


// Formulario de creación: renderizado
router.get('/libros/crear', (req, res) => {
  res.render('books/new-book-form')
})

// Formulario de creación: gestión
router.post('/libros/crear', (req, res) => {

  const { title, description, rating, author } = req.body

  Book
    .create({ title, description, rating, author })
    .then(theBook => res.redirect(`/libros/detalles/${theBook._id}`))
    .catch(err => console.log(err))
})



// Formulario de edición: renderizado
router.get('/libros/editar', (req, res) => {

  const { book_id } = req.query
  console.log('NO ARRIESGO ====>', book_id)

  Book
    .findById(book_id)
    .then(theBook => res.render('books/edit-book-form', theBook))
    .catch(err => console.log(err))
})


// Formulario de edición: gestión
router.post('/libros/editar/:book_id', (req, res) => {

  const { book_id } = req.params
  const { title, description, rating, author } = req.body

  Book
    .findByIdAndUpdate(book_id, { title, description, rating, author }, { new: true })
    .then(theBook => res.redirect(`/libros/detalles/${theBook._id}`))
    .catch(err => console.log(err))
})




module.exports = router