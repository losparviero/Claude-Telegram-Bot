import poe
import os
import telebot
from dotenv import load_dotenv

load_dotenv()
token = os.getenv("TOKEN")
bot_token = os.getenv("BOT")
adminId = int(os.getenv("BOT_ADMIN"))

bot = telebot.TeleBot(bot_token)
client = poe.Client(token)


@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    bot.reply_to(
        message, "<b>Welcome!</b> ✨\n<i>Send any query or ask questions.</i>", parse_mode="HTML")


@bot.message_handler(func=lambda message: True)
def claude(message):
    if message.from_user.id != adminId:
        bot.reply_to(
            message, "<b>You are not authorized to use this bot.</b>", parse_mode="HTML")
        return
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
