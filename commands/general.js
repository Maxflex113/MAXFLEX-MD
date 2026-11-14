
import { buildMenu } from "../lib/menu.js";

function formatDuration(seconds) {
  let remaining = Math.max(0, Math.floor(Number(seconds) || 0));

  const days = Math.floor(remaining / 86400);
  remaining %= 86400;

  const hours = Math.floor(remaining / 3600);
  remaining %= 3600;

  const minutes = Math.floor(remaining / 60);
  const secs = remaining % 60;

  const parts = [];

  if (days) parts.push(days + "d");
  if (hours) parts.push(hours + "h");
  if (minutes) parts.push(minutes + "m");
  if (secs || !parts.length) parts.push(secs + "s");

  return parts.join(" ");
}

function messageTimestampMs(message) {
  const raw = message && message.messageTimestamp;

  const value =
    raw && typeof raw.toNumber === "function"
      ? raw.toNumber()
      : Number(raw);

  if (!Number.isFinite(value) || value <= 0) return null;

  return value > 1000000000000 ? value : value * 1000;
}

function ownerNumber(config) {
  const owners = Array.isArray(config.ownerNumbers)
    ? config.ownerNumbers
    : [];

  return String(owners[0] || "").replace(/\D/g, "");
}

function createHeader(title) {
  return [
    "╭━━〔 " + title + " 〕━━╮",
    "┃"
  ];
}

function createFooter() {
  return [
    "┃",
    "╰━━━━━━━━━━━━━━━━━━━━━━╯"
  ];
}

