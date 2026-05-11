const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  res.json(db.all(`SELECT n.*, s.name as staff_name FROM notes n
    LEFT JOIN staff s ON n.staff_id = s.id ORDER BY n.created_at DESC`));
});

router.post('/', (req, res) => {
  const { staff_id, title, content, note_type, tags } = req.body;
  const result = db.run(
    `INSERT INTO notes (staff_id,title,content,note_type,tags) VALUES (?,?,?,?,?)`,
    [staff_id, title, content, note_type, tags]
  );
  res.json({ id: result.lastID, message: 'Saved' });
});

router.put('/:id', (req, res) => {
  const { title, content, note_type, tags } = req.body;
  db.run(`UPDATE notes SET title=?,content=?,note_type=?,tags=? WHERE id=?`,
    [title, content, note_type, tags, req.params.id]);
  res.json({ message: 'Updated' });
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM notes WHERE id = ?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;
