const mongoose = require("mongoose");

const usuarioSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  password: { type: String, required: true },
  estado: { type: Boolean, default: true },
  imagen: { type: String, required: false },
});

module.exports = mongoose.model("Usuario", usuarioSchema);
