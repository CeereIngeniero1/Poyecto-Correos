require("dotenv").config();
const sql = require("mssql");
const { enviarCorreo } = require("./mailer");

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function obtenerPendientes(pool, viewName) {
  const result = await pool.request().query(`SELECT * FROM [dbo].[${viewName}]`);
  return result.recordset;
}

async function marcarEnviado(pool, documento, tipo) {
  let campo = "";

  if (tipo === "cumpleanos") campo = "Cumpleaños";
  if (tipo === "mujer") campo = "Dia De La Mujer";
  if (tipo === "navidad") campo = "Navidad";

  if (!campo) throw new Error("Tipo inválido para actualizar recordatorio");

  await pool.request()
    .input("documento", sql.VarChar, documento)
    .query(`
      UPDATE [dbo].[Entidad Recordatorios]
      SET [${campo}] = GETDATE()
      WHERE [Documento Entidad] = @documento
    `);
}

async function procesarCumpleanos(pool) {
  const registros = await obtenerPendientes(pool, "Cnsta Recordatorios Cumpleaños");

  for (const r of registros) {
    try {
      await enviarCorreo({
        nombre: r["Nombre Completo Entidad"],
        email: r["E-mail Nro 1 EntidadII"],
        tipo: "cumpleanos",
      });

      await marcarEnviado(pool, r["Documento Entidad"], "cumpleanos");
      console.log(`✅ Cumpleaños enviado a ${r["Nombre Completo Entidad"]}`);
      await sleep(5000); // 5 segundos entre correos
    } catch (error) {
      console.error(`❌ Error enviando cumpleaños a ${r["Nombre Completo Entidad"]}:`, error.message);
    }
  }
}

async function procesarMujer(pool) {
  const registros = await obtenerPendientes(pool, "Cnsta Recordatorios Dia de la mujer");

  for (const r of registros) {
    try {
      await enviarCorreo({
        nombre: r["Nombre Completo Entidad"],
        email: r["E-mail Nro 1 EntidadII"],
        tipo: "mujer",
      });

      await marcarEnviado(pool, r["Documento Entidad"], "mujer");
      console.log(`✅ Día de la Mujer enviado a ${r["Nombre Completo Entidad"]}`);
      await sleep(5000); // 5 segundos entre correos
    } catch (error) {
      console.error(`❌ Error enviando Día de la Mujer a ${r["Nombre Completo Entidad"]}:`, error.message);
    }
  }
}

async function procesarNavidad(pool) {
  const registros = await obtenerPendientes(pool, "Cnsta Recordatorios Navidad");

  for (const r of registros) {
    try {
      await enviarCorreo({
        nombre: r["Nombre Completo Entidad"],
        email: r["E-mail Nro 1 EntidadII"],
        tipo: "navidad",
      });

      await marcarEnviado(pool, r["Documento Entidad"], "navidad");
      console.log(`✅ Navidad enviada a ${r["Nombre Completo Entidad"]}`);
      await sleep(5000); // 5 segundos entre correos
    } catch (error) {
      console.error(`❌ Error enviando Navidad a ${r["Nombre Completo Entidad"]}:`, error.message);
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function ejecutarProceso() {
  let pool;

  try {
    pool = await sql.connect(dbConfig);
    console.log("✅ Conectado a SQL Server");

    await procesarCumpleanos(pool);
    await procesarMujer(pool);
    await procesarNavidad(pool);

  } catch (error) {
    console.error("❌ Error general:", error.message);
  } finally {
    if (pool) await pool.close();
  }
}

// Ejecutar una vez al iniciar
ejecutarProceso();

// Ejecutar cada 5 minutos
setInterval(() => {
  console.log("⏳ Revisando recordatorios...");
  ejecutarProceso();
}, 5 * 60 * 1000);