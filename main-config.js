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
  web: {
    secret: process.env.clientSecret,
    url: process.env.webURL,
    id: '621097720781996072'
  },
  misc: {
    owners: [process.env.ownerKarol, process.env.ownerDevsaider, process.env.ownerGameboy],
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
