const mysql = require("mysql2/promise");
const fs = require("fs");

async function testDb() {
  try {
    const connection = await mysql.createConnection({
      host: "127.0.0.1",
      port: 3308,
      user: "root",
      password: "StudentHubRootPass2025!",
      database: "studenthub_db",
      multipleStatements: true,
    });

    const seedSql = fs.readFileSync("sql/seed.sql", "utf8");

    console.log("Executing seed.sql...");
    await connection.query(seedSql);

    console.log("SEED SQL EXECUTED SUCCESSFULLY.");

    const [livelli] = await connection.execute(
      "SELECT COUNT(*) as count FROM livelli;",
    );
    console.log("LIVELLI COUNT:", livelli);

    await connection.end();
  } catch (err) {
    console.error("SQL ERROR:", err.message);
  }
}
testDb();
