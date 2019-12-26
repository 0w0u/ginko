require('dotenv').config();
module.exports = {
	tokens: {
		bot: process.env.tokensBot,
		mongo: process.env.tokensMongo,
		votes: {
			password: process.env.tokensVotePass,
			webhook: process.env.tokensVoteWebhook
		},
		logs: {
			token: process.env.tokensLogsToken,
			id: process.env.tokensLogsID
		}
	},
	misc: {
		owners: [
			process.env.ownerKarol,
			process.env.ownerDevsaider,
			process.env.ownerGameboy
		],
		prefix: process.env.prefix,
		others: {
			github: process.env.github,
			glitch: process.env.glitch,
			donate: process.env.donate,
			support: process.env.support,
			invite: process.env.invite
		}
	}
};
