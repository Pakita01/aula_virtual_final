const express = require('express');
const {
    getCursos,
    getCurso,
    createCurso,
    updateCurso,
    deleteCurso
} = require('../controllers/cursoController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Rutas públicas
router.route('/')
    .get(getCursos);

router.route('/:id')
    .get(getCurso);

// Rutas protegidas
router.use(protect);

router.route('/')
    .post(authorize('profesor', 'admin'), createCurso);

router.route('/:id')
    .put(authorize('profesor', 'admin'), updateCurso)
    .delete(authorize('profesor', 'admin'), deleteCurso);

// Incluir rutas de módulos y tareas
const moduloRouter = require('./moduloRoutes');
const tareaRouter = require('./tareaRoutes');

router.use('/:idCurso/modulos', moduloRouter);
router.use('/:idCurso/tareas', tareaRouter);

module.exports = router;