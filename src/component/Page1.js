import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action';

class Page1 extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { arr, inputValue, handleItemDel, handleTextChange, handleItemAdd } = this.props;
    return (
      <div>
        <div>
          <input type="text" className="form-control" onChange={handleTextChange} />
          <button type="button" className="btn btn-info" onClick={() => handleItemAdd(inputValue)}>新增項目</button>
        </div>
        <br />
        {
          arr.map(item => (
            <li key={item.id}>
              <input type="checkbox" id={item.id} onClick={() => handleItemDel(item.id)} />
              {item.text}
            </li>
          ))
        }
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    arr: state.items.arr,
    inputValue: state.items.text
  }
);

export default connect(mapStateToProps, actionCreators)(Page1);
