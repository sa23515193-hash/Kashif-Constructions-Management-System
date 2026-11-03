import { requireAuth } from '../lib/auth.js';
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try { const user = requireAuth(req); return res.status(200).json({ user }); }
  catch (e) { return res.status(e.status || 401).json({ error: e.message }); }
}