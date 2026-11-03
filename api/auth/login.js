import bcrypt from 'bcryptjs';
import { getDb } from '../lib/db.js';
import { signToken } from '../lib/auth.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
    const db = await getDb();
    const user = await db.collection('users').findOne({ email: String(email).trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ error: 'Invalid email or password.' });
    return res.status(200).json({ token: signToken(user), user: { id: String(user._id), name: user.name, email: user.email, role: user.role } });
  } catch (e) { console.error(e); return res.status(500).json({ error: 'Unable to sign in.' }); }
}