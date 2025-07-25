// routes/notaRoutes.js

const express = require('express');
const router = express.Router();
// IMPORTANTE: Asegúrate de que esta ruta sea correcta para tu modelo Nota
// Si tu modelo se llama 'notaModel.js', cambia la línea a:
// const Nota = require('../models/notaModel');
const Nota = require('../models/notaModel'); // <-- Ajusta esto si tu archivo es notaModel.js

// POST /api/notas-asignadas - Asignar una nueva nota
router.post('/', async (req, res) => {
    try {
        const { estudianteId, tareaId, calificacion, comentarios } = req.body;
        const nuevaNota = new Nota({
            estudiante: estudianteId,
            tarea: tareaId,
            calificacion,
            comentarios
        });
        const notaGuardada = await nuevaNota.save();
        res.status(201).json(notaGuardada);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Error de validación al asignar nota', errors: err.errors });
        }
        console.error('Error al asignar nota:', err);
        res.status(500).json({ message: 'Error interno del servidor al asignar nota' });
    }
});

// GET /api/notas-asignadas - Obtener todas las notas asignadas (Opcional)
router.get('/', async (req, res) => {
    try {
        // Popula el estudiante y la tarea para mostrar información útil
        const notas = await Nota.find()
            // Asumiendo que tus usuarios son el modelo 'User' o 'usuarioModel'
            .populate('estudiante', 'nombre apellido email')
            .populate('tarea', 'titulo nivel grado');
        res.status(200).json(notas);
    } catch (err) {
        console.error('Error al obtener notas asignadas:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;