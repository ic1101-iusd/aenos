import Nat "mo:base/Nat";
import Float "mo:base/Float";
import Principal "mo:base/Principal";
module {
    public type SharedPosition = {
        id : Nat;
        owner : Principal;
        collateralAmount : Nat;
        stableAmount : Nat;
        deleted : Bool;
        updating : Bool;
        liquidated : Bool;
    };

    public class Position(idInit: Nat, ownerInit: Principal, collateralAmountInit: Nat, stableAmountInit: Nat) {
        public let id = idInit;
        public let owner = ownerInit;
        public var collateralAmount = collateralAmountInit;
        public var stableAmount = stableAmountInit;
        public var deleted = false;
        public var updating = false;
        public var liquidated = false;
        
        public func getId(): Nat {
            id
        };

        public func setCollateral(newAmount: Nat) {
            collateralAmount := newAmount;
        };

        public func setStableMinted(newAmount: Nat) {
            stableAmount := newAmount;
        };

        public func delete() {
            deleted := true;
        };

        public func getRatio() : Float {
            Float.fromInt(collateralAmount) / Float.fromInt(stableAmount)
        };

        public func toShared() : SharedPosition {
            {
                id;
                owner;
                collateralAmount;
                stableAmount;
                deleted;
                updating;
                liquidated;
            }
        };

        public func getLiqudationPrice(collateralPrice: Float, liqudationThreshold: Float) : Float {
            let floatCollateral = Float.fromInt(collateralAmount);
            let floatStable = Float.fromInt(stableAmount);
            0
        };
    };

}
