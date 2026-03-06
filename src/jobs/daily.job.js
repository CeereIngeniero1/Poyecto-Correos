const path = require("path");
const cron = require("node-cron");
const { buildEmailFromFolder } = require("../Services/template.service");
const { sendMail } = require("../Services/mailer.service");
const {
    getBirthdayRecipients,
    getWomenDayRecipients,
    getChristmasRecipients,
} = require("../Services/recipients.service");
const { isWomensDay, isChristmas } = require("../utils/dates");

async function sendBirthdayEmails(today = new Date()) {
    const recipients = await getBirthdayRecipients(today);
    if (!recipients.length) return;

    const folder = path.join(process.cwd(), "Cumpleaños");
    for (const r of recipients) {
        const { html, attachments } = buildEmailFromFolder(folder, { NOMBRE: r.Nombre });
        await sendMail({
            to: r.Email,
            subject: `🎉 Feliz cumpleaños, ${r.Nombre}!`,
            html,
            attachments,
        });
    }
}

async function sendWomensDayEmails(today = new Date()) {
    if (!isWomensDay(today)) return;

    const recipients = await getWomenDayRecipients();
    if (!recipients.length) return;

    const folder = path.join(process.cwd(), "Dia de la Mujer");
    for (const r of recipients) {
        const { html, attachments } = buildEmailFromFolder(folder, { NOMBRE: r.Nombre });
        await sendMail({
            to: r.Email,
            subject: `🌸 Feliz Día de la Mujer, ${r.Nombre}!`,
            html,
            attachments,
        });
    }
}

async function sendChristmasEmails(today = new Date()) {
    if (!isChristmas(today)) return;

    const recipients = await getChristmasRecipients();
    if (!recipients.length) return;

    const folder = path.join(process.cwd(), "Feliz navidad");
    for (const r of recipients) {
        const { html, attachments } = buildEmailFromFolder(folder, { NOMBRE: r.Nombre });
        await sendMail({
            to: r.Email,
            subject: `🎄 ¡Feliz Navidad, ${r.Nombre}!`,
            html,
            attachments,
        });
    }
}

function startDailyJob() {
    const expr = process.env.CRON_EXPRESSION || "0 9 * * *";

    cron.schedule(expr, async () => {
        const today = new Date();
        try {
            await sendBirthdayEmails(today);
            await sendWomensDayEmails(today);
            await sendChristmasEmails(today);
            console.log(`[OK] Job ejecutado: ${today.toISOString()}`);
        } catch (err) {
            console.error("[ERROR] Job falló:", err);
        }
    });

    console.log(`[INFO] Cron activo con: ${expr}`);
}

module.exports = { startDailyJob };