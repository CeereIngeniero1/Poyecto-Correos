require("dotenv").config();
const { createTransporter, enviarCorreo } = require("./mailer");

async function main() {
  const transporter = createTransporter();

  console.log("🔎 Verificando SMTP...");
  await transporter.verify();
  console.log("✅ SMTP OK");

  console.log("📨 Enviando correo REAL...");
  await enviarCorreo(
    {
      nombre: "Prueba Medimujer",
      email: process.env.MAIL_TO_TEST || process.env.MAIL_FROM_EMAIL,
      tipo: "cumpleanos",
    },
    transporter
  );

  console.log("✅ Listo. Revisa bandeja y SPAM.");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});