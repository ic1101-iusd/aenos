#!/usr/bin/env bash
CANISTER_ID=${CANISTER_ID:="qoctq-giaaa-aaaaa-aaaea-cai"} #pass default contract
collateralPrice=0
if [[ -n "$1" ]]
then
    collateralPrice=$1
else
    collateralPrice=30000 #default value
fi
echo "Canister $CANISTER_ID collateralPrice $collateralPrice"
dfx canister call $CANISTER_ID setcollateralPrice $collateralPrice
