import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // API endpoint for sending emails
  app.post("/api/contact", async (req, res) => {
    const { name, email, phone, service, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ success: false, error: "Campi obbligatori mancanti." });
      return;
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const recipient = process.env.NOTIFICATION_EMAIL || "info.micdropstudio@gmail.com";

    // If SMTP user or SMTP pass is not defined, we cannot send silently via backend
    if (!smtpUser || !smtpPass) {
      console.log("SMTP not configured in environment variables. Falling back to client-side guidance.");
      res.json({ 
        success: false, 
        error: "SMTP_NOT_CONFIGURED",
        message: "SMTP non configurato. Abilitate le credenziali nel pannello Secrets su AI Studio." 
      });
      return;
    }

    try {
      // Create Nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for port 465, false for 587
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const serviceLabel = service === "ALL" ? "Pacchetto Completo (Tutto)" : service;

      const mailOptions = {
        from: `"${name}" <${smtpUser}>`, // Send via configured SMTP user but with sender name
        replyTo: email, // Direct replies to customer's email
        to: recipient,
        subject: `[MicDrop Studio] Nuovo Progetto - ${name}`,
        text: `Ciao MicDrop Studio,\n\nHai ricevuto una nuova richiesta d'informazioni dal modulo contatti del sito web.\n\n` +
              `DETTAGLI CONTATTO:\n` +
              `- Nome: ${name}\n` +
              `- Email di lavoro: ${email}\n` +
              `- Telefono: ${phone || "Non inserito"}\n` +
              `- Servizio d'interesse: ${serviceLabel}\n\n` +
              `DETTAGLI DEL PROGETTO:\n` +
              `${message}\n\n` +
              `-------------------------\n` +
              `Questo messaggio è stato inviato automaticamente dal server di MicDrop Studio.`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #1a1a1a; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 12px; background: #fafafa;">
            <h2 style="color: #ff5500; border-bottom: 2px solid #ff5500; padding-bottom: 8px; margin-top: 0;">Nuova Richiesta MicDrop Studio</h2>
            <p>Hai ricevuto un nuovo contatto compilato sul sito web:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 35%;">Nome:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Telefono:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${phone || "<em>Non fornito</em>"}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Servizio:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; color: #e64a19; font-weight: bold;">${serviceLabel}</td>
              </tr>
            </table>
            
            <div style="background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; margin-top: 15px;">
              <h3 style="margin-top: 0; color: #333; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Descrizione del Progetto</h3>
              <p style="white-space: pre-wrap; margin-bottom: 0; font-size: 14px; line-height: 1.6; color: #444;">${message}</p>
            </div>
            
            <p style="font-size: 11px; color: #999; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
              Ricevuto dal modulo contatti del sito MicDrop Studio. Premi "Rispondi" nel tuo client mail per rispondere direttamente all'utente.
            </p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email successfully delivered for ${email}`);
      res.json({ success: true, method: "smtp" });
    } catch (err: any) {
      console.error("Failed to send email via SMTP:", err);
      res.status(500).json({ 
        success: false, 
        error: "SMTP_SEND_FAILED", 
        message: err.message || "Errore sconosciuto nell'invio dell'email via SMTP." 
      });
    }
  });

  // Vite integration for asset serving & HMR simulation
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
