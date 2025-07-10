import express from "express"
import cors from "cors"
import connection from "./db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express()
const port = 4000

app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    res.send("API Working")
})

app.get('/api/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    res.json(results);
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  });
});

app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  connection.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hash, 'user'],
    (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ success: true });
    }
  );
});

const JWT_SECRET = 'your_secret_key';

app.get('/api/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });

    connection.query('SELECT id, name, email, role FROM users WHERE id = ?', [decoded.id], (err, results) => {
      if (err || results.length === 0) return res.status(401).json({ error: 'User not found' });
      res.json(results[0]);
    });
  });
});

app.post('/api/food', (req, res) => {
  const { name, description, price, image, category } = req.body;
  connection.query(
    'INSERT INTO food (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)',
    [name, description, price, image, category],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err });
        return;
      }
      res.json({ success: true, id: results.insertId });
    }
  );
});

app.get('/api/food', (req, res) => {
  connection.query('SELECT * FROM food', (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    res.json(results);
  });
});

// --- CART ENDPOINTS ---

// Middleware to authenticate and get user id from JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
}

// Get cart items for logged-in user
app.get('/api/cart', authenticateToken, (req, res) => {
  const userId = req.user.id;
  connection.query(
    'SELECT c.id, c.item_id, c.quantity, f.name, f.price, f.image FROM cart c JOIN food f ON c.item_id = f.id WHERE c.user_id = ?',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

// Add or update cart item
app.post('/api/cart', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { item_id, quantity } = req.body;
  if (!item_id || quantity == null) return res.status(400).json({ error: 'Missing item_id or quantity' });
  // Upsert logic
  connection.query(
    'INSERT INTO cart (user_id, item_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = ?',
    [userId, item_id, quantity, quantity],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true });
    }
  );
});

// Remove cart item
app.delete('/api/cart', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { item_id } = req.body;
  if (!item_id) return res.status(400).json({ error: 'Missing item_id' });
  connection.query(
    'DELETE FROM cart WHERE user_id = ? AND item_id = ?',
    [userId, item_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true });
    }
  );
});

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port} `)
})