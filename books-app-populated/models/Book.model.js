const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: String,
    description: String,
    author: [{                              // Es un array porque pueden tener varios autores
        type: Schema.Types.ObjectId,        // Tipo de datos ObjectId
        ref: 'Author'                       // Nombre del modelo
    }],
    rating: Number
}, {
    timestamps: true
})

const Book = mongoose.model("Book", bookSchema);

module.exports = Book