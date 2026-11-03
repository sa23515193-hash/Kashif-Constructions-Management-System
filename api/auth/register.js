import bcrypt from 'bcryptjs';
import { getDb } from '../lib/db.js';
import { signToken } from '../lib/auth.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { name, email, password } = req.body || {};
    if (!name || name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '') || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Provide a name, valid email, and password of at least 8 characters.' });
    }
    const db = await getDb();
    const users = db.collection('users');
    const normalizedEmail = email.trim().toLowerCase();
    if (await users.findOne({ email: normalizedEmail })) return res.status(409).json({ error: 'An account with this email already exists.' });
    const user = { name: name.trim(), email: normalizedEmail, passwordHash: await bcrypt.hash(password, 12), role: 'user', createdAt: new Date() };
    const result = await users.insertOne(user);
    user._id = result.insertedId;
    return res.status(201).json({ token: signToken(user), user: { id: String(user._id), name: user.name, email: user.email, role: user.role } });
  } catch (e) { console.error(e); return res.status(e.status || 500).json({ error: e.status ? e.message : 'Unable to register account.' }); }
}