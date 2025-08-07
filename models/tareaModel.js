const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    nivel: { 
        type: String, 
        required: true,
        enum: ['Principiante', 'Intermedio', 'Avanzado']
    },
    grado: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                if (this.nivel === 'Principiante') {
                    return ['A1', 'A2'].includes(v);
                } else if (this.nivel === 'Intermedio') {
                    return ['B1', 'B2'].includes(v);
                } else {
                    return ['C1', 'C2'].includes(v);
                }
            },
            message: props => `Grado ${props.value} no válido para el nivel ${this.nivel}`
        }
    },
    fecha_creacion: { type: Date, default: Date.now },
    fecha_entrega: { type: Date, required: true },
    puntos: { type: Number, required: true, min: 1, max: 100 }
});

module.exports = mongoose.model('Tarea', tareaSchema);