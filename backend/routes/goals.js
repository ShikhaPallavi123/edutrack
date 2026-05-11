const express = require('express');
const router = express.Router();
const db = require('../database');

// get all goals
router.get('/', (req, res) => {
  const goals = db.prepare(`
    SELECT g.*, s.name as staff_name, s.avatar_initials, s.avatar_color
    FROM goals g
    JOIN staff s ON g.staff_id = s.id
    ORDER BY g.due_date ASC
  `).all();
  res.json(goals);
});

// create goal
router.post('/', (req, res) => {
  const { staff_id, title, category, description, success_criteria, progress_pct, start_date, due_date } = req.body;
  const result = db.prepare(`
    INSERT INTO goals (staff_id, title, category, description, success_criteria, progress_pct, start_date, due_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(staff_id, title, category, description, success_criteria, progress_pct, start_date, due_date);
  res.json({ id: result.lastInsertRowid, message: 'Goal created' });
});

// update goal progress
router.put('/:id', (req, res) => {
  const { progress_pct, status, title, category } = req.body;
  db.prepare(`
    UPDATE goals SET progress_pct=?, status=?, title=?, category=? WHERE id=?
  `).run(progress_pct, status, title, category, req.params.id);
  res.json({ message: 'Goal updated' });
});

// delete goal
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM goals WHERE id = ?').run(req.params.id);
  res.json({ message: 'Goal deleted' });
});

module.exports = router;
