import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action';

class StockList extends React.Component {
  constructor(props) {
    super(props);
  }

  connectURL(e, url) {
    e.preventDefault();
    window.open(url);
  }

  render() {
    let { inputStockId, stockList, insertToList, changeStockId } = this.props;
    let inputStockIdRef = null;
    return (
      <div>
        <p className="bg-info text-center" style={{ height: '50px', padding: '10px', fontSize: '20px' }}>股票清單</p>
        <div className="form-group col-md-4 col-md-offset-4 col-sm-10 col-sm-offset-1">
          <label>股票代號:</label>
          <input type="text" className="form-control"
            onChange={(e) => changeStockId(e)}
            value={inputStockId}
            ref={(ref) => (inputStockIdRef = ref)}
            placeholder="請輸入股票代號" />
        </div>
        <div className="text-center col-md-4 col-md-offset-4 col-sm-10 col-sm-offset-1">
          <button type="button" className="btn btn-info"
            onClick={() => insertToList(inputStockId, inputStockIdRef)}>新增至清單</button>
        </div>
        <div className="clearfix"></div>
        {stockList.length > 0 &&
          <div className="col-md-4 col-md-offset-4 col-sm-12" style={{ marginTop: '20px' }}>
            <table className="table table-striped">
              <tbody>
                {stockList.map(stockVO => (
                  <tr key={stockVO.stockId}>
                    <td style={{ width: '30%' }}>
                      {stockVO.stockName + '  (' + stockVO.stockId + ')'}
                    </td>
                    <td>
                      <a href="#" onClick={(e) => this.connectURL(e, stockVO.news)}>{stockVO.news}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div >
    );
  }
}

const mapStateToProps = state => (
  {
    inputStockId: state.items.inputStockId,
    stockList: state.items.stockList
  }
);

export default connect(mapStateToProps, actionCreators)(StockList);
