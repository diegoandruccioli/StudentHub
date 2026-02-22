const mysql = require("mysql2/promise");

async function checkSQL() {
  try {
    const c = await mysql.createConnection({
      host: "127.0.0.1",
      port: 3308,
      user: "root",
      password: "StudentHubRootPass2025!",
      database: "studenthub_db",
    });

    console.log("Creating table...");
    await c.query(`
CREATE TABLE IF NOT EXISTS impostazioni_utente (
    id_utente INT PRIMARY KEY,
    tema_voti ENUM('DEFAULT', 'RGB') NOT NULL DEFAULT 'DEFAULT',
    rgb_soglia_bassa INT DEFAULT 18 CHECK (rgb_soglia_bassa >= 18 AND rgb_soglia_bassa <= 30),
    rgb_soglia_alta INT DEFAULT 27 CHECK (rgb_soglia_alta >= 18 AND rgb_soglia_alta <= 30),
    CONSTRAINT chk_soglie CHECK (rgb_soglia_bassa <= rgb_soglia_alta),
    FOREIGN KEY (id_utente) REFERENCES utenti(id) ON DELETE CASCADE
);`);
    console.log("SUCCESS IMPOSTAZIONI.");
    await c.end();
  } catch (e) {
    console.log("ERROR SQL:", e.message);
    process.exit(1);
  }
}
checkSQL();
