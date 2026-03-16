require("dotenv").config();
const express = require("express");
const cors    = require("cors");

const leadsRouter                = require("./routes/leads");
const authRouter                 = require("./routes/auth");
const { requireAuth }            = require("./middleware/requireAuth");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware globaux ────────────────────────────────────────────────────────
app.use(cors({
  origin:         process.env.CLIENT_URL || "http://localhost:8081",
  methods:        ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// ── Sanity check (public) ─────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Auth (public — pas de requireAuth ici) ────────────────────────────────────
app.use("/api/auth", authRouter);

// ── Leads (protégées — JWT obligatoire) ───────────────────────────────────────
app.use("/api/leads", requireAuth, leadsRouter);

// ── Erreurs ───────────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Démarrage ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 LeadFlow API  →  http://localhost:${PORT}`);
  console.log(`   Health check  →  http://localhost:${PORT}/api/health`);
});
