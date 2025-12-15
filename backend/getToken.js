import fs from "fs";
import path from "path";
import express from "express";
import { google } from "googleapis";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentials = JSON.parse(
    fs.readFileSync(path.join(__dirname, "credentials.json"))
);

const { client_secret, client_id, redirect_uris } = credentials.web;

const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0] 
);

const SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/spreadsheets",
];

const TOKEN_PATH = path.join(__dirname, "token.json");

if (fs.existsSync(TOKEN_PATH)) {
    console.log("✅ Token já existe. Pode rodar o server.js.");
    process.exit(0);
}

const app = express();

const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent", 
});

console.log("🔗 Autorize o app acessando:");
console.log(authUrl);

app.get("/oauth2callback", async (req, res) => {
    try {
        const code = req.query.code;

        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));

        res.send("✅ Token gerado com sucesso! Pode fechar esta aba.");
        console.log("✅ Token salvo em token.json");

        process.exit(0);
    } catch (error) {
        console.error("❌ Erro ao gerar token:", error);
        res.status(500).send("Erro ao gerar token.");
        process.exit(1);
    }
});

app.listen(3000, () =>
    console.log("🚀 Aguardando callback em http://localhost:3000/oauth2callback")
);
