import canisterIcIds from '../../../../canister_ids.json';

const isDevelopment = process.env.NODE_ENV === 'development';

const HOST = isDevelopment ? 'http://127.0.0.1:8000' : 'https://mainnet.dfinity.network';

export default {
  canisterIdVault: isDevelopment ? process.env.PROTOCOL_CANISTER_ID : canisterIcIds.protocol.ic,
  canisterIdUsbFt: isDevelopment ? process.env.MINT_TOKEN_CANISTER_ID : canisterIcIds.mint_token.ic,
  canisterIdBtcFt: isDevelopment ? process.env.FAKE_BTC_CANISTER_ID : canisterIcIds.fake_btc.ic,
  isDevelopment,
  HOST,
  SERVER_HOST: 'https://icp-liquidator.herokuapp.com',
};
