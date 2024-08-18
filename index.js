const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config');
const cors = require('cors')


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


// Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
})








