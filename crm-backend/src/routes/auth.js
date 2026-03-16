const express = require("express");
const jwt     = require("jsonwebtoken");
const router  = express.Router();

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || "admin@leadflow.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin1234!";
const JWT_SECRET     = process.env.JWT_SECRET     || "changeme_secret_jwt";
const JWT_EXPIRES    = process.env.JWT_EXPIRES    || "8h";


router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Email et mot de passe requis." });
  }

  // Vérification des credentials
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: "Email ou mot de passe incorrect." });
  }

  // Génération du token JWT
  const token = jwt.sign(
    { email, role: "admin" },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

  res.json({
    success: true,
    token,
    admin: { email },
    expiresIn: JWT_EXPIRES,
  });
});

router.get("/me", (req, res) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Token manquant." });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, admin: { email: decoded.email, role: decoded.role } });
  } catch {
    res.status(401).json({ success: false, error: "Token invalide ou expiré." });
  }
});

module.exports = router;
