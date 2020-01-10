const mongoose = require('mongoose');

module.exports = mongoose.model(
  'User',
  new mongoose.Schema({
    id: { type: String },
    premium: false,
    verified: false,
    commandsUsed: { type: Number, default: 0 },
    social: {
      reputation: { type: Number, default: 0 },
      level: { type: Number, default: 0 },
      money: { type: Number, default: 0 },
      couple: { type: String, default: 'Sin conyuge' }, // string, undefined
      gender: { type: Number, default: 0 }, // si es 0 es indefinido, si es 1 es mujer, si es 2 es hombre
      birthday: { type: String, default: 'No definido' }, // string, date
      description: { type: String, default: 'Sin descripción.' }, //string undefined
      badges: { type: Array, default: [] }
    }
  })
);
