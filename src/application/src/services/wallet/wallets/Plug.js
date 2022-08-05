import config from 'Constants/config';
import logger from 'Utils/logger';

const whitelist = [
  config.canisterIdVault,
  config.canisterIdUsbFt,
  config.canisterIdBtcFt,
];

class Plug {
  async connect() {
    const plug = window.ic.plug;

    if (!plug) {
      window.open('https://plugwallet.ooo/','_blank');
      return;
    }

    const connected = await plug.requestConnect({
      whitelist,
      host: config.HOST,
    });

    if (!connected) return;

    if (!plug.agent) {
      await plug.createAgent({
        whitelist,
        host: config.HOST,
      });
    }

    const principal = await plug.agent.getPrincipal();

    logger.log('Plug: login success', principal);

    return principal;
  };

  disconnect() {
    const plug = window.ic.plug;

    if (!plug) return;

    plug.disconnect();
  };

  async getPrincipal() {
    const plug = window.ic.plug;

    if (!plug) return;

    const connected = await plug.isConnected();

    if (connected && !plug.agent) {
      await plug.createAgent({
        whitelist,
        host: config.HOST,
      });
    }

    if (connected && plug.agent) {
      return await plug.agent.getPrincipal();
    } else {
      return null;
    }
  };

  async createActor(idlFactory, canisterId) {
    const plug = window.ic.plug;

    if (!plug) return;

    return await plug.createActor({
      canisterId,
      interfaceFactory: idlFactory,
    });
  };
}

export default new Plug();
