const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
    estudiante: { type: String, required: true },
    nivel: { type: String, required: true },
    grado: { type: String, required: true },
    modulo: { type: Number, required: true },
    monto: { type: Number, required: true },
    fecha: { type: Date, required: true },
    estado: { type: String, enum: ['Pendiente', 'Completado'], default: 'Pendiente' },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
     }
});

module.exports = mongoose.model('Pago', pagoSchema);
