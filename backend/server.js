
// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// === Carrega credenciais ===
let credentials;
let token;

try {
    credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    token = JSON.parse(process.env.GOOGLE_TOKEN);
} catch (err) {
    // fallback local para testes
    credentials = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../credentials.json"))
    );
    token = JSON.parse(fs.readFileSync(path.join(__dirname, "../token.json")));
}

const { client_secret, client_id, redirect_uris } = credentials.web;

const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
);

oAuth2Client.setCredentials(token);

const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
const sheets = google.sheets({ version: "v4", auth: oAuth2Client });

const CALENDAR_ID = process.env.CALENDAR_ID;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = process.env.SHEET_NAME || "Agendamentos";

function horarioValido(dateStr, timeStr) {
    const date = new Date(`${dateStr}T${timeStr}:00-03:00`);
    const dia = date.getDay();
    const hora = date.getHours();
    if (dia === 0) return false;
    if (dia >= 1 && dia <= 5) return hora >= 8 && hora < 18;
    if (dia === 6) return hora >= 9 && hora < 14;
    return false;
}

app.post("/agendar", async (req, res) => {
    try {
        const { name, phone, service, date, time } = req.body;

        const valores = { "Corte Social": 35, Degradê: 35, "Degr. Navalhado": 40, "Corte Infantil": 30, Barba: 25, Pézinho: 10, Sobrancelha: 10 };
        const valor = valores[service] || 0;

        if (!horarioValido(date, time)) {
            return res.status(400).json({
                message: "❌ Horário fora do expediente. Escolha outro horário.",
            });
        }

        const startDateTime = new Date(`${date}T${time}:00-03:00`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60000);

        const events = await calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: startDateTime.toISOString(),
            timeMax: endDateTime.toISOString(),
            singleEvents: true,
            orderBy: "startTime",
        });

        if (events.data.items.length > 0) {
            return res.status(400).json({
                message: "⚠️ Este horário já está ocupado. Escolha outro.",
            });
        }

        const event = {
            summary: `${service} - ${name}`,
            start: {
                dateTime: startDateTime.toISOString(),
                timeZone: "America/Sao_Paulo",
            },
            end: {
                dateTime: endDateTime.toISOString(),
                timeZone: "America/Sao_Paulo",
            },
        };

        await calendar.events.insert({ calendarId: CALENDAR_ID, resource: event });

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A:F`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[name, phone, service, date, time, valor]],
            },
        });

        res.json({ success: true, message: "✅ Agendamento criado com sucesso!" });
    } catch (error) {
        console.error("❌ Erro ao criar agendamento:", error);
        res.status(500).json({
            message:
                "Erro ao criar agendamento. Verifique logs do servidor para detalhes.",
        });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
