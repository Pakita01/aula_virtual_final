const express = require('express');
const router = express.Router();
const Tarea = require('../models/tareaModel'); // <-- Asegúrate de que la ruta sea correcta a tu modelo Tarea

// POST /api/tareas - Crear una nueva tarea
router.post('/', async (req, res) => {
    try {
        const nuevaTarea = new Tarea(req.body);
        const tareaGuardada = await nuevaTarea.save();
        res.status(201).json(tareaGuardada);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Error de validación', errors: err.errors });
        }
        console.error('Error al crear tarea:', err);
        res.status(500).json({ message: 'Error interno del servidor al crear tarea' });
    }
});

// GET /api/tareas - Obtener todas las tareas
router.get('/', async (req, res) => {
    try {
        const tareas = await Tarea.find().sort({ fecha_entrega: 1 });
        res.status(200).json(tareas);
    } catch (err) {
        console.error('Error al obtener tareas:', err);
        res.status(500).json({ message: 'Error interno del servidor al obtener tareas' });
    }
});

// GET /api/tareas/:id - Obtener una tarea por ID (Opcional, para editar)
router.get('/:id', async (req, res) => {
    try {
        const tarea = await Tarea.findById(req.params.id);
        if (!tarea) return res.status(404).json({ message: 'Tarea no encontrada' });
        res.status(200).json(tarea);
    } catch (err) {
        console.error('Error al obtener tarea por ID:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// PUT /api/tareas/:id - Actualizar una tarea
router.put('/:id', async (req, res) => {
    try {
        const tareaActualizada = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!tareaActualizada) return res.status(404).json({ message: 'Tarea no encontrada para actualizar' });
        res.status(200).json(tareaActualizada);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Error de validación', errors: err.errors });
        }
        console.error('Error al actualizar tarea:', err);
        res.status(500).json({ message: 'Error interno del servidor al actualizar tarea' });
    }
});

// DELETE /api/tareas/:id - Eliminar una tarea
router.delete('/:id', async (req, res) => {
    try {
        const tareaEliminada = await Tarea.findByIdAndDelete(req.params.id);
        if (!tareaEliminada) return res.status(404).json({ message: 'Tarea no encontrada para eliminar' });
        res.status(200).json({ message: 'Tarea eliminada exitosamente' });
    } catch (err) {
        console.error('Error al eliminar tarea:', err);
        res.status(500).json({ message: 'Error interno del servidor al eliminar tarea' });
    }
});

module.exports = router;