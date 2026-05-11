const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  res.json(db.all(`SELECT r.*, s.name as staff_name, s.avatar_initials, s.avatar_color, s.department
    FROM reviews r JOIN staff s ON r.staff_id = s.id ORDER BY r.due_date ASC`));
});

router.post('/', (req, res) => {
  const { staff_id, review_type, period, rating, score, summary, due_date, status, reviewer } = req.body;
  const result = db.run(
    `INSERT INTO reviews (staff_id,review_type,period,rating,score,summary,due_date,status,reviewer) VALUES (?,?,?,?,?,?,?,?,?)`,
    [staff_id, review_type, period, rating, score, summary, due_date, status, reviewer]
  );
  res.json({ id: result.lastID, message: 'Created' });
});

router.put('/:id', (req, res) => {
  const { rating, score, summary, status } = req.body;
  db.run(`UPDATE reviews SET rating=?,score=?,summary=?,status=? WHERE id=?`,
    [rating, score, summary, status, req.params.id]);
  res.json({ message: 'Updated' });
});

module.exports = router;
