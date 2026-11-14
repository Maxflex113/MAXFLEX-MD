const digits = value => String(value || "").replace(/\D/g, "");

const configuredOwnerNumber = digits(process.env.OWNER_NUMBER);
const ownerNumber = configuredOwnerNumber || "256701688170";
const configuredPrefix = process.env.PREFIX;
const prefix = configuredPrefix === undefined || configuredPrefix === "" ? "." : String(configuredPrefix);

const channel = Object.freeze({
  name: "MAXFLEX-MD ™",
  jid: "120363430518511561@newsletter"
});

export default Object.freeze({
  name: String(process.env.BOT_NAME || "MAXFLEX-MD").trim() || "MAXFLEX-MD",
  version: String(process.env.BOT_VERSION || "1.0.0").trim() || "1.0.0",
  prefix,
  ownerName: String(process.env.OWNER_NAME || "MAXFLEX").trim() || "MAXFLEX",
  ownerNumber,
  ownerNumbers: Object.freeze([ownerNumber]),
  defaultMode: String(process.env.BOT_MODE || "private").toLowerCase() === "public" ? "public" : "private",
  sessionDirectory: String(process.env.FEI_SESSION_DIR || "./auth_info_baileys").trim() || "./auth_info_baileys",
  dataDirectory: String(process.env.FEI_DATA_DIR || "./data").trim() || "./data",
  logLevel: String(process.env.LOG_LEVEL || "info").trim().toLowerCase(),
  browser: "Chrome",
  channel,
  imageUrl: String(
    process.env.BOT_IMAGE_URL ||
    "https://res.cloudinary.com/dqqyvozdw/image/upload/v1794661774/qylqs5h8cai5ugo79ucq.png"
  ).trim(),
  botUrl: String(process.env.BOT_URL || "https://whatsapp.com/channel/0029Vb8oQKzEgGfRYfZ0CW3D").trim()
});
