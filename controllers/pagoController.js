const Pago = require('../models/pagoModel');


// Obtener todos los pagos
const getPagos = async (req, res) => {
    try {
        const pagos = await Pago.find();
        res.json(pagos);
    } catch (err) {
        console.error('Error en getPagos:', err);
        res.status(500).json({ error: err.message });
    }
};

// Crear un nuevo pago
const createPago = async (req, res) => {
    try {
        const nuevoPago = new Pago(req.body);
        await nuevoPago.save();
        res.status(201).json(nuevoPago);
    } catch (err) {
        console.error('Error en createPago:', err);
        res.status(400).json({ error: err.message });
    }
};

// Actualizar un pago
const updatePago = async (req, res) => {
    try {
        const pago = await Pago.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(pago);
    } catch (err) {
        console.error('Error en updatePago:', err);
        res.status(400).json({ error: err.message });
    }
};

// Eliminar un pago
const deletePago = async (req, res) => {
    try {
        await Pago.findByIdAndDelete(req.params.id);
        res.json({ message: 'Pago eliminado' });
    } catch (err) {
        console.error('Error en deletePago:', err);
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    getPagos,
    createPago,
    updatePago,
    deletePago
};
