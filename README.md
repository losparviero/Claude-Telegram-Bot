# Claude Telegram Bot

Use Anthropic's Claude chat bot in Telegram.

<br>

### Install

1. Clone repo.
2. Run ```pip3 install -r requirements.txt``` in project folder.
3. Rename .env.example to .env and provide tokens.
4. Run ```python3 bot.py``` to start the bot.

[Instructions for Poe token](https://github.com/ading2210/poe-api#finding-your-token)

<details>

<summary>
Bot admin ID
</summary>

<br>

BOT_ADMIN is needed to prevent unauthorized access.

</details>

<br>

#### It's advisable to run the bot using PM2 or any startup manager for persistent execution.

<br>

### Uninstall

1. Use ```rm -rf```.

*Note:* If you're unfamiliar with this command, delete project folder from file explorer.

<br>

### Mechanism

This uses the [poe-api](https://github.com/ading2210/poe-api) module to interact with Claude using Poe.

<br>

### License

AGPL-3.0 ©️ Zubin