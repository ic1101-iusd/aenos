import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ProtocolError = { 'transferFromError' : null };
export type Result = { 'ok' : null } |
  { 'err' : ProtocolError };
export type SharedPosition = {};
export interface _SERVICE {
  'closePosition' : ActorMethod<[bigint], Result>,
  'createPosition' : ActorMethod<[bigint, bigint], Result>,
  'getAccountPositions' : ActorMethod<[Principal], Array<SharedPosition>>,
  'getCollateralPrice' : ActorMethod<[], bigint>,
  'getLastPositionId' : ActorMethod<[], bigint>,
  'getPosition' : ActorMethod<[bigint], [] | [SharedPosition]>,
  'getPositions' : ActorMethod<[bigint, bigint], Array<SharedPosition>>,
  'getTokenPrincipal' : ActorMethod<[], Principal>,
  'init' : ActorMethod<[string, string], undefined>,
  'liquidatePosition' : ActorMethod<[bigint], Result>,
  'setCollateralPrice' : ActorMethod<[bigint], undefined>,
  'updatePosition' : ActorMethod<[bigint, bigint, bigint], Result>,
}
