

const { response } = require('express');
const Event = require('../models/Event');

const getEventos = async (req, res = response) => {

  // const events = await Event.find() // en el find podriamos aplicar filtros si quisieramos, fechas de inicio - fin, paginaciones, etc
  const events = await Event.find().populate('user', 'name'); // el popoulate me permite elegir que quiero especificamente



  return res.json({
    ok: true,
    events
  })
}

const createEvent = async (req, res = response) => {

  const event = new Event(req.body);

  try {

    event.user = req.uid;

    const savedEvent = await event.save();
    // savedEvent.user = req.uid


    return res.json({
      ok: true,
      event: savedEvent
    })

  } catch (error) {

    console.log(error)

    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }

  return res.json({
    ok: true,
    msg: 'createEvent'
  })
}

const updateEvent = async (req, res = response) => {

  const eventId = req.params.id;
  const uid = req.uid;

  try {

    const event = await Event.findById(eventId);

    if (!event) {

      return res.status(404).json({
        ok: false,
        msg: 'El evento no existe'
      })
    }

    // esto significa que otra persona quiere editar el evento de otra
    // si intentaramos modificatr el token hasta tener uno, este se invalidaria y no haria la peticion
    // si recibimos una peticion de token invalido, podemos sabe rde donde vino y almacenarla en una lista negra y al recibir muchos tokens invalidos de alguna direccion IP, podriamos bloquearla o que espere horas para hacer otra peticion, por que no spueden estar bombardeando para encontrar bulnerabilidades 
    if (event.user.toString() !== uid) {

      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegios para editar este evento'
      })
    }

    const newEvent = {
      ...req.body,
      user: uid
    }

    // esto retorna el evento sin actualizar, aunque si lo actualiza, esto me pérmite hacer comparaciones
    // const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent);

    // esto retorna el evento actualizado
    const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, { new: true });


    return res.json({
      ok: true,
      event: updatedEvent
    })



  } catch (error) {

    // podriamos guardar estos logs en algun lado, archivo de texto, etc.
    console.log(error)

    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })

  }

}

const deleteEvent = async (req, res = response) => {

  const eventId = req.params.id;
  const uid = req.uid;

  try {

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: 'El evento no existe'
      })
    }


    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegios para eliminar este evento'
      })
    }



    const deletedEvent = await Event.findByIdAndDelete(eventId);


    return res.json({ ok: true, deleteEvent })



  } catch (error) {

    console.log(error)

    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })

  }
}


module.exports = {
  getEventos,
  createEvent,
  updateEvent,
  deleteEvent
}