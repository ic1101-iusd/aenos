export default {
  canisterIdSelf: process.env.CANISTER_ID_SELF,
  canisterIdVault: process.env.CANISTER_ID_VAULT,
  canisterIdUsbFt: process.env.CANISTER_ID_USB_FT,
  canisterIdBtcFt: process.env.CANISTER_ID_BTC_FT,

  host: `https://${process.env.CANISTER_ID_SELF}.ic0.app`,
};