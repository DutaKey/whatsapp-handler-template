module.exports = {
	name: "runtime",
	alias: [],
	category: "general",
	description: "Check Bot Runtime",
	prefix: true,
	async run({ msg, sock, client }) {
		const uptimeInSeconds = process.uptime();
		const formattedUptime = formatDuration(uptimeInSeconds);

		msg.reply(`Bot has been running for ${formattedUptime}`);
	},
};

function formatDuration(seconds) {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = Math.floor(seconds % 60);

	const formattedTime = `${hours}h ${minutes}m ${remainingSeconds}s`;

	return formattedTime;
}
