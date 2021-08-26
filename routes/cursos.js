const express = require("express");
const Curso = require("../models/curso_model");
const Joi = require("joi");
const ruta = express.Router();
const verificarToken = require("../middlewares/auth");

ruta.get("/", verificarToken, (req, res) => {
  let resultado = listarCursosActivos();

  resultado
    .then((cursos) => res.json(cursos))
    .catch((err) => res.status(400).json({ error: err }));
});

ruta.post("/", verificarToken, (req, res) => {
  let body = req;

  const { error, value } = schema.validate({
    titulo: body.body.titulo,
    descripcion: body.body.desc,
  });

  if (!error) {
    let resultado = crearCurso(body);
    resultado
      .then((curso) => {
        res.json({
          valor: curso,
        });
      })
      .catch((err) => {
        res.status(400).json({
          error: err,
        });
      });
  } else {
    res.status(400).json({ error });
  }
});

ruta.put("/:id", verificarToken, (req, res) => {
  const { error, value } = schema.validate({
    titulo: req.body.titulo,
    descripcion: req.body.desc,
  });

  if (!error) {
    let resultado = actualizarCurso(req.params.id, req.body);

    resultado
      .then((valor) => {
        res.json({
          valor: valor,
        });
      })
      .catch((err) => {
        res.status(400).json({
          error: err,
        });
      });
  } else {
    res.status(400).json({ error });
  }
});

ruta.delete("/:id", verificarToken, (req, res) => {
  let resultado = desactivarCurso(req.params.id);

  resultado
    .then((valor) => {
      res.json({
        valor: valor,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
});

async function crearCurso(req) {
  let curso = new Curso({
    titulo: req.body.titulo,
    autor: req.usuario._id,
    descripcion: req.body.desc,
  });

  return await curso.save();
}

async function actualizarCurso(id, body) {
  let curso = await Curso.findByIdAndUpdate(
    id,
    {
      $set: {
        titulo: body.titulo,
        descripcion: body.desc,
      },
    },
    { new: true }
  );

  return curso;
}

async function desactivarCurso(id) {
  let curso = await Curso.findOneAndUpdate(
    id,
    {
      $set: {
        estado: false,
      },
    },
    { new: true }
  );

  return curso;
}

async function listarCursosActivos() {
  let cursos = await Curso.find({ estado: true }).populate("autor","nombre -_id");

  return cursos;
}

const schema = Joi.object({
  titulo: Joi.string().min(3).max(10).required(),

  descripcion: Joi.string(),
});

module.exports = ruta;
