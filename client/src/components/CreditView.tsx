import { connect } from "react-redux";
import { AssetClass } from "../models/assetClass";
import { RootState } from "../store/store";

interface PropsCreditView {
  assetClasses: AssetClass[];
}

function CreditView(props: PropsCreditView) {
  return (
    <div className="credit-view-container">
      <span>Credit</span>$
      {Math.abs(
        (props.assetClasses.filter((i) => i.name === "Credit")[0] || {})
          .totalValue
      )}
    </div>
  );
}

function mapStateToProps(state: RootState) {
  return { assetClasses: state.classReducer.assetClasses };
}

export default connect(mapStateToProps)(CreditView);
