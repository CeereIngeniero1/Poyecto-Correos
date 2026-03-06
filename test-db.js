require("dotenv").config();
const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

async function conectarDB() {
  try {

    const pool = await sql.connect(config);

    console.log("✅ Conectado a SQL Server");

    const result = await pool.request().query("SELECT GETDATE() AS fecha");

    console.log("Resultado:", result.recordset);

    sql.close();

  } catch (error) {

    console.error("❌ Error de conexión:", error);

  }
}

conectarDB();