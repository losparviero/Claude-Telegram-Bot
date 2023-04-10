import poe
import os
import telebot
from dotenv import load_dotenv

load_dotenv()
token = os.getenv("TOKEN")
bot_token = os.getenv("BOT")
bot = telebot.TeleBot(bot_token, parse_mode="HTML")
client = poe.Client(token)


@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    bot.reply_to(
        message, "<b>Welcome!</b> ✨\n<i>Send any query or ask questions.</i>")


@bot.message_handler(func=lambda message: True)
def echo(message):
    try:
        bot.send_chat_action(message.chat.id, 'typing')
        for chunk in client.send_message(
            chatbot="a2",
            message=message.text,
            with_chat_break="yes",
            timeout=20,
        ):
            pass
        bot.reply_to(message, chunk["text"])
    except Exception as e:
        bot.reply_to(message, f"Oops! Something went wrong. {e}")


bot.polling()
