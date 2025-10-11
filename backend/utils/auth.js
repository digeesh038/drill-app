// server/utils/auth.js
export const requireAuth = (req, res, next) => {
  if (req.user) {
    return next();
  }

  if (req.session && req.session.userId) {
    return next();
  }

  res.status(401).json({ error: "Not logged in" });
};
