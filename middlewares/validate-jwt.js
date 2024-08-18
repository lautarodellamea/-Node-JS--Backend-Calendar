
const { response } = require('express');
const jwt = require('jsonwebtoken');


const validateJWT = (req, res = response, next) => {


  // x-token headers
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: 'No hay token en la petición'
    })
  }

  try {

    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);

    // aca modificamos la req, para que cualquier otra peticion que pase por aca disponga de esto, despues del next
    req.uid = payload.uid
    req.name = payload.name


  } catch (error) {

    // aca entraria si se modifica el token o este expira
    return res.status(401).json({
      ok: false,
      message: 'Token no válido'
    })
  }





  next()
}


module.exports = {
  validateJWT
}