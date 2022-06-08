import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type SharedPosition = {};
export interface _SERVICE {
  'createPosition' : ActorMethod<[bigint, bigint], undefined>,
  'getCollateralPrice' : ActorMethod<[], bigint>,
  'getPosition' : ActorMethod<[bigint], [] | [SharedPosition]>,
  'getTokenPrincipal' : ActorMethod<[], Principal>,
  'init' : ActorMethod<[string, string], undefined>,
  'setCollateralPrice' : ActorMethod<[bigint], undefined>,
}
