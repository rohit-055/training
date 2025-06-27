const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');


const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'trainig_website',
  password: 'spmucell',
  port: 5432
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

// Example error handling
pool.on('error', (err) => {
  console.error('Unexpected PG error:', err);
});

// Sample users (for session-based login)
const users = [{ username: 'admin', password: 'password123' }];

// Routes

// Health-check endpoint
// ... (dotenv, express, pool setup as before)

// Health-check endpoint:
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'ok', message: 'DB is connected' });
  } catch (err) {
    console.error('Health check failed:', err.stack);
    res.status(503).json({ status: 'fail', message: 'DB is NOT connected' });
  }
});

// Existing routes below ...


app.get('/login', (req, res) => res.render('login'));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.user = user;
    res.redirect('/dashboard');
  } else {
    res.send('Invalid credentials');
  }
});

app.get('/dashboard', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  try {
    const result = await pool.query('SELECT NOW() AS now');
    const now = result.rows[0].now;
    res.render('dashboard', { user: req.session.user, now });
  } catch (err) {
    console.error('DB query error:', err);
    res.render('dashboard', { user: req.session.user, now: 'Error fetching time' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.redirect('/dashboard');
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

app.listen(3000, () => console.log('🚀 Server running at http://localhost:3000'));
