#!/usr/bin/env node

/*!
 * Claude Telegram Bot
 * Copyright (c) 2023
 *
 * @author Zubin
 * @username (GitHub) losparviero
 * @license AGPL-3.0
 */

// Add env vars as a preliminary

import dotenv from "dotenv";
dotenv.config();
import Claude from "claude-ai";
import { Bot, session, GrammyError, HttpError } from "grammy";
import { run, sequentialize } from "@grammyjs/runner";
import { hydrate } from "@grammyjs/hydrate";

// Bot

const bot = new Bot(process.env.BOT_TOKEN);

// Concurrency

function getSessionKey(ctx) {
  return ctx.chat?.id.toString();
}

// Config

const claude = new Claude({
  sessionKey: process.env.SESSION_KEY,
});

(async () => {
  await claude.init();
})();

// Plugins

bot.use(sequentialize(getSessionKey));
bot.use(session({ getSessionKey }));
bot.use(hydrate());
bot.use(responseTime);
bot.use(log);
bot.use(admin);

// Admin

const admins = process.env.BOT_ADMIN?.split(",").map(Number) || [];
async function admin(ctx, next) {
  ctx.config = {
    botAdmins: admins,
    isAdmin: admins.includes(ctx.chat?.id),
  };

  if (
    ctx.message.text &&
    !ctx.message.text.includes("/") &&
    !ctx.config.isAdmin
  ) {
    ctx.reply("*You are not authorized to use this bot.*", {
      reply_to_message_id: ctx.message.message_id,
      parse_mode: "Markdown",
    });
    console.log("Unauthorized use detected by:\n", ctx.from);
    return;
  }
  await next();
}

// Response

async function responseTime(ctx, next) {
  const before = Date.now();
  await next();
  const after = Date.now();
  console.log(`Response time: ${after - before} ms`);
}

// Log

async function log(ctx, next) {
  const from = ctx.from;
  const name =
    from.last_name === undefined
      ? from.first_name
      : `${from.first_name} ${from.last_name}`;
  console.log(
    `From: ${name} (@${from.username}) ID: ${from.id}\nMessage: ${ctx.message.text}`
  );

  await next();
}

// Commands

bot.command("start", async (ctx) => {
  await ctx
    .reply(
      "*Welcome! ✨*\n_This is a private interface to Claude.\nYou may request access at @anzubot._",
      { parse_mode: "Markdown" }
    )
    .then(console.log("New user added:\n", ctx.from));
});

bot.command("help", async (ctx) => {
  await ctx
    .reply(
      "*@anzubo Project.*\n\n_This is a private chat bot to talk to Claude AI.\nIf you have access, ask any query to get started!_",
      { parse_mode: "Markdown" }
    )
    .then(console.log("Help command sent to", ctx.chat.id));
});

bot.command("clear", async (ctx) => {
  const statusMessage = await ctx.reply("*Conversation context cleared.*", {
    parse_mode: "Markdown",
  });
  console.log("Yet to be implemented");
  await statusMessage.delete();
});

// Messages

bot.on("message:text", async (ctx) => {
  const statusMessage = await ctx.reply("*Processing*", {
    parse_mode: "Markdown",
  });
  const conversation = await claude.startConversation("Hello Claude!");
  const reply = await conversation.sendMessage(ctx.message.text);
  await ctx.reply(reply.completion, {
    reply_to_message_id: ctx.message.message_id,
    parse_mode: "Markdown",
  });
  await statusMessage.delete();
});

// Error

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(
    "Error while handling update",
    ctx.update.update_id,
    "\nQuery:",
    ctx.msg.text
  );
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
    if (e.description === "Forbidden: bot was blocked by the user") {
      console.log("Bot was blocked by the user");
    } else {
      ctx.reply("An error occurred");
    }
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

// Run

console.log(
  "Bot is running. Please keep this window open or use something like PM2."
);
run(bot);
