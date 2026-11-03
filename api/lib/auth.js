import jwt from 'jsonwebtoken';
export function signToken(user) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured');
  return jwt.sign({ sub: String(user._id), role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
}
export function requireAuth(req, roles = []) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token || !process.env.JWT_SECRET) {
    const e = new Error('Authentication required'); e.status = 401; throw e;
  }
  let payload;
  try { payload = jwt.verify(token, process.env.JWT_SECRET); }
  catch { const e = new Error('Invalid or expired token'); e.status = 401; throw e; }
  if (roles.length && !roles.includes(payload.role)) {
    const e = new Error('Insufficient permissions'); e.status = 403; throw e;
  }
  return payload;
}
export function methodNotAllowed(res, methods) {
  res.setHeader('Allow', methods.join(', '));
  return res.status(405).json({ error: 'Method not allowed' });
}