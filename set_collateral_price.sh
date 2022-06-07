#!/usr/bin/env bash
CANISTER_ID=${CANISTER_ID:="qoctq-giaaa-aaaaa-aaaea-cai"} #pass default contract
CollateralPrice=0

if [[ -n "$1" ]]
then
    CollateralPrice=$1
else
    CollateralPrice=30000 #default value
fi

echo ">>>> Params : Canister $CANISTER_ID CollateralPrice $CollateralPrice"
if [ "$ICP_NETWORK" == "LOCAL" ];
then
    echo ">>>> NETWORK: LOCAL"
    dfx canister call $CANISTER_ID setCollateralPrice "($CollateralPrice)"
else
    echo ">>>> NETWORK: IC"
    dfx canister --network ic call $CANISTER_ID  setCollateralPrice "($CollateralPrice)"
fi

