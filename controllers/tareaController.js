const Tarea = require('../models/tareaModel');

// Obtener todas las tareas
const getTareas = async (req, res) => {
    try {
        const tareas = await Tarea.find().sort({ fecha_entrega: 1 });
        res.json(tareas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Crear una nueva tarea
const createTarea = async (req, res) => {
    try {
        const nuevaTarea = new Tarea(req.body);
        await nuevaTarea.save();
        res.status(201).json(nuevaTarea);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Actualizar una tarea
const updateTarea = async (req, res) => {
    try {
        const tarea = await Tarea.findByIdAndUpdate(req.params.id, req.body, { 
            new: true,
            runValidators: true
        });
        res.json(tarea);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Eliminar una tarea
const deleteTarea = async (req, res) => {
    try {
        await Tarea.findByIdAndDelete(req.params.id);
        res.json({ message: 'Tarea eliminada' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    getTareas,
    createTarea,
    updateTarea,
    deleteTarea
};