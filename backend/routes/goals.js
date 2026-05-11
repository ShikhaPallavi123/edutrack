const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  res.json(db.all(`SELECT g.*, s.name as staff_name, s.avatar_initials, s.avatar_color
    FROM goals g JOIN staff s ON g.staff_id = s.id ORDER BY g.due_date ASC`));
});

router.post('/', (req, res) => {
  const { staff_id, title, category, description, success_criteria, progress_pct, start_date, due_date } = req.body;
  const result = db.run(
    `INSERT INTO goals (staff_id,title,category,description,success_criteria,progress_pct,start_date,due_date) VALUES (?,?,?,?,?,?,?,?)`,
    [staff_id, title, category, description, success_criteria, progress_pct, start_date, due_date]
  );
  res.json({ id: result.lastID, message: 'Created' });
});

router.put('/:id', (req, res) => {
  const { progress_pct, status, title, category } = req.body;
  db.run(`UPDATE goals SET progress_pct=?,status=?,title=?,category=? WHERE id=?`,
    [progress_pct, status, title, category, req.params.id]);
  res.json({ message: 'Updated' });
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM goals WHERE id = ?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;
