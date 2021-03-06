import Cycles "mo:base/ExperimentalCycles";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Prim "mo:prim";
import P "./position";
import B "mo:base/Buffer";
import Error "mo:base/Error";
import Result "mo:base/Result";

actor class Minter(collateralActorText: Text, usbActorText: Text) = this {
  // FOR DIP20 INTERFACE
  type DIP20ErrList = {
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
  type TxReceipt = {
      #Ok: Nat;
      #Err: DIP20ErrList;
  };
  type DIP20 = actor {
    init(): async ();
    transferFrom(from: Principal, to: Principal, value: Nat): async TxReceipt;
    transfer(to: Principal, value: Nat): async TxReceipt;
    mint(to: Principal, value: Nat): async TxReceipt;
    burn(amount: Nat): async TxReceipt;
  };

  func err2text(error: DIP20ErrList): Text {
    switch(error) {
      case(#InsufficientAllowance) {"InsufficientAllowance"};
      case(#InsufficientBalance) {"InsufficientBalance"};
      case(#ErrorOperationStyle) {"ErrorOperationStyle"};
      case(#Unauthorized) {"Unauthorized"};
      case(#LedgerTrap) {"LedgerTrap"};
      case(#ErrorTo) {"ErrorTo"};
      case(#BlockUsed) {"BlockUsed"};
      case(#AmountTooSmall) {"AmountTooSmall"};
      case(#Other(text)) {"Other: "# text};
    }
  };

  public type ProtocolError = { #transferFromError: DIP20ErrList; };
  
  var collateralActor: DIP20 = actor(collateralActorText);
  var usbActor: DIP20 = actor(usbActorText);
  var lastPositionId : Nat = 0;
  var collateralPrice = 0;
  let priceDecimals = 8;
  var minRisk = 15;
  let positionMap = HashMap.HashMap<Nat, P.Position>(
    0,
    Nat.equal,
    func(x)   { Prim.natToNat32 x }
  );
  let accountPositions = HashMap.HashMap<Principal, B.Buffer<Nat>>(
    0,
    Principal.equal,
    Principal.hash
  );

  public query func getTokenPrincipal(): async Principal {
    Principal.fromActor(usbActor)
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
        ?(position.toShared())
      }
    }
  };

  public query func getPositions(limit: Nat, offset: Nat): async [P.SharedPosition] {
    if(offset > lastPositionId) {
        throw Error.reject("Wrong offset");
    };

    var localLimit = limit;
    let start = offset;
    var end = offset + localLimit;

    if (localLimit > 200) {
      localLimit := 200;
    };
    if (end > lastPositionId) {
      localLimit := lastPositionId - offset;
      end := lastPositionId;
    };

    let positionsBuffer = B.Buffer<P.SharedPosition>(localLimit);
    for(i in Iter.range(start, end)) {
       switch(positionMap.get(i)) {
          case (?position) {
            positionsBuffer.add(position.toShared());
          };
          case null {};
       };
    };
    positionsBuffer.toArray()
  };

  public query func getAccountPositions(account: Principal): async [P.SharedPosition] {
    let idsBuffer = switch(accountPositions.get(account)) {
      case null {
        return [];
      };
      case (?ids) {
        ids
      };
    };
    let positionsBuffer = B.Buffer<P.SharedPosition>(idsBuffer.size());
    for (pid in idsBuffer.vals()) {
      switch(positionMap.get(pid)) {
          case (?position) {
            positionsBuffer.add(position.toShared());
          };
          case null {
            throw Error.reject("WTF? Some position not found.");
          };
       };
    };
    positionsBuffer.toArray()
  };

  public shared(msg) func createPosition(collateralAmount: Nat, stableAmount: Nat) : async Result.Result<P.SharedPosition, ProtocolError> {
    // Check if stable is overcollaterized enough
    if (stableAmount * (100 + minRisk) / (100 * 10**priceDecimals) > collateralAmount * collateralPrice / (10**priceDecimals)) {
      throw Error.reject("Position should be overcollaterized."); 
    };

    let newPosition: P.Position = P.Position(lastPositionId, msg.caller, collateralAmount, stableAmount);
    lastPositionId += 1;
    let result = await collateralActor.transferFrom(msg.caller, Principal.fromActor(this), collateralAmount);
    switch(result) {
      case (#Err(error)) { throw Error.reject("Could not execute transfer from: " # err2text(error)); };
      case (#Ok(_)) {};
    };

    positionMap.put(newPosition.getId(), newPosition);
    let accountBuffer = switch(accountPositions.get(msg.caller)) {
      case null {
        B.Buffer<Nat>(1)
      };
      case (?accountBuffer) {
        accountBuffer
      };
    };
    accountBuffer.add(newPosition.getId());
    accountPositions.put(msg.caller, accountBuffer);
     // Just need to assign it for some reason =/
    let _ = usbActor.mint(msg.caller, stableAmount);
    #ok(newPosition.toShared())
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
    if (p.updating) {
      throw Error.reject("The position is being updated."); 
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
    if (p.updating) {
      throw Error.reject("The position is being updated."); 
    };
    if (p.stableAmount * (100 + minRisk) / 100 <= p.collateralAmount * collateralPrice / (10**priceDecimals)) {
      throw Error.reject("Position is fine, no liquidation required."); 
    };
    let result = await processClosePosition(p, msg.caller);
    if (Result.isOk(result)) {
      p.liquidated := true;
      p.deleted := true;
      positionMap.put(id, p);
    };
    result
  };

  // This function make call more expensive and longer
  // But for now readability is more important
  private func processClosePosition(p: P.Position, caller: Principal) : async Result.Result<(), ProtocolError> {
    p.deleted := true;
    positionMap.put(p.id, p);
    let res = await usbActor.transferFrom(caller, Principal.fromActor(this), p.stableAmount);
    switch(res) {
      case (#Err(error)) { 
        p.deleted := false;
        positionMap.put(p.id, p);
        return #err(#transferFromError(error));
      };
      case (#Ok(_)) {};
    };

    let _ = usbActor.burn(p.stableAmount);
    let _ = collateralActor.transfer(caller, p.collateralAmount);
    #ok(())
  };

  public shared(msg) func updatePosition(id: Nat, newCollateralAmount: Nat, newStableAmount: Nat) : async Result.Result<P.SharedPosition, ProtocolError> {
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
    if (newStableAmount * (100 + minRisk) / (100 * 10**priceDecimals) > newCollateralAmount * collateralPrice / (10**priceDecimals)) {
      throw Error.reject("The position should be overcollaterized."); 
    };
    if (p.updating) {
      throw Error.reject("The position is being updated."); 
    };

    var newPosition = P.Position(
      p.id,
      p.owner,
      p.collateralAmount,
      p.stableAmount
    );
    // Setup updating flag
    newPosition.updating := true;
    positionMap.put(newPosition.id, newPosition);

    
    let self = Principal.fromActor(this);
    // Re-transfer token in secure way
    // Firstly transfer tokens from user if needed
    if (p.stableAmount > newStableAmount) {
      let stableDiff = p.stableAmount - newStableAmount;
      let result = await usbActor.transferFrom(msg.caller, self, stableDiff);
      switch(result) {
          case (#Err(error)) { 
            newPosition.updating := false;
            positionMap.put(newPosition.id, newPosition);
            return #err(#transferFromError(error));
          };
          case (#Ok(_)) {
            let _ = usbActor.burn(stableDiff);
            newPosition.stableAmount := newStableAmount;
            positionMap.put(newPosition.id, newPosition);
          };
        };
    };
    if (p.collateralAmount < newCollateralAmount) {
      let result = await collateralActor.transferFrom(msg.caller, self, newCollateralAmount - p.collateralAmount);
      switch(result) {
          case (#Err(error)) { 
            newPosition.updating := false;
            positionMap.put(newPosition.id, newPosition);
            return #err(#transferFromError(error));
          };
          case (#Ok(_)) {
            newPosition.collateralAmount := newCollateralAmount;
          };
        };
    };

    // Secondly send tokens to user if needed
    // No await required, consider these calls coudn't fail
    if (p.stableAmount < newStableAmount) {
      let _ = usbActor.mint(msg.caller, newStableAmount - p.stableAmount);
      newPosition.stableAmount := newStableAmount;
    };
    if (p.collateralAmount > newCollateralAmount) {
      let _ = collateralActor.transfer(msg.caller, p.collateralAmount - newCollateralAmount);
      newPosition.collateralAmount := newCollateralAmount;
    };
    newPosition.updating := false;
    positionMap.put(newPosition.id, newPosition);
    #ok(newPosition.toShared())
  };
};
