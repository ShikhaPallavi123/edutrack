const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  db.all(`SELECT o.*, s.name as staff_name, s.avatar_initials, s.avatar_color
    FROM observations o JOIN staff s ON o.staff_id = s.id
    ORDER BY o.date DESC`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  db.get(`SELECT o.*, s.name as staff_name FROM observations o
    JOIN staff s ON o.staff_id = s.id WHERE o.id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });
});

router.post('/', (req, res) => {
  const { staff_id, observer, date, grade_subject, obs_type, score, domain1, domain2, domain3, domain4, domain5, strengths, growth_areas, notes, status } = req.body;
  db.run(`INSERT INTO observations (staff_id,observer,date,grade_subject,obs_type,score,domain1,domain2,domain3,domain4,domain5,strengths,growth_areas,notes,status)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [staff_id, observer, date, grade_subject, obs_type, score, domain1, domain2, domain3, domain4, domain5, strengths, growth_areas, notes, status],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Observation saved' });
    });
});

router.put('/:id', (req, res) => {
  const { score, domain1, domain2, domain3, domain4, domain5, strengths, growth_areas, notes, status } = req.body;
  db.run(`UPDATE observations SET score=?,domain1=?,domain2=?,domain3=?,domain4=?,domain5=?,strengths=?,growth_areas=?,notes=?,status=? WHERE id=?`,
    [score, domain1, domain2, domain3, domain4, domain5, strengths, growth_areas, notes, status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Updated' });
    });
});

module.exports = router;
