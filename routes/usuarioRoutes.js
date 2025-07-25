const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

// Validaciones para crear/actualizar usuario
const validacionesUsuario = [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('rol', 'Rol no válido').isIn(['estudiante', 'profesor', 'admin']),
    validarCampos
];

router.get('/', validarJWT, usuarioController.getUsuarios);
router.get('/:id', validarJWT, usuarioController.getUsuarioById);
router.post('/', validacionesUsuario, usuarioController.createUsuario);
router.put('/:id', validarJWT, usuarioController.updateUsuario);
router.delete('/:id', validarJWT, usuarioController.deleteUsuario);

module.exports = router;