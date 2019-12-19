const mongoose = require("mongoose");

module.exports = mongoose.model(
  "User",
  new mongoose.Schema({
    id: { type: String },
    premium: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    social: {
      type: Object,
      default: {
        type: Object,
        reputation: { type: Number, default: 0 },
        level: { type: Number, default: 0 },
        money: { type: Number, default: 0 },
        couple: { type: String, default: undefined },
        gender: { type: Number, default: null }, // si es 0 es mujer, si es 1 es hombre
        birthday: { type: String, default: undefined },
        description: { type: String, default: undefined },
        badges: { type: Array, default: []}
      }
    }
  })
);