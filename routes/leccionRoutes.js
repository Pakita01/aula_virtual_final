const express = require('express');
const router = express.Router();
const leccionController = require('../controllers/leccionController');

router.get('/', leccionController.getLecciones);
router.post('/', leccionController.createLeccion);
router.put('/:id', leccionController.updateLeccion);
router.delete('/:id', leccionController.deleteLeccion);

module.exports = router;