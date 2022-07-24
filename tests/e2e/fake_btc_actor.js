import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../src/declarations/fake_btc/fake_btc.did.js";
import fetch from "isomorphic-fetch";
const  canisterIds = require("../../.dfx/local/canister_ids.json");

export const createActor = async (canisterId, options) => {
  const agent = new HttpAgent({ ...options?.agentOptions });
  console.log("Before fetch")
  await agent.fetchRootKey();
  console.log("After fetch")

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options?.actorOptions,
  });
};
console.log(canisterIds);

export const btcCanister = canisterIds.fake_btc.local;

export const fake_btc = async () => {
  return createActor(btcCanister, {
    agentOptions: { host: "http://127.0.0.1:8000", fetch },
  });
}