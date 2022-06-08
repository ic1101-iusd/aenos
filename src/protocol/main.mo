import Cycles "mo:base/ExperimentalCycles";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Array "mo:base/Array";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Prim "mo:prim";
import P "./position";
import Error "mo:base/Error";
import Result "mo:base/Result";

actor Minter {
  // FOR DIP20 INTERFACE
  type TxReceipt = {
      #Ok: Nat;
      #Err: {
          #InsufficientAllowance;
          #InsufficientBalance;
          #ErrorOperationStyle;
          #Unauthorized;
          #LedgerTrap;
          #ErrorTo;
          #Other: Text;
          #BlockUsed;
          #AmountTooSmall;
      };
  };
  type DIP20 = actor {
    init(): async ();
    transferFrom(from: Principal, to: Principal, value: Nat): async TxReceipt;
    transfer(to: Principal, value: Nat): async TxReceipt;
    mint(to: Principal, value: Nat): async TxReceipt;
    burn(amount: Nat): async TxReceipt;
  };

  public type ProtocolError = { #transferFromError; };
  
  var collateralActor: ?DIP20 = null;
  var usbActor: ?DIP20 = null;
  var lastPositionId : Nat = 0;
  var collateralPrice = 0;
  let priceDecimals = 8;
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

  public func init(collateralActorText: Text, usbActorText: Text): async () {
    // Do not allow to call init more then once
    assert Option.isNull(collateralActor);
    assert Option.isNull(usbActor);
    
    collateralActor := ?(actor(collateralActorText));
    usbActor := ?(actor(usbActorText));
    // Take ownership over usb token
    let _ = do ? {
      await usbActor!.init();
    };
  };

  public query func getTokenPrincipal(): async Principal {
    switch (usbActor) {
      case null {
        throw Error.reject("Contract is not initialized.");
      };
      case (?usbActor) {
       Principal.fromActor(usbActor)
      }
    };
  };

  public func setCollateralPrice(newPrice: Nat): async () {
    collateralPrice := newPrice;
  };

  public query func getCollateralPrice() : async Nat {
      collateralPrice
  };

  public query func getPosition(id: Nat): async ?P.SharedPosition {
    switch(positionMap.get(id)) {
      case null {
        null
      };
      case (?position) {
        ?(P.SharedPosition(position))
      }
    }
  };

  public shared(msg) func createPosition(collateralAmount: Nat, stableAmount: Nat) : async Result.Result<(), ProtocolError> {
    // Check if stable is overcollaterized enough
    assert stableAmount * (100 + minRisk) / 100 <= collateralAmount * collateralPrice / (10**priceDecimals);
    let newPosition: P.Position = P.Position(lastPositionId, msg.caller, collateralAmount, stableAmount);
    
    switch (collateralActor) {
      case null {
        throw Error.reject("Conister hasn't been initialized.");
      };
      case (?collateralActor) {
        lastPositionId += 1;
        let result = await collateralActor.transferFrom(msg.caller, Principal.fromActor(Minter), collateralAmount);
        switch(result) {
          case (#Err(_)) { throw Error.reject("Could not execute transfer from."); };
          case (#Ok(_)) {};
        };
      };
    };
    positionMap.put(newPosition.getId(), newPosition);
     // Just need to assign it for some reason =/
    let _ = do ? {
      usbActor!.mint(msg.caller, stableAmount)
    };
    #ok(())
  };

  public shared(msg) func closePosition(id: Nat) : async Result.Result<(), ProtocolError> {
    let position = switch(positionMap.get(id)) {
      case null {
        throw Error.reject("No position found."); 
      };
      case (?position) {
        position
      };
    };
    if (position.deleted) {
      throw Error.reject("The position already closed or closing."); 
    };
    position.deleted := true;
    let _ = do ? {
      let res = await usbActor!.transferFrom(msg.caller, Principal.fromActor(Minter), position.stableAmount);
      switch(res) {
        case (#Err(_)) { 
          position.deleted := false;
          return #err(#transferFromError);
        };
        case (#Ok(_)) {};
      };

      let _ = usbActor!.burn(position.stableAmount);
      collateralActor!.transfer(msg.caller, position.collateralAmount);
    };
    #ok(())
  };


};
