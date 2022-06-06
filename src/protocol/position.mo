import Nat "mo:base/Nat";
import Float "mo:base/Float";
import Principal "mo:base/Principal";

module {
    class Position(idInit: Nat, ownerInit: Principal, collateralAmountInit: Nat, stableAmountInit: Nat) {
        let id = idInit;
        var collateralAmount = collateralAmountInit;
        var stableAmount = stableAmountInit;
        let owner = ownerInit;

        public func setCollateral(newAmount: Nat) {
            collateralAmount := newAmount;
        };

        public func setStableMinted(newAmount: Nat) {
            stableAmount := newAmount;
        };

        public func getRatio() : Float {
            Float.fromInt(collateralAmount) / Float.fromInt(stableAmount)
        };

        public func getLiqudationPrice(collateralPrice: Float, liqudationThreshold: Float) : Float {
            let floatCollateral = Float.fromInt(collateralAmount);
            let floatStable = Float.fromInt(stableAmount);
            0
        };
    };
}
