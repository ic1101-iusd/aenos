import canisterIcIds from '../../../../canister_ids.json';
import localCanisters from '../../../../.dfx/local/canister_ids.json';

const isDevelopment = process.env.NODE_ENV === 'development';

const HOST = isDevelopment ? 'http://127.0.0.1:8000' : 'https://mainnet.dfinity.network';
const INTERNET_IDENTITY_PROVIDER = isDevelopment ? `http://localhost:8000/?canisterId=${localCanisters.internet_identity.local}` : 'https://identity.ic0.app';

export default {
  canisterIdVault: isDevelopment ? process.env.PROTOCOL_CANISTER_ID : canisterIcIds.protocol.ic,
  canisterIdUsbFt: isDevelopment ? process.env.MINT_TOKEN_CANISTER_ID : canisterIcIds.mint_token.ic,
  canisterIdBtcFt: isDevelopment ? process.env.FAKE_BTC_CANISTER_ID : canisterIcIds.fake_btc.ic,
  iiProvider: INTERNET_IDENTITY_PROVIDER,
  isDevelopment,
  HOST,
  SERVER_HOST: 'https://icp-liquidator.herokuapp.com',
  GOOGLE_ANALYTICS_TRACKING_CODE: 'G-ZJ3K1RZZXS',
};
