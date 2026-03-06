require("dotenv").config();
const { enviarCorreo } = require("./mailer");

enviarCorreo({
  nombre: "Prueba Con Imágenes",
  email: process.env.MAIL_TO_TEST || process.env.MAIL_FROM_EMAIL,
  tipo: "cumpleanos",
}).catch(console.error);