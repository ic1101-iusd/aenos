import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';

import logger from 'Utils/logger';

// 7 days in nanoseconds
const TIME_TO_LIVE = BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000);

export const connect = async () => {
  const authClient = await AuthClient.create();

  return new Promise((resolve, reject) => {
    authClient.login({
      maxTimeToLive: TIME_TO_LIVE,
      onSuccess: async () => {
        logger.log('InternetIdentity: login success', authClient);

        const identity = await authClient.getIdentity();

        resolve(identity.getPrincipal());
      },
      onError: (err) => {
        logger.error(err);
        reject(err);
      }
    });
  })
};

export const disconnect = async () => {
  const authClient = await AuthClient.create();

  authClient.logout();
};

export const getPrincipal = async () => {
  const authClient = await AuthClient.create();

  const isAuthenticated = await authClient.isAuthenticated();

  if (!isAuthenticated) return null;

  const identity = await authClient.getIdentity();

  return identity.getPrincipal();
};

export const createActor = async (idlFactory, canisterId) => {
  const authClient = await AuthClient.create();

  const identity = await authClient.getIdentity();

  return Actor.createActor(idlFactory, {
    agent: new HttpAgent({
      identity,
    }),
    canisterId,
  });
};
