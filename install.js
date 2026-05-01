#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');

const SETTINGS_PATH = path.join(os.homedir(), '.claude', 'settings.json');
const HOOK_PATH = path.resolve(__dirname, 'hook.sh');
const HOOK_EVENTS = ['SessionStart', 'PreToolUse', 'PostToolUse', 'Notification', 'Stop'];

fs.chmodSync(HOOK_PATH, '755');

let settings = {};
if (fs.existsSync(SETTINGS_PATH)) {
  settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf-8'));
}
settings.hooks = settings.hooks || {};

for (const event of HOOK_EVENTS) {
  settings.hooks[event] = settings.hooks[event] || [];
  const alreadyInstalled = settings.hooks[event].some(entry =>
    entry.hooks?.some(h => h.command === HOOK_PATH)
  );
  if (!alreadyInstalled) {
    settings.hooks[event].push({ matcher: '', hooks: [{ type: 'command', command: HOOK_PATH }] });
    console.log(`  + ${event}`);
  } else {
    console.log(`  ~ ${event} (already installed)`);
  }
}

fs.mkdirSync(path.dirname(SETTINGS_PATH), { recursive: true });
fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
console.log(`\nHooks written to ${SETTINGS_PATH}`);
console.log('Set DISCORD_CLIENT_ID and run: npm start');
