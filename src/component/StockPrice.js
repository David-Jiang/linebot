import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class StockPrice extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { inputStockPrice, sumStockPrice, selectedDiscount, inputStockAmount, changeStockPrice, calculate, changeDiscount, changeStockAmount, reset } = this.props;
    let selectedList = [{ value: 0.65, label: '65折' }, { value: 0.3, label: '3折' }, { value: 0.28, label: '28折' }];
    let formCss = { width: '30%', display: 'block', marginRight: 'auto', marginLeft: 'auto' };
    let inputStockPriceRef = null;
    let inputStockAmountRef = null;
    return (
      <div>
        <p className="bg-info text-center" style={{ height: '50px', padding: '10px', fontSize: '20px' }}>股票手續費計算</p>
        <div className="form-group" style={formCss}>
          <label>個股成交價:</label>
          <input type="text" className="form-control"
            onChange={changeStockPrice}
            value={inputStockPrice}
            ref={(ref) => (inputStockPriceRef = ref)}
            placeholder="請輸入個股成交價" />
        </div>
        <div className="form-group" style={formCss}>
          <label>個股張數(1張為1000股):</label>
          <input type="text" className="form-control"
            onChange={changeStockAmount}
            value={inputStockAmount}
            ref={(ref) => (inputStockAmountRef = ref)}
            placeholder="請輸入個股張數" />
        </div>
        <div className="form-group" style={{ ...formCss, marginTop: '5px' }}>
          <label>手續費折扣:</label>
          <Select onChange={changeDiscount} options={selectedList} value={selectedDiscount}
            placeholder="請選擇手續費折扣" />
        </div>


        <div className="text-center">
          <button type="button" className="btn btn-info" style={{ margin: '5px' }}
            onClick={() => calculate(inputStockPrice, selectedDiscount, inputStockAmount, false, inputStockPriceRef, inputStockAmountRef)}>一般計算</button>
          <button type="button" className="btn btn-success" style={{ margin: '5px' }}
            onClick={() => calculate(inputStockPrice, selectedDiscount, inputStockAmount, true, inputStockPriceRef, inputStockAmountRef)}>當沖計算</button>
          <button type="button" className="btn btn-danger" style={{ margin: '5px' }}
            onClick={() => reset()}>重新計算</button>
        </div>
        <br />
        <div className="col-md-3 col-md-offset-4" style={{ fontSize: '16px' }}>
          計算金額為:
          <span style={{ marginLeft: '20px' }}>{sumStockPrice}</span>
        </div>

      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    inputStockPrice: state.items.inputStockPrice,
    sumStockPrice: state.items.sumStockPrice,
    selectedDiscount: state.items.selectedDiscount,
    inputStockAmount: state.items.inputStockAmount
  }
);

export default connect(mapStateToProps, actionCreators)(StockPrice);