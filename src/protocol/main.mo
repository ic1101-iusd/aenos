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

  public query func getLastPositionId() : async Nat {
      lastPositionId
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

  public query func getPositions(limit: Nat, offset: Nat): async [P.SharedPosition] {
    if(offset > lastPositionId) {
        throw Error.reject("Wrong offset");
    };
    var start: Nat = offset;
    var end: Nat = offset+limit;
    if(end > lastPositionId) {
       end := lastPositionId;
    };
    if(limit > 200) {
       end := offset + 200;
    };
    let positionsBuff : B.Buffer<P.SharedPosition> = B.Buffer(limit);
    for(i in Iter.range(start, end)) {
        switch(positionMap.get(i)) {
          case null {
            throw Error.reject("No position found");
          };
          case (?position) {
            positionsBuff.add(P.SharedPosition(position));
          };
        };
    };
    positionsBuff.toArray();
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
    let p = switch(positionMap.get(id)) {
      case null {
        throw Error.reject("No position found."); 
      };
      case (?position) {
        position
      };
    };
    if (p.deleted) {
      throw Error.reject("The position already closed or closing."); 
    };
    if (p.owner != msg.caller) {
      throw Error.reject("It is not your position."); 
    };

    await processClosePosition(p, msg.caller)
  };


  // There is some copy-past because motoko has strage await behaivior for inner calls.
  // TODO make code style research
  public shared(msg) func liquidatePosition(id: Nat) : async Result.Result<(), ProtocolError> {
    let p = switch(positionMap.get(id)) {
      case null {
        throw Error.reject("No position found."); 
      };
      case (?position) {
        position
      };
    };
    if (p.deleted) {
      throw Error.reject("The position already closed or closing."); 
    };
    if (p.stableAmount * (100 + minRisk) / 100 <= p.collateralAmount * collateralPrice / (10**priceDecimals)) {
      throw Error.reject("Position is fine, no liquidation required."); 
    };

    await processClosePosition(p, msg.caller)
  };

  // This function make call more expensive and longer
  // But for now readability is more important
  private func processClosePosition(p: P.Position, caller: Principal) : async Result.Result<(), ProtocolError> {
    p.deleted := true;
    positionMap.put(p.id, p);
    let _ = do ? {
      let res = await usbActor!.transferFrom(caller, Principal.fromActor(Minter), p.stableAmount);
      switch(res) {
        case (#Err(_)) { 
          p.deleted := false;
          positionMap.put(p.id, p);
          return #err(#transferFromError);
        };
        case (#Ok(_)) {};
      };

      let _ = usbActor!.burn(p.stableAmount);
      collateralActor!.transfer(caller, p.collateralAmount);
    };
    #ok(())
  };


};
