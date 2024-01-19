const path = require("path").join;
const fs = require("fs");
const Collection = require("../utils/collection");
const collection = new Collection();

async function commandInit() {
	commandDir = path(__dirname, "../commands");
	dir = fs.readdirSync(commandDir);
	dir.forEach(($dir) => {
		const commandFiles = fs
			.readdirSync(path(commandDir, $dir))
			.filter((file) => file.endsWith(".js"));
		for (let file of commandFiles) {
			const command = require(path(commandDir, $dir, file));
			collection.add(command.name, command);
		}
	});
}

module.exports = { commandInit, collection };
