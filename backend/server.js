const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'my_react_project',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
  db.query(query, [email, hashedPassword], (err, result) => {
    if (err) {
      res.status(500).send('Error registering user');
      return;
    }
    res.send({ success: true });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      res.status(500).send('Error logging in');
      return;
    }
    if (results.length === 0) {
      res.send({ success: false });
      return;
    }

    const user = results[0];
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (passwordMatch) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
