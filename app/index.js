
import InitServer from './initializers/initServer';
import config from './config';
import Logger from './utils/Logger';

InitServer(config).then((app) => {
  // Initialize application server
  app.listen(config.port, () => Logger.debug(`Listening on port: ${config.port}`));
});
