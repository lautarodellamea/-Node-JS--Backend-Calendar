
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { validateJWT } = require('../middlewares/validate-jwt');
const { validateFields } = require('../middlewares/validate-fields');
const { isDate } = require('../helpers/isDate');

const { getEventos, createEvent, updateEvent, deleteEvent } = require('../controllers/events');

// Todas tienen que pasar por la validacion del JWT
// Como aplicamos el mismo middleware, no tenemos que agregarlo en cada una de las rutas podemos subirlo de nivel, lo que ponfga debajo de esta linea esta protegido, podria poner el getEventos arriba si quiero que no este protegido
router.use(validateJWT);

// Obtener eventos
router.get('/', getEventos)

// Crear un nuevo evento
router.post(
  '/',
  [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de finalización es obligatoria').custom(isDate),

    validateFields
  ],
  createEvent
)

// Actualizar evento
router.put('/:id', updateEvent)

// Borrar evento
router.delete('/:id', deleteEvent)



module.exports = router