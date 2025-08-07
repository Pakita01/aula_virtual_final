const Nota = require('../models/notaModel');
const Tarea = require('../models/tareaModel');
const Usuario = require('../models/usuarioModel');

// Obtener todas las notas de un estudiante
const getNotasByEstudiante = async (req, res) => {
    try {
        const notas = await Nota.find({ id_estudiante: req.params.id })
            .populate('id_tarea', 'titulo puntos nivel grado')
            .sort({ fecha_calificacion: -1 });
        res.json(notas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener todas las notas de una tarea
const getNotasByTarea = async (req, res) => {
    try {
        const notas = await Nota.find({ id_tarea: req.params.id })
            .populate('id_estudiante', 'nombre apellido email')
            .sort({ calificacion: -1 });
        res.json(notas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Crear o actualizar una nota
const upsertNota = async (req, res) => {
    try {
        // Verificar que la tarea existe
        const tarea = await Tarea.findById(req.body.id_tarea);
        if (!tarea) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        // Verificar que el estudiante existe
        const estudiante = await Usuario.findById(req.body.id_estudiante);
        if (!estudiante || estudiante.rol !== 'estudiante') {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }

        // Validar que la calificación no exceda los puntos de la tarea
        if (req.body.calificacion > tarea.puntos) {
            return res.status(400).json({ 
                error: `La calificación no puede exceder ${tarea.puntos} puntos` 
            });
        }

        const nota = await Nota.findOneAndUpdate(
            { id_estudiante: req.body.id_estudiante, id_tarea: req.body.id_tarea },
            req.body,
            { new: true, upsert: true, runValidators: true }
        );

        res.status(201).json(nota);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Eliminar una nota
const deleteNota = async (req, res) => {
    try {
        await Nota.findByIdAndDelete(req.params.id);
        res.json({ message: 'Nota eliminada' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    getNotasByEstudiante,
    getNotasByTarea,
    upsertNota,
    deleteNota
};