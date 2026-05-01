function getActivity(event, model) {
  const { hook_event_name, tool_name } = event;
  const modelDisplay = formatModel(model);

  switch (hook_event_name) {
    case 'SessionStart': return { details: 'Starting session',       state: modelDisplay };
    case 'PreToolUse':   return { details: getToolDetails(tool_name), state: modelDisplay };
    case 'PostToolUse':  return { details: 'Thinking',               state: modelDisplay };
    case 'Notification': return { details: 'Sending a notification', state: modelDisplay };
    case 'Stop':         return { details: 'Waiting for prompt',     state: modelDisplay };
    default:             return { details: 'Active',                 state: modelDisplay };
  }
}

function getToolDetails(tool) {
  switch (tool) {
    case 'Bash':       return 'Running a command';
    case 'Edit':
    case 'MultiEdit':  return 'Editing a file';
    case 'Write':      return 'Writing a file';
    case 'Read':       return 'Reading a file';
    case 'WebSearch':  return 'Searching the web';
    case 'WebFetch':   return 'Fetching a URL';
    case 'Agent':      return 'Spawning a subagent';
    case 'TodoWrite':  return 'Managing tasks';
    default:           return `Using ${tool}`;
  }
}

// Turn "claude-sonnet-4-6" → "Claude Sonnet 4.6"
function formatModel(slug) {
  if (!slug) return null;
  return slug
    .replace(/^claude-/i, 'Claude ')
    .replace(/-/g, ' ')
    .replace(/(\d+) (\d+)/, '$1.$2')     // "4 6" → "4.6"
    .replace(/\b\w/g, c => c.toUpperCase()) // title-case remaining words
    .replace(/^Claude /i, 'Claude ');       // keep "Claude" consistent
}

module.exports = { getActivity };
