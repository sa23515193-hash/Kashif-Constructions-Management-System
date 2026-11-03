import { getDb } from '../lib/db.js';
import { requireAuth } from '../lib/auth.js';
export default async function handler(req, res) {
  try {
    const user = requireAuth(req); const col = (await getDb()).collection('tasks');
    if (req.method === 'GET') {
      const tasks = await col.find({ ownerId: user.sub }).sort({ createdAt: -1 }).limit(200).toArray();
      return res.status(200).json({ tasks: tasks.map(t => ({ ...t, id: String(t._id) })) });
    }
    if (req.method === 'POST') {
      const { title, project = '', owner = '', due = '' } = req.body || {};
      if (!title?.trim()) return res.status(400).json({ error: 'Task title is required.' });
      const doc = { title: title.trim(), project: String(project).slice(0,160), owner: String(owner).slice(0,100), due: String(due).slice(0,40), status: 'Pending', ownerId: user.sub, createdAt: new Date() };
      const result = await col.insertOne(doc);
      return res.status(201).json({ task: { ...doc, id: String(result.insertedId) } });
    }
    res.setHeader('Allow','GET, POST'); return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) { console.error(e); return res.status(e.status || 500).json({ error: e.status ? e.message : 'Task request failed.' }); }
}