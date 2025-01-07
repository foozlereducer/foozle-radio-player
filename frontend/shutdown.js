import net from 'net';

const checkAndReleasePort = (port) => {
  const server = net.createServer();

  // Try binding to the port
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is currently in use. Attempting to close it...`);
      // Force the port to close by connecting and disconnecting
      const client = new net.Socket();
      client
        .connect({ port }, () => {
          client.end(); // Immediately disconnect
        })
        .on('error', (err) => {
          console.error(`Failed to release port ${port}: ${err.message}`);
        });
    }
  });

  server.once('listening', () => {
    console.log(`Port ${port} is not in use. Cleaning up complete.`);
    server.close(); // Close the temporary server
  });

  server.listen(port);
};

const setupShutdownHooks = (port) => {
  const cleanup = () => {
    console.log('Cleaning up resources...');
    checkAndReleasePort(port);
  };

  process.on('SIGINT', () => {
    console.log('Received SIGINT (Ctrl+C). Shutting down...');
    cleanup();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Shutting down...');
    cleanup();
    process.exit(0);
  });

  process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    cleanup();
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled promise rejection:', reason);
    cleanup();
    process.exit(1);
  });
};

export default setupShutdownHooks;
