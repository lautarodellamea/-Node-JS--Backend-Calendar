const { Schema, model } = require('mongoose');

const EventSchema = new Schema({

  title: {
    type: String,
    required: [true, 'Title is required']
  },

  notes: {
    type: String,
  },

  start: {
    type: Date,
    required: [true, 'Start date is required']
  },

  end: {
    type: Date,
    required: [true, 'End date is required']
  },

  // referencia al usuario
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// extraemos el _id y el __v de mongoose y lo volvemos a agregar con los nombres que yo quiero
EventSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model('Event', EventSchema)