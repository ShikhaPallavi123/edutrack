require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/staff', require('./routes/staff'));
app.use('/api/observations', require('./routes/observations'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/ai', require('./routes/ai'));

// health check
app.get('/', (req, res) => {
  res.json({ message: 'EduTrack API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
