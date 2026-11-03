import { getDb } from '../lib/db.js';
import { requireAuth } from '../lib/auth.js';
export default async function handler(req, res) {
  try {
    const user = requireAuth(req); const col = (await getDb()).collection('clients');
    if (req.method === 'GET') {
      const clients = await col.find({ ownerId: user.sub }).sort({ createdAt: -1 }).limit(200).toArray();
      return res.status(200).json({ clients: clients.map(c => ({ ...c, id: String(c._id) })) });
    }
    if (req.method === 'POST') {
      const { name, company = '', email, phone = '' } = req.body || {};
      if (!name?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')) return res.status(400).json({ error: 'Client name and valid email are required.' });
      const doc = { name: name.trim(), company: String(company).slice(0, 160), email: email.trim().toLowerCase(), phone: String(phone).slice(0, 40), ownerId: user.sub, createdAt: new Date() };
      const result = await col.insertOne(doc);
      return res.status(201).json({ client: { ...doc, id: String(result.insertedId) } });
    }
    res.setHeader('Allow','GET, POST'); return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) { console.error(e); return res.status(e.status || 500).json({ error: e.status ? e.message : 'Client request failed.' }); }
}