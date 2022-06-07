# IC1101 - USB stablecoin

## Local run
````
dfx start --clean --background
dfx canister create --all
dfx build
dfx deploy

npm i
npm start

// separetly need to install tokens (copy from the installation script)
// ./src/fake_btc/install.sh || ./src/mint_token/install.sh
// and past manually install script in the console with your principle
// do not forget to remove --netowrk ic mainnet flag.

````
## Update collateral price
Run
````
epxort CANISTER_ID=qoctq-giaaa-aaaaa-aaaea-cai
sh set_collateral_price.sh 40000
````
Output 
````
Canister qoctq-giaaa-aaaaa-aaaea-cai collateralPrice 40000
````
Run
````
epxort CANISTER_ID=qoctq-giaaa-aaaaa-aaaea-cai
sh set_collateral_price.sh
````
Output default price 30000
````
Canister qoctq-giaaa-aaaaa-aaaea-cai collateralPrice 30000 
````

### Commit marks:
- build
- chore
- ci
- docs
- feat
- fix
- perf
- refactor
- revert
- style
- test
