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

 

// Example error handling
pool.on('error', (err) => {
  console.error('Unexpected PG error:', err);
});

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


//app.get('/login', (req, res) => res.render('login'));
app.get('/login', (req, res) => {
  res.render('login', { errorMsg: null });
});

// Login post  route navigation
app.post('/login', async (req, res) => {
  const { username, password, adminlogin} = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      console.log("User not found");
      return res.status(401).render('login',{errorMsg: 'User does not exist'});
    }

    if (user.password !== password) {
      console.log("Incorrect password");
      return res.status(401).render('login', { errorMsg: 'Password is incorrect' });
    }
    req.session.user = user.username;
    req.session.role = user.role;
    console.log("Login successful:", user.username, "Role:", user.role);
    
    // Redirect based on role and adminlogin flag

    if (user.role === 'admin') {
      return res.redirect('/admin_dashboard');
    } else if (user.role === 'user') {
      if (adminlogin === 'on') {
        return res.render('login', { errorMsg: 'You do not have access to the admin dashboard.' });
      }
      return res.redirect('/user_dash');
    } else {
      return res.render('login', { errorMsg: 'Unknown role.' });
    }

    } catch (err) { 
    console.error('Login error:', err);
    res.status(500).render('login', { errorMsg: 'Internal server error' });
    }
    
});

app.get('/', (req, res) => {
  res.render('home'); 
});


app.get('/user_dash', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  try {
    const result = await pool.query('SELECT NOW() AS now');
    const now = result.rows[0].now;
    res.render('user_dash', { user: req.session.user, now });
  } catch (err) {
    console.error('DB query error:', err);
    res.render('user_dash', { user: req.session.user, now: 'Error fetching time' });
  }
});

///user_dash route:

app.get('/user_dash', async (req, res) => {
  console.log("Session user:", req.session.user);

  if (!req.session.user) {
    console.log("No session, redirecting to /login");
    return res.redirect('/login');
  }

  try {
    const result = await pool.query('SELECT NOW() AS now');
    const now = result.rows[0].now;
    res.render('user_dash', { user: req.session.user, now });
  } catch (err) {
    console.error('DB query error:', err);
    res.render('user_dash', { user: req.session.user, now: 'Error fetching time' });
  }
});


app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.redirect('/user_dash');
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

app.listen(3000, () => console.log('🚀 Server running at http://localhost:3000'));
