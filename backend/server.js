require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getDb } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/staff', require('./routes/staff'));
app.use('/api/observations', require('./routes/observations'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/ai', require('./routes/ai'));

app.get('/', (req, res) => {
  res.json({ message: 'EduTrack API is running!' });
});

getDb().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
