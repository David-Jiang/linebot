import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { inputStockId } = this.props;
    return (
      <div>
        <p className="bg-info text-center" style={{ height: '50px', padding: '10px', fontSize: '20px' }}>首頁</p>
        <p className="text-center" style={{ fontSize: '16px' }}>我不知道要說什麼，我就是想打字</p>
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    inputStockId: state.items.inputStockId
  }
);

export default connect(mapStateToProps, actionCreators)(Home);