const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Connect to SQLite database
const db = new sqlite3.Database('./db/users.db', (err) => {
  if (err) {
    console.error('Failed to connect to DB:', err.message);
  } else {
    console.log('Connected to SQLite DB.');

    // Create table and insert dummy user AFTER DB is ready
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT,
        last_name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        money REAL,
        blocked INTEGER,
        account_number TEXT UNIQUE
    )`, (err) => {
      if (err) return console.error('Table creation error:', err.message);

        db.run(`INSERT OR IGNORE INTO users 
            (first_name, last_name, email, password, money, blocked, account_number) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            ['John', 'Doe', 'test@example.com', '123456', 1000.00, 0, '123456789012345678'], 
            (err) => {
                if (err) console.error('Insert error:', err.message);
                else console.log('Dummy user inserted or already exists.');
        });

    });
  }
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, row) => {
    if (err) {
      console.error('Login query error:', err.message);
      return res.status(500).json({ error: 'Internal DB error' });
    }

    if (row) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
