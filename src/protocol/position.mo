import Nat "mo:base/Nat";
import Float "mo:base/Float";
import Principal "mo:base/Principal";
module {
    public class Position(idInit: Nat, ownerInit: Principal, collateralAmountInit: Nat, stableAmountInit: Nat) {
        let id = idInit;
        let owner = ownerInit;
        var collateralAmount = collateralAmountInit;
        var stableAmount = stableAmountInit;
        var deleted = false;
        

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

        public func getLiqudationPrice(collateralPrice: Float, liqudationThreshold: Float) : Float {
            let floatCollateral = Float.fromInt(collateralAmount);
            let floatStable = Float.fromInt(stableAmount);
            0
        };
    };

}
