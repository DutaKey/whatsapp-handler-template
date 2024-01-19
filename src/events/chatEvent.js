const { collection } = require("../client/command");
const multi_pref = new RegExp(
	"^[" + "!#$%&?/;:,.<>~-+=".replace(/[|\\{}()[\]^$+*?.\-\^]/g, "\\$&") + "]"
);

module.exports = chatEvent = async (msg, sock, client) => {
	try {
		let { body } = msg;
		let cmdName = (body?.split(" ")[0] || "").replace(multi_pref, "");
		let userPrefix = cmdName.length !== body?.split(" ")[0]?.length;
		let cmd =
			collection.get(cmdName) ||
			collection.find((cmd) => cmd.alias?.includes(cmdName));

		if (!cmd) return;

		const requiresPrefix = cmd.prefix || false;
		if ((requiresPrefix && userPrefix) || (!requiresPrefix && !userPrefix)) {
			cmd.run({ msg, sock, client });
		}
	} catch (e) {
		client.log(e, "error");
	}
};
