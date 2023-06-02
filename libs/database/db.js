const { MongoClient } = require("mongodb");
require("dotenv").config();

async function connectToMongo() {
	try {
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
