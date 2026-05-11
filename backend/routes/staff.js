const express = require('express');
const router = express.Router();
const db = require('../database');

// get all staff
router.get('/', (req, res) => {
  const staff = db.prepare('SELECT * FROM staff ORDER BY name').all();
  res.json(staff);
});

// get one staff member
router.get('/:id', (req, res) => {
  const staff = db.prepare('SELECT * FROM staff WHERE id = ?').get(req.params.id);
  if (!staff) return res.status(404).json({ error: 'Not found' });
  res.json(staff);
});

// create staff
router.post('/', (req, res) => {
  const { name, email, department, grade_levels, years_experience, rating, score, avatar_initials, avatar_color } = req.body;
  const result = db.prepare(`
    INSERT INTO staff (name, email, department, grade_levels, years_experience, rating, score, avatar_initials, avatar_color)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, email, department, grade_levels, years_experience, rating, score, avatar_initials, avatar_color);
  res.json({ id: result.lastInsertRowid, message: 'Staff created' });
});

// update staff
router.put('/:id', (req, res) => {
  const { name, email, department, grade_levels, years_experience, rating, score } = req.body;
  db.prepare(`
    UPDATE staff SET name=?, email=?, department=?, grade_levels=?, years_experience=?, rating=?, score=?
    WHERE id=?
  `).run(name, email, department, grade_levels, years_experience, rating, score, req.params.id);
  res.json({ message: 'Staff updated' });
});

// delete staff
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM staff WHERE id = ?').run(req.params.id);
  res.json({ message: 'Staff deleted' });
});

module.exports = router;
