const { Client } = require('@xhayper/discord-rpc');

// Public shared app — already named "Claude Code" with logo on Discord
const CLIENT_ID = process.env.DISCORD_CLIENT_ID || '1472915568930848829';
const START_TIME = new Date();
const RECONNECT_DELAY = 15_000;

let client = null;
let ready = false;

async function connect() {
  client = new Client({ clientId: CLIENT_ID });

  client.on('ready', () => {
    ready = true;
    console.log(`Connected to Discord as ${client.user?.username}`);
    setActivity({ details: 'Waiting for prompt', state: null });
  });

  try {
    await client.login();
  } catch (err) {
    ready = false;
    console.error(`Discord connection failed: ${err.message} — retrying in ${RECONNECT_DELAY / 1000}s`);
    setTimeout(connect, RECONNECT_DELAY);
  }
}

function setActivity({ details, state }) {
  if (!ready || !client) return;
  const activity = {
    name: 'Claude Code',
    details,
    timestamps: { start: Math.floor(START_TIME.getTime() / 1000) },
    assets: { large_image: 'claude_logo', large_text: 'Claude Code' },
    instance: false,
  };
  if (state) activity.state = state;
  client.request('SET_ACTIVITY', { pid: process.pid, activity }).catch(() => {
    ready = false;
    setTimeout(connect, RECONNECT_DELAY);
  });
}

function clearActivity() {
  if (!ready || !client) return;
  client.request('SET_ACTIVITY', { pid: process.pid }).catch(() => {});
}

module.exports = { connect, setActivity, clearActivity };
