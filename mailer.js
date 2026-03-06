const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function makeCid(filename) {
  return filename
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_.-]/g, "");
}

function obtenerTemplate(tipo) {
  switch (tipo) {
    case "cumpleanos":
      return { carpeta: "Cumpleaños", asunto: "🎉 Feliz cumpleaños" };
    case "mujer":
      return { carpeta: "Dia de la Mujer", asunto: "🌸 Feliz Día de la Mujer" };
    case "navidad":
      return { carpeta: "Feliz navidad", asunto: "🎄 Feliz Navidad" };
    default:
      throw new Error("Tipo no válido");
  }
}

function buildHtmlAndAttachments(folderPath, nombre) {
  const files = fs.readdirSync(folderPath);

  const htmlFile = files.find(f => f.toLowerCase().endsWith(".html"));
  if (!htmlFile) throw new Error(`No encontré HTML en ${folderPath}`);

  let html = fs.readFileSync(path.join(folderPath, htmlFile), "utf8");
  html = html.replace(/{{NOMBRE}}/g, nombre || "");

  const imageFiles = files.filter(f => /\.(png|jpg|jpeg|gif|webp)$/i.test(f));

  const attachments = imageFiles.map(img => ({
    filename: img,
    path: path.join(folderPath, img),
    cid: makeCid(img),
  }));

  for (const img of imageFiles) {
    const cid = makeCid(img);
    const escaped = img.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    html = html.replace(new RegExp(`src=["']${escaped}["']`, "gi"), `src="cid:${cid}"`);
    html = html.replace(new RegExp(`src=["']\\./${escaped}["']`, "gi"), `src="cid:${cid}"`);
  }

  return { html, attachments };
}

async function enviarCorreo({ nombre, email, tipo }) {
  const transporter = createTransporter();
  const { carpeta, asunto } = obtenerTemplate(tipo);
  const folderPath = path.join(__dirname, carpeta);

  const { html, attachments } = buildHtmlAndAttachments(folderPath, nombre);

  await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
    to: email,
    subject: asunto,
    html,
    attachments,
  });
}

module.exports = { enviarCorreo };