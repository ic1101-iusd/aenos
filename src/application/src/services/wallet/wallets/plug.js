import config from 'Constants/config';
import logger from 'Utils/logger';

const whitelist = [
  config.canisterIdVault,
  config.canisterIdUsbFt,
  config.canisterIdBtcFt,
];

export const connect = async () => {
  const plug = window.ic.plug;

  if (!plug.current) {
    window.open('https://plugwallet.ooo/','_blank');
    return;
  }

  const connected = await plug.requestConnect({
    whitelist,
    host: config.HOST,
  });

  if (!connected) return;

  logger.log('Plug: login success', authClient);

  if (!plug.agent) {
    await plug.createAgent({
      whitelist,
      host: config.HOST,
    });
  }

  return await plug.agent.getPrincipal();
};

export const disconnect = () => {
  const plug = window.ic.plug;

  if (!plug.current) return;

  plug.disconnect();
};

export const getPrincipal = async () => {
  const plug = window.ic.plug;

  if (!plug) return;

  const connected = await plug.current.isConnected();

  if (connected && !plug.current.agent) {
    await plug.current.createAgent({
      whitelist,
      host: config.HOST,
    });
  }

  if (connected && plug.current.agent) {
    return await plug.current.agent.getPrincipal();
  } else {
    return null;
  }
};

export const createActor = async (idlFactory, canisterId) => {
  const plug = window.ic.plug;

  if (!plug) return;

  return await plug.current.createActor({
    canisterId,
    interfaceFactory: idlFactory,
  });
};
