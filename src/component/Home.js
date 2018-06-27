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
      <p className="bg-info text-center" style={{ height: '50px', padding: '10px', fontSize: '20px' }}>首頁</p>
    );
  }
}

const mapStateToProps = state => (
  {
    inputStockId: state.items.inputStockId
  }
);

export default connect(mapStateToProps, actionCreators)(Home);