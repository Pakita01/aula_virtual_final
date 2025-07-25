const mongoose = require('mongoose');

const leccionSchema = new mongoose.Schema({
    titulo: {type: String,required: true,trim: true,maxlength: 100},
    descripcion: {type: String, required: true },
    duracion: { type: Number, required: true},//en minutos
    contenido: {type: String,required: true},
    estado: {type: String, enum: ['Activo', 'Inactivo', 'Borrador'],default: 'Borrador'},
    fecha_creacion: {type: Date,default: Date.now},
    imagenUrl: { type: String, default: '' },
    archivoUrl: { type: String, default: '' }
});

module.exports = mongoose.model('Leccion', leccionSchema);