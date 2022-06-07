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
