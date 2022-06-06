import Token "../mint_token/token";
// import FakeBTC "canister:fake_btc";
import Cycles "mo:base/ExperimentalCycles";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Array "mo:base/Array";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Prim "mo:prim";
import P "./position";
import Error "mo:base/Error";

actor Minter {
  
  var tokenPrincipal: ?Principal = null;
  var lastPositionId : Nat = 0;
  var collateralPrice = 0;
  var minRisk = 15;
  let positionMap = HashMap.HashMap<Nat, P.Position>(
    0,
    Nat.equal,
    func(x)   { Prim.natToNat32 x }
  );
  let accountPositions = HashMap.HashMap<Principal, [Nat]>(
    0,
    Principal.equal,
    Principal.hash
  );

  public shared({ caller }) func init(): async Principal {
    // Do not allow to call init more then once
    assert Option.isNull(tokenPrincipal);
    Cycles.add(1_000_000_000_000);

    let tokenActor = await Token.UsbToken("", "Decentralized USD", "USB", 18, 0, 100);
    let tp = Principal.fromActor(tokenActor);
    tokenPrincipal := ?(tp);
    return tp;
  };

  public func getTokenPrincipal(): async Principal {
    switch (tokenPrincipal) {
      case null {
        throw Error.reject("Contract is not initialized.");
      };
      case (?tokenPrincipal) {
        return tokenPrincipal;
      };
    };
  };

  public func setCollateralPrice(newPrice: Nat): async () {
    collateralPrice := newPrice;
  };

  public query func getCollateralPrice() : async Nat {
      collateralPrice
  };

  public shared(msg) func createPosition(collateralAmount: Nat, stableAmount: Nat) : async () {
    // Check if stable is overcollaterized enough
    assert stableAmount * (100 + minRisk) / 100 <= collateralAmount * collateralPrice;
    let newPosition: P.Position = P.Position(lastPositionId, msg.caller, collateralAmount, stableAmount);
    
    switch (tokenPrincipal) {
      case null {
        throw Error.reject("Conister hasn't been initialized.");
      };
      case (?tokenPrincipal) {
        lastPositionId += 1;
        let tokenActor: Token.UsbToken = actor(Principal.toText(tokenPrincipal));
        // Wait for OK condtion
        let smth = await tokenActor.transferFrom(msg.caller, Principal.fromActor(Minter), stableAmount);
        switch(smth) {
          case (#Err(_)) { throw Error.reject("Could not execute transfer from."); };
          case (#Ok(_)) {};
        };
      };
    };
    positionMap.put(lastPositionId, newPosition);
  };





};
