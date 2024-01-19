const axios = require("axios");
module.exports = {
	name: "get",
	alias: [],
	category: "fetch",
	description: "Get Web Using Axios",
	prefix: true,
	async run({ msg, sock, client }) {
		const { body } = msg;
		const url = body.split(" ")[1] || false;
		if (!url) msg.reply("Please Provide Url");
		axios
			.get(url)
			.then((res) => {
				const responseData = res.data;
				msg.reply(responseData.toString());
			})
			.catch((err) => {
				msg.reply(err.toString());
			});
	},
};
