export const idlFactory = ({ IDL }) => {
  const ProtocolError = IDL.Variant({ 'transferFromError' : IDL.Null });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : ProtocolError });
  const SharedPosition = IDL.Record({});
  return IDL.Service({
    'closePosition' : IDL.Func([IDL.Nat], [Result], []),
    'createPosition' : IDL.Func([IDL.Nat, IDL.Nat], [Result], []),
    'getCollateralPrice' : IDL.Func([], [IDL.Nat], ['query']),
    'getPosition' : IDL.Func([IDL.Nat], [IDL.Opt(SharedPosition)], ['query']),
    'getTokenPrincipal' : IDL.Func([], [IDL.Principal], ['query']),
    'init' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'liquidatePosition' : IDL.Func([IDL.Nat], [Result], []),
    'setCollateralPrice' : IDL.Func([IDL.Nat], [], []),
    'updatePosition' : IDL.Func([IDL.Nat, IDL.Nat, IDL.Nat], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
