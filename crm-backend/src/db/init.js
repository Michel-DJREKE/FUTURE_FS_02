
const mysql = require("mysql2/promise");
require("dotenv").config();

async function init() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || "localhost",
    port:     parseInt(process.env.DB_PORT || "3306"),
    user:     process.env.DB_USER     || "root",
    password: process.env.DB_PASSWORD || "",
  });

  const db = process.env.DB_NAME || "leadflow_crm";


  console.log(`🔧 Création de la base "${db}"…`);

  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${db}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await conn.query(`USE \`${db}\``);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id          CHAR(36)     NOT NULL PRIMARY KEY,
      name        VARCHAR(255) NOT NULL,
      email       VARCHAR(255) NOT NULL,
      phone       VARCHAR(50)  DEFAULT NULL,
      company     VARCHAR(255) DEFAULT NULL,
      source      ENUM(
        'site_web','reseaux_sociaux','referral',
        'email_campaign','evenement','autre'
      ) NOT NULL DEFAULT 'site_web',
      status      ENUM('nouveau','contacté','converti')
                               NOT NULL DEFAULT 'nouveau',
      created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                               ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_status (status),
      INDEX idx_source (source),
      INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS notes (
      id         CHAR(36)     NOT NULL PRIMARY KEY,
      lead_id    CHAR(36)     NOT NULL,
      content    TEXT         NOT NULL,
      created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
      INDEX idx_lead (lead_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  console.log("✅ Tables créées (leads + notes)");

 
  const [[{ cnt }]] = await conn.query("SELECT COUNT(*) AS cnt FROM leads");

  if (cnt === 0) {
    const { v4: uuidv4 } = require("uuid");
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    const demoLeads = [
      [uuidv4(), "Alice Martin",  "alice@startup.io",   "+33612345678", "Startup.io", "site_web",        "nouveau",  now, now],
      [uuidv4(), "Bob Dupont",    "bob@agence.fr",       null,           "Agence XY",  "reseaux_sociaux", "contacté", now, now],
      [uuidv4(), "Clara Nguyen",  "clara@freelance.fr", "+33698765432",  null,          "referral",        "converti", now, now],
      [uuidv4(), "David Koné",    "david@corp.com",      null,           "Corp SA",    "email_campaign",  "nouveau",  now, now],
      [uuidv4(), "Eva Tremblay",  "eva@design.co",      "+33611223344", "Design.co",  "evenement",       "contacté", now, now],
    ];

    await conn.query(
      `INSERT INTO leads (id,name,email,phone,company,source,status,created_at,updated_at) VALUES ?`,
      [demoLeads]
    );

    console.log("🌱 5 leads de démo insérés");
  } else {
    console.log("ℹ️  Des leads existent déjà, seed ignoré");
  }

  await conn.end();
  console.log("🎉 Base de données prête !");
}

init().catch((err) => {
  console.error("❌ Erreur init :", err.message);
  process.exit(1);
});
