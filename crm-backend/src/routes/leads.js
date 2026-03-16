const express = require("express");
const { v4: uuidv4 } = require("uuid");
const pool = require("../db/pool");

const router = express.Router();


const VALID_SOURCES = ["site_web","reseaux_sociaux","referral","email_campaign","evenement","autre"];
const VALID_STATUSES = ["nouveau","contacté","converti"];

function formatLead(row, notes = []) {
  return {
    id:        row.id,
    name:      row.name,
    email:     row.email,
    phone:     row.phone    || undefined,
    company:   row.company  || undefined,
    source:    row.source,
    status:    row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    notes:     notes.map((n) => ({
      id:        n.id,
      content:   n.content,
      createdAt: n.created_at,
    })),
  };
}


router.get("/", async (req, res, next) => {
  try {
    const { search, status, source } = req.query;

    let sql    = "SELECT * FROM leads WHERE 1=1";
    const params = [];

    if (search) {
      sql += " AND (name LIKE ? OR email LIKE ? OR company LIKE ?)";
      const like = `%${search}%`;
      params.push(like, like, like);
    }
    if (status && VALID_STATUSES.includes(status)) {
      sql += " AND status = ?";
      params.push(status);
    }
    if (source && VALID_SOURCES.includes(source)) {
      sql += " AND source = ?";
      params.push(source);
    }

    sql += " ORDER BY created_at DESC";

    const [leads] = await pool.execute(sql, params);

    // Récupère toutes les notes en une seule requête
    let notes = [];
    if (leads.length > 0) {
      const ids = leads.map(() => "?").join(",");
      const [rows] = await pool.execute(
        `SELECT * FROM notes WHERE lead_id IN (${ids}) ORDER BY created_at DESC`,
        leads.map((l) => l.id)
      );
      notes = rows;
    }

    // Associe les notes à chaque lead
    const result = leads.map((lead) =>
      formatLead(lead, notes.filter((n) => n.lead_id === lead.id))
    );

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});


router.get("/stats", async (req, res, next) => {
  try {
    const [[totals]] = await pool.execute(`
      SELECT
        COUNT(*) AS total,
        SUM(status = 'nouveau')   AS nouveau,
        SUM(status = 'contacté')  AS contacte,
        SUM(status = 'converti')  AS converti
      FROM leads
    `);

    const total     = parseInt(totals.total);
    const nouveau   = parseInt(totals.nouveau);
    const contacte  = parseInt(totals.contacte);  // clé JS sans accent pour éviter les surprises
    const converti  = parseInt(totals.converti);
    const conversionRate = total > 0 ? Math.round((converti / total) * 100) : 0;

    res.json({
      success: true,
      data: {
        total,
        nouveau,
        "contacté": contacte,   // on garde l'accent pour correspondre au front
        converti,
        conversionRate,
      },
    });
  } catch (err) {
    next(err);
  }
});


router.get("/:id", async (req, res, next) => {
  try {
    const [[lead]] = await pool.execute("SELECT * FROM leads WHERE id = ?", [req.params.id]);
    if (!lead) return res.status(404).json({ success: false, error: "Lead introuvable" });

    const [notes] = await pool.execute(
      "SELECT * FROM notes WHERE lead_id = ? ORDER BY created_at DESC",
      [req.params.id]
    );

    res.json({ success: true, data: formatLead(lead, notes) });
  } catch (err) {
    next(err);
  }
});


router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone, company, source, status } = req.body;

    // Validation minimale
    if (!name?.trim())  return res.status(400).json({ success: false, error: "Le nom est requis" });
    if (!email?.trim()) return res.status(400).json({ success: false, error: "L'email est requis" });
    if (!VALID_SOURCES.includes(source))  return res.status(400).json({ success: false, error: "Source invalide" });
    if (status && !VALID_STATUSES.includes(status)) return res.status(400).json({ success: false, error: "Statut invalide" });

    const id  = uuidv4();
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    await pool.execute(
      `INSERT INTO leads (id,name,email,phone,company,source,status,created_at,updated_at)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [id, name.trim(), email.trim(), phone?.trim() || null, company?.trim() || null,
       source, status || "nouveau", now, now]
    );

    const [[newLead]] = await pool.execute("SELECT * FROM leads WHERE id = ?", [id]);
    res.status(201).json({ success: true, data: formatLead(newLead, []) });
  } catch (err) {
    next(err);
  }
});


router.patch("/:id", async (req, res, next) => {
  try {
    const [[lead]] = await pool.execute("SELECT * FROM leads WHERE id = ?", [req.params.id]);
    if (!lead) return res.status(404).json({ success: false, error: "Lead introuvable" });

    const { name, email, phone, company, source, status } = req.body;

    const fields = [];
    const values = [];

    if (name    !== undefined) { fields.push("name = ?");    values.push(name.trim()); }
    if (email   !== undefined) { fields.push("email = ?");   values.push(email.trim()); }
    if (phone   !== undefined) { fields.push("phone = ?");   values.push(phone?.trim() || null); }
    if (company !== undefined) { fields.push("company = ?"); values.push(company?.trim() || null); }
    if (source  !== undefined) {
      if (!VALID_SOURCES.includes(source)) return res.status(400).json({ success: false, error: "Source invalide" });
      fields.push("source = ?"); values.push(source);
    }
    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) return res.status(400).json({ success: false, error: "Statut invalide" });
      fields.push("status = ?"); values.push(status);
    }

    if (fields.length === 0) return res.status(400).json({ success: false, error: "Aucun champ à mettre à jour" });

    fields.push("updated_at = ?");
    values.push(new Date().toISOString().slice(0, 19).replace("T", " "));
    values.push(req.params.id);

    await pool.execute(`UPDATE leads SET ${fields.join(", ")} WHERE id = ?`, values);

    const [[updated]]  = await pool.execute("SELECT * FROM leads WHERE id = ?", [req.params.id]);
    const [notes]      = await pool.execute(
      "SELECT * FROM notes WHERE lead_id = ? ORDER BY created_at DESC",
      [req.params.id]
    );

    res.json({ success: true, data: formatLead(updated, notes) });
  } catch (err) {
    next(err);
  }
});


router.delete("/:id", async (req, res, next) => {
  try {
    const [[lead]] = await pool.execute("SELECT id FROM leads WHERE id = ?", [req.params.id]);
    if (!lead) return res.status(404).json({ success: false, error: "Lead introuvable" });

    await pool.execute("DELETE FROM leads WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Lead supprimé" });
  } catch (err) {
    next(err);
  }
});


router.post("/:id/notes", async (req, res, next) => {
  try {
    const [[lead]] = await pool.execute("SELECT id FROM leads WHERE id = ?", [req.params.id]);
    if (!lead) return res.status(404).json({ success: false, error: "Lead introuvable" });

    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ success: false, error: "Le contenu est requis" });

    const noteId = uuidv4();
    const now    = new Date().toISOString().slice(0, 19).replace("T", " ");

    await pool.execute(
      "INSERT INTO notes (id, lead_id, content, created_at) VALUES (?, ?, ?, ?)",
      [noteId, req.params.id, content.trim(), now]
    );

 
    await pool.execute(
      "UPDATE leads SET updated_at = ? WHERE id = ?",
      [now, req.params.id]
    );

    res.status(201).json({
      success: true,
      data: { id: noteId, content: content.trim(), createdAt: now },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
