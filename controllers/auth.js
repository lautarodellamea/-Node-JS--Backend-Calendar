// esto es para tener el autocompletado de VSC, no importa que importemos tantas veces expres, ya que solo se importa una vez
const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const registerUser = async (req, res = response) => {

  const { name, email, password } = req.body


  try {

    let user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({
        ok: false,
        message: 'Ya existe un usuario con ese email'
      })
    }

    // Crear usuario con el modelo
    user = new User({ name, email, password })

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync()
    user.password = bcrypt.hashSync(password, salt)

    // Guardar usuario en DB
    await user.save()

    // Generar el JWT
    const token = await generateJWT(user.id, user.name)


    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token: token
    })

  } catch (error) {

    console.log(error)
    res.status(500).json({
      ok: false,
      message: 'Por favor hable con el administrador'
    })

  }


}

const loginUser = async (req, res = response) => {

  const { email, password } = req.body

  try {

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        ok: false,
        // hay que poner usuario/contraseña incorrectos para no dar info 
        message: 'No existe un usuario con ese email'
      })
    }

    // Confirmar los passwords
    const validPassword = bcrypt.compareSync(password, user.password)

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        message: 'Contraseña incorrecta'
      })
    }

    // Generar el JWT
    const token = await generateJWT(user.id, user.name)


    res.status(200).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token: token
    })

  } catch (error) {

    console.log(error)
    res.status(500).json({
      ok: false,
      message: 'Por favor hable con el administrador'
    })

  }

}

const refreshToken = async (req, res = response) => {

  //  en la req ya tenemos el uid y el name, ya que lo pusimos en el validate token y ese middleware se ejecuta antes de llegar aca
  const { uid, name } = req


  const token = await generateJWT(uid, name)

  res.json({
    ok: true,
    uid: uid,
    name: name,
    token: token
  })
}


module.exports = {
  registerUser,
  loginUser,
  refreshToken
}