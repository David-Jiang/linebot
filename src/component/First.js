import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action';

const First = ({ number, increase, decrease }) => {
  return (
    <div>
      Some state changes:  {number}
      <br />
      <button onClick={() => increase(1)}>Increase</button>
      <button onClick={() => decrease(1)}>Decrease</button>
    </div>
  );
};

const mapStateToProps = store => (
  { number: store.items }
);

export default connect(mapStateToProps, actionCreators)(First);