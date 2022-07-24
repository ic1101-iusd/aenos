
import { expect } from 'chai';
import { Principal } from '@dfinity/principal';
import { Actor, HttpAgent, ActorConfig, HttpAgentOptions} from "@dfinity/agent";


import { fake_btc } from './e2e/fake_btc_actor.js';

describe('calculate', async function() {
    // this.beforeEach(async ()=> {
    //     // console.log(HttpAgentOptions.)
    //     console.log(Principal.fromText('d6nda-4sgaf-7zrvn-n4jnb-cq6jc-yuq2s-kfedq-rw5jb-5b4d4-b27p3-7qe'))
    //     console.log(createActor)
    // })
    it('add', async function() {
      const btc = await fake_btc();
      const balance = await btc.balanceOf(Principal.fromText('d6nda-4sgaf-7zrvn-n4jnb-cq6jc-yuq2s-kfedq-rw5jb-5b4d4-b27p3-7qe'))
      console.log(balance);
    }); 
  });