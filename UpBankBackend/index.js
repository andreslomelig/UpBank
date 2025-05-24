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
            ['Chuck', 'Norris', 'chuck@example.com', '4321', 1000.00, 0, '123456789012345688'], 
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
    db.run(`CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER,
      receiver_id INTEGER,
      money REAL,
      type TEXT CHECK(type IN ('Deposit', 'Transfer')),
      status TEXT CHECK(status IN ('Error', 'Pending', 'Completed')),
      description TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(sender_id) REFERENCES users(id),
      FOREIGN KEY(receiver_id) REFERENCES users(id)
    )`, (err) => {
      if (err) {
        console.error('Error creating transactions table:', err.message);
      } else {
        console.log('Transactions table ensured.');

        //Only if the table is empty
        db.get(`SELECT COUNT(*) as count FROM transactions`, (err2, row) => {
          if (err2) {
            console.error('Error checking transactions count:', err2.message);
          } else if (row.count === 0) {
            console.log('Inserting initial deposits for users 1 and 2...');
            db.run(`INSERT INTO transactions (sender_id, receiver_id, money, type, status, description)
                    VALUES (NULL, 1, 1000.00, 'Deposit', 'Completed', 'Depósito inicial')`);
            db.run(`INSERT INTO transactions (sender_id, receiver_id, money, type, status, description)
                    VALUES (NULL, 2, 1000.00, 'Deposit', 'Completed', 'Depósito inicial')`);
          } else {
            console.log('Transactions already exist. Skipping initial deposits.');
          }
        });
      }
    });

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
        id: adminRow.id,
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
        id: userRow.id,
        name: userRow.first_name + ' ' + userRow.last_name,
        role: 'user'
        });
      } else {
        // Incorrect password , increment user attempts
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
  const sql = `SELECT first_name, last_name, blocked, email FROM users`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    const formattedUsers = rows.map(row => ({
      text: `${row.first_name} ${row.last_name}`,
      status: !row.blocked, // true = active, false = blocked
      email: row.email
    }));

    res.json(formattedUsers);
  });
});

// Update the user blocked status
app.post('/update_user_blocked_status', (req, res) => {
  const { email, blocked } = req.body;

  const sql = `UPDATE users SET blocked = ? WHERE email = ?`;
  db.run(sql, [blocked ? 0 : 1, email], function (err) {
    
    if (err) {
      return res.status(500).json({ error: 'Failed to update user status' });
    }

    res.json({ success: true, updatedRows: this.changes });
  });
});

//Transfers
app.post('/transfer', (req, res) => {
  const { from_account, to_account, amount, description } = req.body;

  if (!from_account || !to_account || !amount || isNaN(amount)) {
    console.error('Invalid transfer request.');
    return res.status(400).json({ error: 'Invalid data' });
  }

  if (amount < 500 || amount > 10000) {
    console.warn(`Rejected: Amount out of bounds: $${amount}`);
    return res.status(400).json({ error: 'Amount must be between $500 and $10,000' });
  }

  db.serialize(() => {
    db.get(`SELECT * FROM users WHERE account_number = ?`, [from_account], (err, sender) => {
      if (err || !sender) return res.status(404).json({ error: 'Sender not found' });

      db.get(`SELECT * FROM users WHERE account_number = ?`, [to_account], (err2, receiver) => {
        if (err2 || !receiver) return res.status(404).json({ error: 'Receiver not found' });

        if (sender.money < amount) return res.status(400).json({ error: 'Insufficient funds' });

        db.get(`SELECT SUM(money) as totalReceived FROM transactions WHERE receiver_id = ? AND type = 'Transfer' AND status = 'Completed'`, [receiver.id], (err3, row) => {
          if (err3) return res.status(500).json({ error: 'Error checking accumulated received' });

          const totalReceived = row?.totalReceived || 0;
          if (totalReceived + amount > 20000) {
            return res.status(400).json({ error: 'Receiver exceeds $20,000 accumulated limit' });
          }

          const insertTransactionSQL = `
            INSERT INTO transactions (sender_id, receiver_id, money, type, status, description)
            VALUES (?, ?, ?, 'Transfer', 'Pending', ?)`;

          db.run(insertTransactionSQL, [sender.id, receiver.id, amount, description || 'Transferencia entre cuentas'], function (err4) {
            if (err4) return res.status(500).json({ error: 'Transaction log failed' });

            const transactionId = this.lastID;

            db.run('BEGIN TRANSACTION');
            db.run(`UPDATE users SET money = money - ? WHERE id = ?`, [amount, sender.id], function (err5) {
              if (err5) {
                db.run(`UPDATE transactions SET status = 'Error' WHERE id = ?`, [transactionId]);
                db.run('ROLLBACK');
                return res.status(500).json({ error: 'Error debiting sender' });
              }

              db.run(`UPDATE users SET money = money + ? WHERE id = ?`, [amount, receiver.id], function (err6) {
                if (err6) {
                  db.run(`UPDATE transactions SET status = 'Error' WHERE id = ?`, [transactionId]);
                  db.run('ROLLBACK');
                  return res.status(500).json({ error: 'Error crediting receiver' });
                }

                db.run(`UPDATE transactions SET status = 'Completed' WHERE id = ?`, [transactionId]);
                db.run('COMMIT');
                console.log(`Transfer $${amount} from ${from_account} to ${to_account} - Transaction #${transactionId}`);
                return res.json({ success: true, transaction_id: transactionId, message: 'Transfer completed' });
              });
            });
          });
        });
      });
    });
  });
});

app.get('/user/:id', (req, res) => {
  const userId = req.params.id;

  db.get(`SELECT first_name, last_name, money, account_number FROM users WHERE id = ?`, [userId], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'User not found' });

    res.json({
      name: row.first_name + ' ' + row.last_name,
      money: row.money,
      account_number: row.account_number
    });
  });
});

app.get('/transactions', (req, res) => {
  const account = req.query.account;

  if (!account) return res.status(400).json({ error: 'Account number required' });

  const sql = `
    SELECT DISTINCT t.id, t.money as amount, t.type, t.description, t.timestamp,
          u1.account_number as senderID,
          u2.account_number as receiverID
    FROM transactions t
    LEFT JOIN users u1 ON t.sender_id = u1.id
    LEFT JOIN users u2 ON t.receiver_id = u2.id
    WHERE u1.account_number = ? OR u2.account_number = ?
    ORDER BY t.timestamp DESC
  `;

  db.all(sql, [account, account], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    res.json(rows);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
