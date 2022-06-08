export const idlFactory = ({ IDL }) => {
  const SharedPosition = IDL.Record({});
  return IDL.Service({
    'createPosition' : IDL.Func([IDL.Nat, IDL.Nat], [], []),
    'getCollateralPrice' : IDL.Func([], [IDL.Nat], ['query']),
    'getPosition' : IDL.Func([IDL.Nat], [IDL.Opt(SharedPosition)], ['query']),
    'getTokenPrincipal' : IDL.Func([], [IDL.Principal], ['query']),
    'init' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'setCollateralPrice' : IDL.Func([IDL.Nat], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
