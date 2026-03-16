const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "changeme_secret_jwt";



function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Accès refusé — token manquant. Connectez-vous d'abord.",
    });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded; 
    next();
  } catch (err) {
    const message =
      err.name === "TokenExpiredError"
        ? "Session expirée — veuillez vous reconnecter."
        : "Token invalide — veuillez vous reconnecter.";

    return res.status(401).json({ success: false, error: message });
  }
}

module.exports = { requireAuth };
