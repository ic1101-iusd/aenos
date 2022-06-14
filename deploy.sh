#!/bin/bash

set -e 

case $1 in
  ic)
    NETWORK="--network ic"
    ;;
  local)
    NETWORK=''
    ;;
  *)
    echo "Please specify network."
    exit 0
    ;;
esac

dfx build $NETWORK
echo "Building finished."
SELF_PRINCIPAL=$(dfx identity get-principal)
MINT_TOKEN_PRINCIPAL=$(dfx canister $NETWORK info mint_token| head -n 1 | awk -F ' ' '{print $2}')
BTC_TOKEN_PRINCIPAL=$(dfx canister $NETWORK info fake_btc| head -n 1 | awk -F ' ' '{print $2}')
PROTOCOL_PRINCIPAL=$(dfx canister $NETWORK info protocol| head -n 1 | awk -F ' ' '{print $2}')
MINT_TOKEN_LOGO=$(<deploy_data/usb_logo)
BTC_TOKEN_LOGO=$(<deploy_data/fake_btc_logo)
echo "Variables set."

echo yes | dfx canister $NETWORK install mint_token --argument="(\"$MINT_TOKEN_LOGO\", \"Autonomous Internet Stable\", \"AIS\", 8, 0, principal \"$PROTOCOL_PRINCIPAL\", 0)" --mode=reinstall
echo yes | dfx canister $NETWORK install fake_btc --argument="(\"$BTC_TOKEN_LOGO\", \"Fake BTC\", \"FBTC\", 8, 2100000000000000, principal \"$SELF_PRINCIPAL\", 0)" --mode=reinstall
echo yes | dfx canister $NETWORK install protocol --argument="(\"$BTC_TOKEN_PRINCIPAL\", \"$MINT_TOKEN_PRINCIPAL\")" --mode=reinstall