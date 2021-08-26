const express = require("express");
const Usuario = require("../models/usuario_model");
// const Joi = require("joi");
const bcrypt = require("bcrypt");
const ruta = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");

ruta.post("/", (req, res) => {
  Usuario.findOne({ email: req.body.email })
    .then((datos) => {
      if (datos) {
        const pwdValido = bcrypt.compareSync(req.body.password, datos.password);
        if (!pwdValido) {
          res
            .status(400)
            .json({ error: "ok", msj: "Usuario o contraseña incorrecta" });
        }

        /* const jwToken = jwt.sign(
          {
            _id: datos.id,
            nombre: datos.nombre,
            email: datos.email,
          },
          "password"
        ); */

        const jwToken = jwt.sign(
          {
            usuario: {
              _id: datos.id,
              nombre: datos.nombre,
              email: datos.email,
            },
          },
          config.get("configToken.SEED"),
          { expiresIn: config.get("configToken.EXPIRATION") }
        );

        // res.send(jwToken);
        res.json({
          usuario: { _id: datos._id, nombre: datos.nombre, email: datos.email },
          token: jwToken,
        });
      } else {
        res
          .status(400)
          .json({ error: "ok", msj: "Usuario o contraseña incorrecta" });
      }
    })
    .catch((err) => {
      res.status(400).json({ error: "ok", msj: "Error en el servidor" + err });
    });
});

module.exports = ruta;
