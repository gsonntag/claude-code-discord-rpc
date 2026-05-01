# Claude Code Discord RPC

Show Claude Code activity as Discord Rich Presence.

## What it looks like

When active, your Discord profile shows:

```
Playing Claude Code
┌──────────────────────────────────┐
│  [Claude logo]  Claude Code      │
│                 Editing a file   │  ← current activity
│                 Claude Sonnet 4.6│  ← model in use
│                 12:34 elapsed    │  ← session duration
└──────────────────────────────────┘
```

### Activity states

| State              | When                                  |
|--------------------|---------------------------------------|
| Starting session   | Claude Code session just started      |
| Running a command  | Executing a shell command             |
| Editing a file     | Making edits to a file                |
| Writing a file     | Creating a new file                   |
| Reading a file     | Reading file contents                 |
| Searching the web  | Performing a web search               |
| Fetching a URL     | Fetching content from a URL           |
| Spawning a subagent| Delegating to a subagent              |
| Managing tasks     | Working with the todo list            |
| Thinking           | Processing between tool calls         |
| Waiting for prompt | Idle, waiting for your next message   |

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI installed
- Discord desktop app running

### Install

```bash
# Clone the repo
git clone https://github.com/gsonntag/claude-code-discord-rpc.git
cd claude-code-discord-rpc

# Install dependencies
npm install

# Register hooks with Claude Code
npm run install-hooks
```

Next time you use Claude Code, the Discord presence will appear automatically.