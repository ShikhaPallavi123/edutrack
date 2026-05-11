const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  db.all(`SELECT g.*, s.name as staff_name, s.avatar_initials, s.avatar_color
    FROM goals g JOIN staff s ON g.staff_id = s.id ORDER BY g.due_date ASC`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { staff_id, title, category, description, success_criteria, progress_pct, start_date, due_date } = req.body;
  db.run(`INSERT INTO goals (staff_id,title,category,description,success_criteria,progress_pct,start_date,due_date)
    VALUES (?,?,?,?,?,?,?,?)`,
    [staff_id, title, category, description, success_criteria, progress_pct, start_date, due_date],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Goal created' });
    });
});

router.put('/:id', (req, res) => {
  const { progress_pct, status, title, category } = req.body;
  db.run(`UPDATE goals SET progress_pct=?,status=?,title=?,category=? WHERE id=?`,
    [progress_pct, status, title, category, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Updated' });
    });
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM goals WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Deleted' });
  });
});

module.exports = router;
