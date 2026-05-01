const { connect, setActivity, clearActivity } = require('./rpc');
const { startServer } = require('./server');
const { getActivity } = require('./activity');

const IDLE_MS = parseInt(process.env.IDLE_TIMEOUT_MINUTES || '30', 10) * 60 * 1000;

let idleTimer;
let sessionModel = null;

function resetIdle() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    clearActivity();
    console.log('Idle timeout — exiting.');
    process.exit(0);
  }, IDLE_MS);
}

connect();
startServer(event => {
  // Capture model from SessionStart
  if (event.hook_event_name === 'SessionStart' && event.model) {
    sessionModel = event.model;
  }

  const activity = getActivity(event, sessionModel);
  setActivity(activity);

  resetIdle();
});

resetIdle();

process.on('SIGTERM', () => { clearActivity(); process.exit(0); });
process.on('SIGINT',  () => { clearActivity(); process.exit(0); });
