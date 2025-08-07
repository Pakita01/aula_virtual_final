const Leccion = require('../models/leccionModel');


// Obtener todos los leccion
const getLecciones = async (req, res) => {
    try {
        const lecciones = await Leccion.find();
        res.json(lecciones);
    } catch (err) {
        console.error('Error en getLecciones:', err);
        res.status(500).json({ error: err.message });
    }
};

// Crear un nuevo leccion
const createLeccion = async (req, res) => {
    try {
        const nuevoLeccion = new Leccion(req.body);
        await nuevoLeccion.save();
        res.status(201).json(nuevoLeccion);
    } catch (err) {
        console.error('Error en createLeccion:', err);
        res.status(400).json({ error: err.message });
    }
};

// Actualizar un leccion
const updateLeccion = async (req, res) => {
    try {
        const leccion = await Leccion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(leccion);
    } catch (err) {
        console.error('Error en updateLeccion:', err);
        res.status(400).json({ error: err.message });
    }
};

// Eliminar un Leccion
const deleteLeccion = async (req, res) => {
    try {
        await Leccion.findByIdAndDelete(req.params.id);
        res.json({ message: 'Leccion eliminado' });
    } catch (err) {
        console.error('Error en deleteLeccion:', err);
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    getLecciones,
    createLeccion,
    updateLeccion,
    deleteLeccion
};
