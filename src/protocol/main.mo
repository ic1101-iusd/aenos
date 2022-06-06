import UsbToken "canister:usbtoken";
// import FakeBTC "canister:fake_btc";
import Cycles "mo:base/ExperimentalCycles";
import Nat "mo:base/Nat";
import RBTree "mo:base/RBTree";
import Array "mo:base/Array";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Prim "mo:prim";
import P "./position";
import Error "mo:base/Error";


actor Minter {
  var tokenPrincipal: ?Principal = null;
  var tokenActor: ?UsbToken = null;
  var lastPositionId : Nat = 0;
  var collateralPrice = 0;
  var minRisk = 15;
  let positionsIdSet = RBTree<Nat,()>(comparePositions);
  let positionMap = HashMap<Nat, P.Position>(
    0,
    Nat.equal,
    func(x)   { Prim.natToWord32 x }
  );
  let accountPositions = HashMap<Principal, Array<Nat>>(
    0,
    Principal.equal,
    Principal.hash
  );

  public shared({ caller }) func init(): async Principal {
    // Do not allow to call init more then once
    assert tokenActor.isNull();
    Cycles.add(1_000_000_000_000);

    tokenActor := await UsbToken("", "Decentralized USD", "USB", 18, 0, 100);
    switch (tokenActor) {
      case null {
        throw Error.reject("init error");
      };
      case (?tokenActor) {
        return Principal.fromActor(tokenActor);
      };
    };
  };

  public func getTokenPrincipal(): async Principal {
    switch (tokenActor) {
      case null {
        throw Error.reject("Contract is not initialized.");
      };
      case (?tokenActor) {
        return Principal.fromActor(tokenActor);
      };
    };
  };

  /// Order position in TreeSet from more risky to less
  func comparePositions(x : Nat, y : Nat) : { #less; #equal; #greater } {
    let xp = positionMap.get(x).unwrap();
    let yp = positionMap.get(y).unwrap();
    if (xp.getRatio() < yp.getRatio()) { #less }
    else if (xp.getRatio() == yp.getRatio()) { #equal }
    else { #greater }
  };

  public func setCollateralPrice(newPrice: Nat) : async Bool {
    collateralPrice := newPrice;
  };

  public query func getCollateralPrice() : async Nat {
      collateralPrice
  };

  public func createPosition(collateralAmount: Nat, stableAmount: Nat) : async () {
    // Check if stable is overcollaterized enough
    assert stableAmount * (100 + minRisk) / 100 <= collateralAmount * collateralPrice;
    let newPosition = P.Position(lastPositionId, msg.caller, collateralAmount, stableAmount);
    
    switch (tokenActor) {
      case null {
        throw Error.reject("Conister hasn't been initialized.");
      };
      case (?tokenActor) {
        lastPositionId += 1;
        // Wait for OK condtion
        // assert await tokenActor.transferFrom(msg.caller, Principal.fromActor(this), stableAmount) == #Ok;
      };
    };
    positionMap.put(lastPositionId, newPosition);
    positionsIdSet.put(lastPositionId, ());
  };





};
