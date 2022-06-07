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

#### By defaul it runs in main
Switch to test
````
export ICP_NETWORK='LOCAL'
````
Switch to Main 
````
unset ICP_NETWORK
````
Export your canister or override default in script
````
epxort CANISTER_ID=qoctq-giaaa-aaaaa-aaaea-cai 
````
Set price 40000
````
sh set_collateral_price.sh 40000
````
Or use default price 30000
````
sh set_collateral_price.sh
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
