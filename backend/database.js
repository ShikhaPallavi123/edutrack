const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'database.db'));

// turn on foreign keys
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// create all tables
db.exec(`
  CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    department TEXT,
    grade_levels TEXT,
    years_experience INTEGER DEFAULT 0,
    rating TEXT DEFAULT 'Developing',
    score REAL DEFAULT 0,
    avatar_initials TEXT,
    avatar_color TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS observations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    staff_id INTEGER NOT NULL,
    observer TEXT DEFAULT 'Dr. Walsh',
    date TEXT,
    grade_subject TEXT,
    obs_type TEXT DEFAULT 'Formal',
    score REAL DEFAULT 0,
    domain1 REAL DEFAULT 0,
    domain2 REAL DEFAULT 0,
    domain3 REAL DEFAULT 0,
    domain4 REAL DEFAULT 0,
    domain5 REAL DEFAULT 0,
    strengths TEXT,
    growth_areas TEXT,
    notes TEXT,
    status TEXT DEFAULT 'Pending',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (staff_id) REFERENCES staff(id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    staff_id INTEGER NOT NULL,
    review_type TEXT DEFAULT 'Annual',
    period TEXT,
    rating TEXT,
    score REAL DEFAULT 0,
    summary TEXT,
    due_date TEXT,
    status TEXT DEFAULT 'Pending',
    reviewer TEXT DEFAULT 'Dr. Walsh',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (staff_id) REFERENCES staff(id)
  );

  CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    staff_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    category TEXT,
    description TEXT,
    success_criteria TEXT,
    progress_pct INTEGER DEFAULT 0,
    start_date TEXT,
    due_date TEXT,
    status TEXT DEFAULT 'Active',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (staff_id) REFERENCES staff(id)
  );

  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    staff_id INTEGER,
    title TEXT NOT NULL,
    content TEXT,
    note_type TEXT DEFAULT 'General',
    tags TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// seed sample data if staff table is empty
const count = db.prepare('SELECT COUNT(*) as c FROM staff').get();
if (count.c === 0) {
  const insertStaff = db.prepare(`
    INSERT INTO staff (name, email, department, grade_levels, years_experience, rating, score, avatar_initials, avatar_color)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const staff = [
    ['Sofia Rivera', 'srivera@lincoln.edu', 'Mathematics', 'K-5', 8, 'Proficient', 4.2, 'SR', '#5A2D8B'],
    ['James Thompson', 'jthompson@lincoln.edu', 'Science', '6-8', 6, 'Developing', 3.5, 'JT', '#0F5E56'],
    ['Linda Chen', 'lchen@lincoln.edu', 'English', '9-12', 14, 'Exemplary', 4.8, 'LC', '#8B5E0A'],
    ['Marcus Green', 'mgreen@lincoln.edu', 'P.E. / Health', '6-8', 3, 'Basic', 2.9, 'MG', '#8B1A1A'],
    ['Anna Park', 'apark@lincoln.edu', 'English', 'K-3', 2, 'Developing', 3.8, 'AP', '#185FA5'],
    ['Rachel Kim', 'rkim@lincoln.edu', 'Special Education', 'K-8', 9, 'Proficient', 4.1, 'RK', '#5A2D8B'],
    ['Brian Moore', 'bmoore@lincoln.edu', 'Social Studies', '6-12', 11, 'Developing', 3.6, 'BM', '#1A6B3A'],
    ['Nicole Walsh', 'nwalsh@lincoln.edu', 'Mathematics', '6-12', 5, 'Proficient', 4.3, 'NW', '#8B3A8B'],
  ];

  staff.forEach(s => insertStaff.run(...s));

  // seed some goals
  const insertGoal = db.prepare(`
    INSERT INTO goals (staff_id, title, category, progress_pct, due_date, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertGoal.run(1, 'Increase formative assessment frequency', 'Instruction Quality', 72, '2026-06-15', 'Active');
  insertGoal.run(2, 'Develop inquiry-based science lessons', 'Instruction Quality', 35, '2026-05-31', 'Active');
  insertGoal.run(3, 'Lead peer observation workshop', 'Professional Dev.', 90, '2026-05-20', 'Active');
  insertGoal.run(4, 'Improve student engagement strategies', 'Student Engagement', 20, '2026-05-30', 'Active');
  insertGoal.run(4, 'Complete classroom management course', 'Professional Dev.', 45, '2026-06-01', 'Active');
  insertGoal.run(6, 'Implement differentiated IEP strategies', 'Student Outcomes', 80, '2026-06-30', 'Active');

  // seed some observations
  const insertObs = db.prepare(`
    INSERT INTO observations (staff_id, date, grade_subject, score, domain1, domain2, domain3, domain4, domain5, strengths, growth_areas, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertObs.run(1, '2026-05-03', 'Grade 4 · Mathematics', 4.2, 4.5, 4.0, 4.2, 3.8, 4.5, 'Clear objectives, strong use of manipulatives', 'Increase formative checks, extend wait time', 'Completed');
  insertObs.run(2, '2026-04-22', 'Grade 7 · Earth Science', 3.5, 3.5, 3.2, 3.8, 3.2, 3.8, 'Good content knowledge', 'Student engagement needs improvement', 'Completed');
  insertObs.run(3, '2026-04-15', 'Grade 9 · English Lit', 4.8, 4.8, 4.9, 4.7, 4.8, 4.8, 'Exceptional discussion facilitation', 'Minor pacing issues', 'Completed');

  console.log('Database seeded with sample data');
}

module.exports = db;
