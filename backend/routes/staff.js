const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  db.all('SELECT * FROM staff ORDER BY name', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  db.get('SELECT * FROM staff WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });
});

router.post('/', (req, res) => {
  const { name, email, department, grade_levels, years_experience, rating, score, avatar_initials, avatar_color } = req.body;
  db.run(`INSERT INTO staff (name,email,department,grade_levels,years_experience,rating,score,avatar_initials,avatar_color) VALUES (?,?,?,?,?,?,?,?,?)`,
    [name, email, department, grade_levels, years_experience, rating, score, avatar_initials, avatar_color],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Staff created' });
    });
});

router.put('/:id', (req, res) => {
  const { name, email, department, grade_levels, years_experience, rating, score } = req.body;
  db.run(`UPDATE staff SET name=?,email=?,department=?,grade_levels=?,years_experience=?,rating=?,score=? WHERE id=?`,
    [name, email, department, grade_levels, years_experience, rating, score, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Updated' });
    });
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM staff WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Deleted' });
  });
});

module.exports = router;
