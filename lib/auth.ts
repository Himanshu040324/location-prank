export const isAdmin = (req: Request) =>
  req.headers.get('x-admin-key') === process.env.ADMIN_KEY;