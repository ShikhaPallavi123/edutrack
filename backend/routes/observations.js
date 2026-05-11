const express = require('express');
const router = express.Router();
const db = require('../database');

// get all observations
router.get('/', (req, res) => {
  const obs = db.prepare(`
    SELECT o.*, s.name as staff_name, s.avatar_initials, s.avatar_color
    FROM observations o
    JOIN staff s ON o.staff_id = s.id
    ORDER BY o.date DESC
  `).all();
  res.json(obs);
});

// get observations for one staff member
router.get('/staff/:staff_id', (req, res) => {
  const obs = db.prepare('SELECT * FROM observations WHERE staff_id = ? ORDER BY date DESC').all(req.params.staff_id);
  res.json(obs);
});

// get one observation
router.get('/:id', (req, res) => {
  const obs = db.prepare(`
    SELECT o.*, s.name as staff_name
    FROM observations o
    JOIN staff s ON o.staff_id = s.id
    WHERE o.id = ?
  `).get(req.params.id);
  if (!obs) return res.status(404).json({ error: 'Not found' });
  res.json(obs);
});

// create observation
router.post('/', (req, res) => {
  const { staff_id, observer, date, grade_subject, obs_type, score, domain1, domain2, domain3, domain4, domain5, strengths, growth_areas, notes, status } = req.body;
  const result = db.prepare(`
    INSERT INTO observations (staff_id, observer, date, grade_subject, obs_type, score, domain1, domain2, domain3, domain4, domain5, strengths, growth_areas, notes, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(staff_id, observer, date, grade_subject, obs_type, score, domain1, domain2, domain3, domain4, domain5, strengths, growth_areas, notes, status);
  res.json({ id: result.lastInsertRowid, message: 'Observation saved' });
});

// update observation
router.put('/:id', (req, res) => {
  const { score, domain1, domain2, domain3, domain4, domain5, strengths, growth_areas, notes, status } = req.body;
  db.prepare(`
    UPDATE observations SET score=?, domain1=?, domain2=?, domain3=?, domain4=?, domain5=?, strengths=?, growth_areas=?, notes=?, status=?
    WHERE id=?
  `).run(score, domain1, domain2, domain3, domain4, domain5, strengths, growth_areas, notes, status, req.params.id);
  res.json({ message: 'Observation updated' });
});

module.exports = router;
