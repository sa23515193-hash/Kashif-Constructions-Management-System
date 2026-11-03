import { ObjectId } from 'mongodb';
import { getDb } from '../lib/db.js';
import { requireAuth } from '../lib/auth.js';
export default async function handler(req, res) {
  try {
    const user = requireAuth(req);
    const db = await getDb();
    const col = db.collection('projects');
    if (req.method === 'GET') {
      const q = String(req.query?.q || '').slice(0, 100);
      const filter = q ? { ownerId: user.sub, $or: [{ name: { $regex: q, $options: 'i' } }, { client: { $regex: q, $options: 'i' } }] } : { ownerId: user.sub };
      const rows = await col.find(filter).sort({ createdAt: -1 }).limit(100).toArray();
      return res.status(200).json({ projects: rows.map(x => ({ ...x, id: String(x._id), _id: undefined })) });
    }
    if (req.method === 'POST') {
      const { name, client, location = '', budget } = req.body || {};
      if (!name?.trim() || !client?.trim() || !Number.isFinite(Number(budget)) || Number(budget) <= 0) return res.status(400).json({ error: 'Project name, client and positive budget are required.' });
      const doc = { name: name.trim(), client: client.trim(), location: String(location).slice(0, 160), budget: Number(budget), spent: 0, progress: 0, status: 'Planning', ownerId: user.sub, createdAt: new Date() };
      const result = await col.insertOne(doc);
      return res.status(201).json({ project: { ...doc, id: String(result.insertedId) } });
    }
    res.setHeader('Allow', 'GET, POST'); return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) { console.error(e); return res.status(e.status || 500).json({ error: e.status ? e.message : 'Project request failed.' }); }
}