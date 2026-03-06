const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

function makeCid(filename) {
  // cid simple y estable
  return filename
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_.-]/g, "");
}

function buildEmailFromFolder(folderPath, variables = {}) {
  // buscar el primer .html
  const files = fs.readdirSync(folderPath);
  const htmlFile = files.find(f => f.toLowerCase().endsWith(".html"));
  if (!htmlFile) throw new Error(`No encontré .html en: ${folderPath}`);

  const htmlPath = path.join(folderPath, htmlFile);
  let html = fs.readFileSync(htmlPath, "utf8");

  // Handlebars soporta {{NOMBRE}} tal como lo tienes
  const template = handlebars.compile(html);
  html = template(variables);

  // Adjuntos: todas las imágenes del folder
  const imageFiles = files.filter(f => /\.(png|jpg|jpeg|webp|gif)$/i.test(f));
  const attachments = imageFiles.map((img) => {
    const cid = makeCid(img);
    return {
      filename: img,
      path: path.join(folderPath, img),
      cid,
    };
  });

  // Reescribir src="./archivo.png" o src="archivo.png" a cid
  for (const img of imageFiles) {
    const cid = makeCid(img);
    // Variantes comunes: ./img, img, .\img
    const escaped = img.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const patterns = [
      new RegExp(`src=["']\\./${escaped}["']`, "gi"),
      new RegExp(`src=["']${escaped}["']`, "gi"),
      new RegExp(`src=["']\\.\\\\${escaped}["']`, "gi"),
    ];
    for (const re of patterns) {
      html = html.replace(re, `src="cid:${cid}"`);
    }
  }

  return { html, attachments };
}

module.exports = { buildEmailFromFolder };