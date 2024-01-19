const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path").join;
require("dotenv").config();

async function connectToMongo() {
	try {
		if (!fs.existsSync(path(".env"))) {
			return console.log(
				"\x1b[31m%s\x1b[0m",
				`[${new Date().toLocaleTimeString()}] ❌ Rename .env.example to .env and enter your MONGO_URI and DB_NAME `
			);
		} else if (
			(fs.existsSync(path(".env")) && !process.env.MONGO_URI) ||
			!process.env.DB_NAME ||
			(!process.env.MONGO_URI && !process.env.DB_NAME)
		) {
			return console.log(
				"\x1b[31m%s\x1b[0m",
				`[${new Date().toLocaleTimeString()}] ❌ Enter your MONGO_URI and DB_NAME in .env file`
			);
		}
		console.info(
			"\x1b[34m%s\x1b[0m",
			`[${new Date().toLocaleTimeString()}] ! Connecting to MongoDB...`
		);
		const client = await MongoClient.connect(process.env.MONGO_URI);
		const db = client.db(process.env.DB_NAME);
		console.log(
			"\x1b[32m%s\x1b[0m",
			`[${new Date().toLocaleTimeString()}] ✅ Connected To MongoDB`
		);
		return db;
	} catch (error) {
		console.log(
			"\x1b[31m%s\x1b[0m",
			`[${new Date().toLocaleTimeString()}] ❌ Failed Connected To MongoDB: ${error}`
		);
	}
}

module.exports = connectToMongo;
