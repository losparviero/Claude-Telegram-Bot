# Claude Telegram Bot

Talk to Claude AI in Telegram, no API key needed!

The functionality is very basic at the moment. I'll be adding replies and context to messages shortly. If you want to contribute, I'm happy to accept PRs.

<br>

### Install

1. Clone repo.
2. Run ```npm i``` in project folder.
3. Rename .env.example to .env and provide bot token & sessionKey.
4. Run ```node bot``` to start the bot.

#### It's advisable to run the bot using PM2 or any startup manager for persistent execution.

<br>

### Uninstall

1. Use ```rm -rf```.

*Note:* If you're unfamiliar with this command, delete project folder from file explorer.

<br>

### Mechanism

Since Anthropic has been reluctant to provide API access unless you're a major org, the only way to access Claude is through the [unofficial API](https://www.npmjs.com/package/claude-ai). Note that this is unstable as they may push breaking changes and there is risk of your account being banned, for which I will not be liable.

### License

AGPL-3.0 ©️ Zubin