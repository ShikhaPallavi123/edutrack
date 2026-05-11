const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  res.json(db.all('SELECT * FROM staff ORDER BY name'));
});

router.get('/:id', (req, res) => {
  const row = db.get('SELECT * FROM staff WHERE id = ?', [req.params.id]);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

router.post('/', (req, res) => {
  const { name, email, department, grade_levels, years_experience, rating, score, avatar_initials, avatar_color } = req.body;
  const result = db.run(
    `INSERT INTO staff (name,email,department,grade_levels,years_experience,rating,score,avatar_initials,avatar_color) VALUES (?,?,?,?,?,?,?,?,?)`,
    [name, email, department, grade_levels, years_experience, rating, score, avatar_initials, avatar_color]
  );
  res.json({ id: result.lastID, message: 'Created' });
});

router.put('/:id', (req, res) => {
  const { name, email, department, grade_levels, years_experience, rating, score } = req.body;
  db.run(`UPDATE staff SET name=?,email=?,department=?,grade_levels=?,years_experience=?,rating=?,score=? WHERE id=?`,
    [name, email, department, grade_levels, years_experience, rating, score, req.params.id]);
  res.json({ message: 'Updated' });
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM staff WHERE id = ?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;
