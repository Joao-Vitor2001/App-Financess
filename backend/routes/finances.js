const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const userId = req.user.id;
  const items = await db('finances').where({ user_id: userId }).orderBy('id', 'desc');
  res.json(items);
});

router.post('/', async (req, res) => {
  const userId = req.user.id;
  const payload = req.body;
  const insert = {
    user_id: userId,
    titulo: payload.titulo,
    valor: payload.valor,
    vencimento: payload.vencimento,
    parcelas: payload.parcelas || 1,
    parcela_atual: payload.parcelaAtual || 1,
    categoria: payload.categoria,
    tipo: payload.tipo,
    grupo_id: payload.grupoId || null
  };

  const [id] = await db('finances').insert(insert);
  const created = await db('finances').where({ id }).first();
  res.status(201).json(created);
});

module.exports = router;
