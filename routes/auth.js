/* 
  Rutas de Usuarios / Auth
  host + /api/auth

*/

const express = require('express');
const router = express.Router();

const { check } = require('express-validator');

const { registerUser, loginUser, refreshToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');

const { validateJWT } = require('../middlewares/validate-jwt');

router.post(
  '/new',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe ser de al menos 6 caracteres').isLength({ min: 6 }),
    validateFields
  ],
  registerUser
)

router.post(
  '/',
  [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe ser de al menos 6 caracteres').isLength({ min: 6 }),
    validateFields
  ],
  loginUser
)

router.get('/renew', [validateJWT], refreshToken)


module.exports = router