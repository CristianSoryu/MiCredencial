const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
  const { id_usuario, contrasena } = req.body;
  const [rows] = await pool.query(
    "SELECT * FROM usuarios WHERE id_usuario = ? AND contrasena = ?",
    [id_usuario, contrasena]
  );
  if (!rows.length) return res.status(401).json({ error: "Credenciales inválidas" });
  res.json({ ok: true, usuario: rows[0] });
});

module.exports = router;