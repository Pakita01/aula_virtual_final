// models/notaModel.js (o Nota.js)
const mongoose = require('mongoose');

const notaSchema = new mongoose.Schema({
    estudiante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario', // O 'Usuario' si tu modelo de usuario se llama así
        required: true
    },
    tarea: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tarea', // Referencia al modelo Tarea
        required: true
    },
    calificacion: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    fechaAsignacion: {
        type: Date,
        default: Date.now
    },
    comentarios: {
        type: String,
        trim: true
    }
});

module.exports = mongoose.model('Nota', notaSchema);