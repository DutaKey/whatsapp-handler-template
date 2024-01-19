const { collection } = require("../../client/command");

module.exports = {
	name: "help",
	alias: ["h"],
	category: "general",
	description: "Help command",
	prefix: true,
	async run({ msg, sock, client }) {
		msg.reply(collection.size() + " Commannds");
	},
};
