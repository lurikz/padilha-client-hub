import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'padilha-tech-secret-key-2024';

// Fixed credentials
const FIXED_USER = 'padilha';
const FIXED_PASS = '@Lpc040802';

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === FIXED_USER && password === FIXED_PASS) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, user: { username } });
  }

  res.status(401).json({ error: 'Credenciais inválidas' });
});

export default router;
