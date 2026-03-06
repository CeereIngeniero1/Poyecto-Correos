const { getPool, sql } = require("../config/db");

async function getBirthdayRecipients(today = new Date()) {
  const pool = await getPool();

  // Compara día y mes de FechaNacimiento con el día/mes de hoy
  // Esto es SQL Server: DAY() y MONTH()
  const result = await pool
    .request()
    .input("day", sql.Int, today.getDate())
    .input("month", sql.Int, today.getMonth() + 1)
    .query(`
      SELECT Email, Nombre
      FROM Pacientes
      WHERE Email IS NOT NULL
        AND DAY(FechaNacimiento) = @day
        AND MONTH(FechaNacimiento) = @month
    `);

  return result.recordset;
}

async function getWomenDayRecipients() {
  const pool = await getPool();

  // Ejemplo: solo mujeres
  const result = await pool.request().query(`
    SELECT Email, Nombre
    FROM Pacientes
    WHERE Email IS NOT NULL
      AND (Genero = 'F' OR Genero = 'Femenino')
  `);

  return result.recordset;
}

async function getChristmasRecipients() {
  const pool = await getPool();

  // Ejemplo: todos
  const result = await pool.request().query(`
    SELECT Email, Nombre
    FROM Pacientes
    WHERE Email IS NOT NULL
  `);

  return result.recordset;
}

module.exports = {
  getBirthdayRecipients,
  getWomenDayRecipients,
  getChristmasRecipients,
};