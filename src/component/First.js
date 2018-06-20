import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action';

import Second from '../component/Second';

class First extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { data } = this.props;
    return (
      <div>
        <Second data={data} />
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    data: state.items.data
  }
);

export default connect(mapStateToProps, actionCreators)(First);