const commands = [
  {
    name: "menu",
    aliases: ["helpme"],
    category: "General",
    description: "Show the MAXFLEX-MD menu.",
    run: async ctx => {
      const menu = buildMenu({
        commands: ctx.commands,
        config: ctx.config,
        theme: ctx.theme
      });

      if (ctx.config.imageUrl) {
        try {
          await ctx.send({
            image: { url: ctx.config.imageUrl },
            caption:
              "╭━━〔 🤖 MAXFLEX-MD 〕━━╮\n" +
              "┃  WhatsApp Bot\n" +
              "┃  ✦ Powered by MAXFLEX-MD\n" +
              "╰━━━━━━━━━━━━━━━━━━╯"
          });
        } catch (error) {
          console.warn(
            "MAXFLEX-MD menu artwork could not be sent:",
            error?.message || error
          );
        }
      }

      await ctx.reply(menu);
    }
  },

  {
    name: "help",
    category: "General",
    description: "Show available commands.",
    run: async ctx => {
      const visible = (ctx.commands || [])
        .filter(command => !command.hidden)
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));

      const categories = [
        ...new Set(visible.map(command => command.category || "Other"))
      ].sort();

      const lines = [
        "╭━━〔 📚 MAXFLEX-MD HELP 〕━━╮",
        "┃",
        "┃  ✦ Available Commands: " + visible.length,
        "┃"
      ];

      for (const category of categories) {
        lines.push("╭━━〔 " + category.toUpperCase() + " 〕━━╮");

        const members = visible.filter(
          command => (command.category || "Other") === category
        );

        for (const command of members) {
          lines.push("┃  ✧ " + ctx.config.prefix + command.name);
        }

        lines.push("╰━━━━━━━━━━━━━━━━━━╯", "");
      }

      lines.push(
        "┃  ⚡ POWERED BY MAXFLEX-MD",
        "╰━━━━━━━━━━━━━━━━━━━━━━╯"
      );

      const output = lines.join("\n");
      const chunks = [];

      let current = "";

      for (const line of output.split("\n")) {
        if (current.length + line.length + 1 > 3300) {
          chunks.push(current.trimEnd());
          current = "";
        }

        current += line + "\n";
      }

      if (current.trim()) chunks.push(current.trimEnd());

      for (const chunk of chunks) {
        await ctx.reply(chunk);
      }
    }
  },

  {
    name: "ping",
    category: "General",
    description: "Check bot response time.",
    run: async ctx => {
      const timestamp = messageTimestampMs(ctx.msg);

      const responseMs =
        timestamp === null
          ? null
          : Math.max(0, Date.now() - timestamp);

      await ctx.reply([
        ...createHeader("🏓 MAXFLEX-MD · PONG"),
        "┃  ✦ Status    : " +
          (ctx.connectionOpen ? "Online 🟢" : "Connecting 🟡"),
        "┃  ✦ Response  : " +
          (responseMs === null ? "Unavailable" : responseMs + " ms"),
        "┃  ✦ Uptime    : " + formatDuration(process.uptime()),
        "┃  ✦ Version   : " + ctx.config.version,
        ...createFooter()
      ].join("\n"));
    }
  },

  {
    name: "alive",
    aliases: ["uptime"],
    category: "General",
    description: "Show bot status and uptime.",
    run: async ctx => {
      await ctx.reply([
        ...createHeader("🟢 SYSTEM STATUS"),
        "┃  ✦ Bot       : " + (ctx.config.name || "MAXFLEX-MD"),
        "┃  ✦ Status    : " +
          (ctx.connectionOpen ? "Online" : "Connecting"),
        "┃  ✦ Mode      : " +
          String(ctx.mode || "public").toUpperCase(),
        "┃  ✦ Uptime    : " + formatDuration(process.uptime()),
        "┃  ✦ Developer : " + ctx.config.ownerName,
        ...createFooter()
      ].join("\n"));
    }
  },

  {
    name: "owner",
    category: "General",
    description: "Show bot owner details.",
    run: async ctx => {
      const number = ownerNumber(ctx.config);

      await ctx.reply([
        ...createHeader("👑 BOT OWNER"),
        "┃  ✦ Name      : " + ctx.config.ownerName,
        ...(number
          ? ["┃  ✦ Number    : +" + number]
          : []),
        ...createFooter()
      ].join("\n"));
    }
  },

  {
    name: "support",
    category: "General",
    description: "Show support information.",
    run: async ctx => {
      await ctx.reply([
        ...createHeader("🛟 MAXFLEX-MD SUPPORT"),
        "┃  ✦ For setup assistance",
        "┃  ✦ Contact: " + ctx.config.ownerName,
        "┃",
        "┃  ✦ GitHub Repository",
        "┃  https://github.com/Benfeitech/FEI-XMD",
        ...createFooter()
      ].join("\n"));
    }
  },

  {
    name: "time",
    category: "General",
    description: "Show current Nigeria time.",
    run: async ctx => {
      const value = new Intl.DateTimeFormat("en-NG", {
        timeZone: "Africa/Lagos",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      }).format(new Date());

      await ctx.reply([
        ...createHeader("🕒 NIGERIA TIME"),
        "┃  ✦ Time : " + value,
        ...createFooter()
      ].join("\n"));
    }
  },

  {
    name: "date",
    category: "General",
    description: "Show current Nigeria date.",
    run: async ctx => {
      const value = new Intl.DateTimeFormat("en-NG", {
        timeZone: "Africa/Lagos",
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
      }).format(new Date());

      await ctx.reply([
        ...createHeader("📅 NIGERIA DATE"),
        "┃  ✦ Date : " + value,
        ...createFooter()
      ].join("\n"));
    }
  },

  {
    name: "version",
    category: "General",
    description: "Show bot version and connection status.",
    run: async ctx => {
      await ctx.reply([
        ...createHeader("🤖 MAXFLEX-MD VERSION"),
        "┃  ✦ Version  : " + ctx.config.version,
        "┃  ✦ Status   : " +
          (ctx.connectionOpen ? "Online 🟢" : "Connecting 🟡"),
        "┃  ✦ Mode     : " +
          String(ctx.mode || "public").toUpperCase(),
        "┃  ✦ Library  : Baileys",
        ...createFooter()
      ].join("\n"));
    }
  },

  {
    name: "jid",
    aliases: ["id"],
    category: "General",
    description: "Show chat and sender IDs.",
    run: async ctx => {
      await ctx.reply([
        ...createHeader("🆔 CHAT INFORMATION"),
        "┃  ✦ Chat ID   : " + ctx.jid,
        "┃  ✦ Sender ID : " +
          (ctx.senderJid || "Unavailable"),
        ...createFooter()
      ].join("\n"));
    }
  },

  {
    name: "whoami",
    category: "General",
    description: "Show WhatsApp sender information.",
    run: async ctx => {
      await ctx.reply([
        ...createHeader("👤 USER INFORMATION"),
        "┃  ✦ Name   : " + (ctx.msg?.pushName || "Unknown"),
        "┃  ✦ ID     : " + (ctx.senderJid || "Unavailable"),
        "┃  ✦ Owner  : " + (ctx.owner ? "Yes" : "No"),
        ...createFooter()
      ].join("\n"));
    }
  }
];

export default commands;
