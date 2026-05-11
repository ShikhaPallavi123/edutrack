const express = require('express');
const router = express.Router();
const db = require('../database');

// get all reviews
router.get('/', (req, res) => {
  const reviews = db.prepare(`
    SELECT r.*, s.name as staff_name, s.avatar_initials, s.avatar_color, s.department
    FROM reviews r
    JOIN staff s ON r.staff_id = s.id
    ORDER BY r.due_date ASC
  `).all();
  res.json(reviews);
});

// get reviews for one staff member
router.get('/staff/:staff_id', (req, res) => {
  const reviews = db.prepare('SELECT * FROM reviews WHERE staff_id = ? ORDER BY created_at DESC').all(req.params.staff_id);
  res.json(reviews);
});

// create review
router.post('/', (req, res) => {
  const { staff_id, review_type, period, rating, score, summary, due_date, status, reviewer } = req.body;
  const result = db.prepare(`
    INSERT INTO reviews (staff_id, review_type, period, rating, score, summary, due_date, status, reviewer)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(staff_id, review_type, period, rating, score, summary, due_date, status, reviewer);
  res.json({ id: result.lastInsertRowid, message: 'Review created' });
});

// update review
router.put('/:id', (req, res) => {
  const { rating, score, summary, status } = req.body;
  db.prepare(`
    UPDATE reviews SET rating=?, score=?, summary=?, status=? WHERE id=?
  `).run(rating, score, summary, status, req.params.id);
  res.json({ message: 'Review updated' });
});

module.exports = router;
