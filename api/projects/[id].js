import { ObjectId } from 'mongodb';
import { getDb } from '../lib/db.js';
import { requireAuth } from '../lib/auth.js';
export default async function handler(req, res) {
  try {
    const user = requireAuth(req);
    const id = req.query.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid project ID.' });
    const db = await getDb(); const col = db.collection('projects'); const filter = { _id: new ObjectId(id), ownerId: user.sub };
    if (req.method === 'PATCH') {
      const allowed = ['name','client','location','budget','spent','progress','status','due'];
      const update = {};
      for (const key of allowed) if (req.body?.[key] !== undefined) update[key] = req.body[key];
      if (update.budget !== undefined && Number(update.budget) <= 0) return res.status(400).json({ error: 'Budget must be positive.' });
      if (update.progress !== undefined && (Number(update.progress) < 0 || Number(update.progress) > 100)) return res.status(400).json({ error: 'Progress must be between 0 and 100.' });
      const result = await col.findOneAndUpdate(filter, { $set: { ...update, updatedAt: new Date() } }, { returnDocument: 'after' });
      if (!result) return res.status(404).json({ error: 'Project not found.' });
      return res.status(200).json({ project: { ...result, id: String(result._id) } });
    }
    if (req.method === 'DELETE') {
      const result = await col.deleteOne(filter);
      return result.deletedCount ? res.status(200).json({ success: true }) : res.status(404).json({ error: 'Project not found.' });
    }
    res.setHeader('Allow', 'PATCH, DELETE'); return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) { console.error(e); return res.status(e.status || 500).json({ error: e.status ? e.message : 'Project update failed.' }); }
}