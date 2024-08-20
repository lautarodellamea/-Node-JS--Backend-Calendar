const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config');
const cors = require('cors')
const path = require('path')


// Crear el servidor de express
const app = express();

// Base de datos
dbConnection();

// Cors
app.use(cors())

// Lectura y parseo del body
app.use(express.json());

// Directorio publico
app.use(express.static('public'))





// Rutas
// TODO: auth // crear, login, renewToken
app.use('/api/auth', require('./routes/auth'))
// TODO: CRUD: Eventos
app.use('/api/events', require('./routes/events'))


// esto lo hacemos ya que al copiar nuestro build del frontend en la carpeta pubñlic de nuestro backend, si ingresamos al url http://localhost:4000/auth/login de forma manueal, nos da que no existe, pero si entramos al url http://localhost:4000, nos redirecciona automaticamente ya que toma el control el router de react. De esta forma se soluciona eso.
// cualquier otra ruta que no exista, nos redirecciona al index y react con router toma el control
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname) + "/public/index.html")
})


// Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
})








