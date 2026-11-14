
export function getSectionCommands(section, commands = []) {
  const visible = commands.filter(command => !command.hidden);

  if (Array.isArray(section.commandNames)) {
    const selected = new Set(
      section.commandNames.map(value => String(value).toLowerCase())
    );

    return visible.filter(command =>
      selected.has(String(command.name).toLowerCase())
    );
  }

  const categories =
    Array.isArray(section.categories) && section.categories.length
      ? section.categories
      : [section.key];

  const excluded = new Set(
    (section.excludeNames || []).map(name => String(name).toLowerCase())
  );

  return visible.filter(command =>
    categories.includes(command.category) &&
    !excluded.has(String(command.name).toLowerCase())
  );
}

export function buildMenu({
  commands = [],
  config = {},
  theme = {}
} = {}) {
  const menu = theme.menu || {};
  const sections = Array.isArray(theme.sections)
    ? theme.sections
    : [];

  const prefix = String(config.prefix || ".");
  const botName = String(config.name || "MAXFLEX-MD")
    .replace(/[\r\n]/g, " ")
    .slice(0, 40);

  const visibleCommands = commands.filter(
    command => !command.hidden
  );

  const lines = [
    "╭━━〔 🤖 " + botName + " 〕━━╮",
    "┃",
    "┃  ✦ WhatsApp Bot",
    "┃  ✦ Version  : " + String(config.version || "1.0.0"),
    "┃  ✦ Prefix   : " + prefix,
    "┃  ✦ Commands : " + visibleCommands.length,
    "┃"
  ];

  if (!visibleCommands.length) {
    lines.push(
      "┃  ✧ Commands are being prepared."
    );
  } else {
    const assigned = new Set();

    for (const section of sections) {
      const members = getSectionCommands(section, commands)
        .filter(command => !assigned.has(command.name));

      const title = String(
        section.title || section.key || "OTHER"
      ).toUpperCase();

      lines.push(
        "╭━━〔 " + title + " 〕━━╮"
      );

      if (!members.length) {
        lines.push(
          "┃  ✧ No commands available"
        );
      } else {
        for (const command of members) {
          assigned.add(command.name);

          lines.push(
            "┃  ✧ " + prefix + command.name
          );
        }
      }

      lines.push(
        "╰━━━━━━━━━━━━━━━━━━╯",
        ""
      );
    }

    const ungrouped = visibleCommands.filter(
      command => !assigned.has(command.name)
    );

    if (ungrouped.length) {
      lines.push(
        "╭━━〔 OTHER 〕━━╮"
      );

      for (const command of ungrouped) {
        lines.push(
          "┃  ✧ " + prefix + command.name
        );
      }

      lines.push(
        "╰━━━━━━━━━━━━━━━━━━╯",
        ""
      );
    }
  }

  lines.push(
    "┃",
    "┃  ⚡ POWERED BY MAXFLEX-MD",
    "╰━━━━━━━━━━━━━━━━━━━━━━╯"
  );

  return lines.join("\n");
}
