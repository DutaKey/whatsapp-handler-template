const {
	default: WASocket,
	DisconnectReason,
	useMultiFileAuthState,
} = require("@whiskeysockets/baileys");
const useMongoAuthState = require("./session");
const Pino = require("pino");
const { Boom } = require("@hapi/boom");
const chatEvent = require("../events/chatEvent");
const { serialize } = require("../client/serialize");
const path = require("path").join;

class WaClient {
	async connect(type) {
		const connectionType = type === "local" ? "Local" : "Mongodb";
		const { state, saveCreds } =
			type === "local"
				? await useMultiFileAuthState(path("./session"))
				: await useMongoAuthState("session");
		const sock = WASocket({
			printQRInTerminal: true,
			auth: state,
			logger: Pino({ level: "silent" }),
		});

		sock.ev.on("creds.update", saveCreds);

		sock.ev.on("connection.update", async (up) => {
			const { lastDisconnect, connection } = up;
			if (connection == "connecting") {
				this.log(connection + `, Connection Type ${connectionType}`, "info");
			}

			if (connection === "open") {
				this.log("Connection Success Connected");
			}
			if (connection === "close") {
				let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
				if (reason === DisconnectReason.badSession) {
					this.log(
						`Bad Session File, Please Delete session and Scan Again`,
						"warning"
					);
					sock.logout();
				} else if (reason === DisconnectReason.connectionClosed) {
					this.log("Connection closed, reconnecting....", "warning");
					this.connect();
				} else if (reason === DisconnectReason.connectionLost) {
					this.log("Connection Lost from Server, reconnecting...", "warning");
					this.connect();
				} else if (reason === DisconnectReason.connectionReplaced) {
					this.log(
						"Connection Replaced, Another New Session Opened, Please Close Current Session First",
						"error"
					);
					sock.logout();
				} else if (reason === DisconnectReason.loggedOut) {
					this.log(
						`Device Logged Out, Please Delete session and Scan Again.`,
						"error"
					);
					sock.logout();
				} else if (reason === DisconnectReason.restartRequired) {
					this.log("Restart Required, Restarting...", "warning");
					this.connect();
				} else if (reason === DisconnectReason.timedOut) {
					this.log("Connection TimedOut, Reconnecting...", "warning");
					this.connect();
				} else {
					sock.end(
						`Unknown DisconnectReason: ${reason}|${lastDisconnect.error}`
					);
				}
			}
		});
		sock.ev.on("messages.upsert", async (m) => {
			try {
				if (m.type !== "notify") return;
				let msg = serialize(JSON.parse(JSON.stringify(m.messages[0])), sock);
				if (!msg.message) return;
				if (msg.key && msg.key.remoteJid === "status@broadcast") return;
				if (
					msg.type === "protocolMessage" ||
					msg.type === "senderKeyDistributionMessage" ||
					!msg.type ||
					msg.type === ""
				)
					return;
				chatEvent(msg, sock, this);
			} catch (e) {
				this.log(e, "error");
			}
		});
	}

	log(text, type = "success") {
		const colors = {
			success: "\x1b[32m", // Hijau
			info: "\x1b[34m", // Biru
			warning: "\x1b[33m", // Kuning
			error: "\x1b[31m", // Merah
		};

		const emojis = {
			success: "✅",
			info: "!",
			warning: "⚠️",
			error: "❌",
		};

		const resetColor = "\x1b[0m";

		if (type in colors && type in emojis) {
			const emoji = emojis[type];
			const color = colors[type];
			const timestamp = new Date().toLocaleTimeString();
			const logText = `[${timestamp}] ${emoji} ${text}`;
			console.log(color + logText + resetColor);
		} else {
			console.log(text);
		}
	}
}

module.exports = WaClient;
