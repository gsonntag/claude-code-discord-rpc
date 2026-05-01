#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');

const SETTINGS_PATH = path.join(os.homedir(), '.claude', 'settings.json');
const HOOK_PATH = path.resolve(__dirname, 'hook.sh');
const HOOK_EVENTS = ['PreToolUse', 'PostToolUse', 'Notification', 'Stop'];

if (!fs.existsSync(SETTINGS_PATH)) {
  console.log('No settings.json found — nothing to uninstall.');
  process.exit(0);
}

const settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf-8'));
if (!settings.hooks) {
  console.log('No hooks configured — nothing to uninstall.');
  process.exit(0);
}

for (const event of HOOK_EVENTS) {
  if (!settings.hooks[event]) continue;
  const before = settings.hooks[event].length;
  settings.hooks[event] = settings.hooks[event]
    .map(entry => ({
      ...entry,
      hooks: (entry.hooks || []).filter(h => h.command !== HOOK_PATH),
    }))
    .filter(entry => entry.hooks.length > 0);
  const removed = before - settings.hooks[event].length;
  if (removed) console.log(`  - ${event}`);
}

fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
console.log('Hooks removed.');
