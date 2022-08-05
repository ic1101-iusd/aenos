import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';

import config from 'Constants/config';
import logger from 'Utils/logger';

// 7 days in nanoseconds
const TIME_TO_LIVE = BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000);

class InternetIdentity {
  authClient = null;
  agent = null;
  identity = null;

  constructor() {
    this._auth();
  }

  // auth with anon identity
  async _auth() {
    this.authClient = await AuthClient.create();

    this.identity = await this.authClient.getIdentity();

    this.agent = new HttpAgent({
      identity: this.identity,
    });

    if (config.isDevelopment) {
      await this.agent.fetchRootKey().catch(err => {
        logger.warn("Unable to fetch root key. Check to ensure that your local replica is running");
        logger.error(err);
      });
    }

    return this.identity.getPrincipal();
  };

  // replace identity after login
  async _replaceIdentity() {
    this.identity = await this.authClient.getIdentity();

    this.agent.replaceIdentity(this.identity);
  };

  async connect() {
    return new Promise((resolve, reject) => {
      this.authClient.login({
        identityProvider: config.iiProvider,
        maxTimeToLive: TIME_TO_LIVE,
        onSuccess: async () => {
          await this._replaceIdentity();

          const principal = this.identity.getPrincipal();

          logger.log('InternetIdentity: login success', principal.toString());

          resolve(principal);
        },
        onError: (err) => {
          logger.error(err);
          reject(err);
        }
      });
    })
  };

  disconnect() {
    this.authClient.logout();
  };

  async getPrincipal() {
    const isAuthenticated = await this.authClient.isAuthenticated();

    if (!isAuthenticated) return null;

    await this._replaceIdentity();

    return this.identity.getPrincipal();
  };

  async createActor(idlFactory, canisterId) {
    return Actor.createActor(idlFactory, {
      agent: this.agent,
      canisterId,
    });
  };
}

export default new InternetIdentity();
