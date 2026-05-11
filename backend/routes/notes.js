const express = require('express');
const router = express.Router();
const db = require('../database');

// get all notes
router.get('/', (req, res) => {
  const notes = db.prepare(`
    SELECT n.*, s.name as staff_name
    FROM notes n
    LEFT JOIN staff s ON n.staff_id = s.id
    ORDER BY n.created_at DESC
  `).all();
  res.json(notes);
});

// create note
router.post('/', (req, res) => {
  const { staff_id, title, content, note_type, tags } = req.body;
  const result = db.prepare(`
    INSERT INTO notes (staff_id, title, content, note_type, tags)
    VALUES (?, ?, ?, ?, ?)
  `).run(staff_id, title, content, note_type, tags);
  res.json({ id: result.lastInsertRowid, message: 'Note saved' });
});

// update note
router.put('/:id', (req, res) => {
  const { title, content, note_type, tags } = req.body;
  db.prepare(`
    UPDATE notes SET title=?, content=?, note_type=?, tags=? WHERE id=?
  `).run(title, content, note_type, tags, req.params.id);
  res.json({ message: 'Note updated' });
});

// delete note
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM notes WHERE id = ?').run(req.params.id);
  res.json({ message: 'Note deleted' });
});

module.exports = router;
