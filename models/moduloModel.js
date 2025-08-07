const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
    id_curso: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true
    },
    titulo: {
        type: String,
        required: [true, 'Por favor agregue un título'],
        maxlength: [100, 'El título no puede exceder los 100 caracteres']
    },
    descripcion: {
        type: String
    }
});

module.exports = mongoose.model('Module', ModuleSchema);