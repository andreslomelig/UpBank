const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Connect to SQLite database
const db = new sqlite3.Database('./db/upbank.db', (err) => {
  if (err) {
    console.error('Failed to connect to DB:', err.message);
  } else {
    console.log('Connected to SQLite DB.');

    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT,
        last_name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        money REAL,
        blocked INTEGER,
        account_number TEXT UNIQUE,
        login_attempts INTEGER DEFAULT 0
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

        db.run(`INSERT OR IGNORE INTO users 
            (first_name, last_name, email, password, money, blocked, account_number) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            ['Chuck', 'Norris', 'chuck@example.com', '4321', 1000.00, 1, '123456789012345688'], 
            (err) => {
                if (err) console.error('Insert error:', err.message);
                else console.log('Dummy user inserted or already exists.');
        });
    });

    db.run(`CREATE TABLE IF NOT EXISTS admins  (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT,
        last_name TEXT,
        email TEXT UNIQUE,
        password TEXTTEXT
    )`, (err) => {
      if (err) return console.error('Table creation error:', err.message);

        db.run(`INSERT OR IGNORE INTO admins 
            (first_name, last_name, email, password) 
            VALUES (?, ?, ?, ?)`,
            ['Adrian', 'Muro', 'amuro@example.com', 'qwerty'], 
            (err) => {
                if (err) console.error('Insert error:', err.message);
                else console.log('Dummy admin inserted or already exists.');
        });
    });
  }
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if it's an admin
  const adminQuery = 'SELECT * FROM admins WHERE email = ? AND password = ?';
  db.get(adminQuery, [email, password], (err, adminRow) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (adminRow) {
      return res.json({
        name: adminRow.first_name + ' ' + adminRow.last_name,
        role: 'admin'
      });
    }

    // If not admin, check user
    const userQuery = 'SELECT * FROM users WHERE email = ?';
    db.get(userQuery, [email], (err1, userRow) => {
      if (err1) return res.status(500).json({ error: 'Database error' });
      if (!userRow) return res.status(401).json({ error: 'User does not exist' });
      if (userRow.blocked) return res.status(401).json({ error: 'Blocked account' });

      if (userRow.password === password) {
        // Successful login, then reset attempts
        db.run(`UPDATE users SET login_attempts = 0 WHERE email = ?`, [email], (err) => {
          if (err) console.error('Failed to reset login attempts:', err.message);
        });

        return res.json({
          name: userRow.first_name + ' ' + userRow.last_name,
          role: 'user'
        });
      } else {
        // Incorrect password → increment login_attempts
        let newAttempts = (userRow.login_attempts || 0) + 1;
        let blockUser = newAttempts >= 3;

        db.run(
          `UPDATE users SET login_attempts = ?, blocked = ? WHERE email = ?`,
          [newAttempts, blockUser ? 1 : 0, email],
          (err) => {
            if (err) return res.status(500).json({ error: 'Failed to update attempts' });

            if (blockUser) {
              return res.status(401).json({ error: 'Account blocked after 3 failed attempts' });
            } else {
              return res.status(401).json({ error: `Incorrect password. Attempt ${newAttempts}/3` });
            }
          }
        );
      }
    });
  });
});


// Getting all users for admin
app.get('/all_users', (req, res) => {
  const sql = `SELECT first_name, last_name, blocked FROM users`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    const formattedUsers = rows.map(row => ({
      text: `${row.first_name} ${row.last_name}`,
      status: !row.blocked // true = active, false = blocked
    }));

    res.json(formattedUsers);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
