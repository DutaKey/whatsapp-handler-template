module.exports = chatEvent = async (msg, sock, client) => {
	try {
		const { body, from } = msg;
		client.log(from + ": " + body);
	} catch (e) {
		client.log(e, "error");
	}
};
