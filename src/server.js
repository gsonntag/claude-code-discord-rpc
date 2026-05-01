const http = require('http');

const PORT = parseInt(process.env.RPC_PORT || '7463', 10);
const HOST = '127.0.0.1';

function startServer(onEvent) {
  const server = http.createServer((req, res) => {
    if (req.method !== 'POST' || req.url !== '/hook') {
      res.writeHead(404).end();
      return;
    }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const event = JSON.parse(body);
        if (process.env.DEBUG) console.log('[hook]', event.hook_event_name, event.tool_name || '');
        onEvent(event);
      } catch (err) {
        if (process.env.DEBUG) console.error('[hook parse error]', err.message);
      }
      res.writeHead(200).end('ok');
    });
  });

  server.listen(PORT, HOST, () => {
    console.log(`Listening on http://${HOST}:${PORT}`);
  });

  server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
      // Another instance is already running — this one should just exit
      process.exit(0);
    }
    throw err;
  });
}

module.exports = { startServer };
