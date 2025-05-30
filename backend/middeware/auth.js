function auth(req, res, next) {
    if (!req.session.user) return res.status(400).json({ error: "falied" });
    next();
}
module.exports = auth;