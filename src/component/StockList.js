import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action';

import SecuritiesDetail from '../component/SecuritiesDetail';
import HistoryDetail from '../component/HistoryDetail';
import FinancingDetail from '../component/FinancingDetail';
import { getTWToday } from '../util/Util';

class StockList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let { getStockInfo } = this.props;
    getStockInfo();
  }

  connectURL(e, stockId) {
    e.preventDefault();
    window.open(`https://www.cmoney.tw/follow/channel/stock-${stockId}`);
  }

  changeColorByAmout(amt) {
    let amount = parseFloat(amt);
    if (amount > 0) {
      return 'red';
    } else if (amount == 0) {
      return 'black';
    } else {
      return 'green';
    }
  }

  calStockRange(stockVO) {
    let endPrice = stockVO.historyPriceList[0].endPrice;
    let startPrice = stockVO.historyPriceList[0].startPrice;
    let count = parseFloat(endPrice.replace(',', '')) - parseFloat(startPrice.replace(',', ''));
    return count.toFixed(2);
  }

  render() {
    let { inputStockId, stockList, data, detailType, insertToList, changeStockId, showDetail } = this.props;
    let inputStockIdRef = null;
    return (
      <div>
        <p className="bg-info text-center" style={{ height: '50px', padding: '10px', fontSize: '20px' }}>個股盤後資訊</p>
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
            onClick={() => insertToList(inputStockId, inputStockIdRef)}>新增股票</button>
        </div>
        <div className="clearfix"></div>
        {stockList.length > 0 &&
          <div className="col-md-4 col-md-offset-4 col-sm-12 col-xs-12" style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '16px' }}>
              <div className="pull-left">{'買賣日期: ' + stockList[0].securitiesTradeList[0].transactionDate}</div>
              <div className="pull-right">{'今日日期: ' + getTWToday()}</div>
              <div className="clearfix"></div>
            </div>
            <table className="table table-striped">
              <thead>
                <tr>
                  <td>股票代碼</td>
                  <td align="right">外資</td>
                  <td align="right">投信</td>
                  <td align="right">自營商</td>
                  <td align="right">三大法人</td>
                  <td align="center">買賣統計</td>
                  <td align="center">歷史股價</td>
                  <td align="center">融資融券</td>
                </tr>
              </thead>
              <tbody>
                {stockList.map(stockVO => (
                  <tr key={stockVO.stockId}>
                    <td>
                      <a href="#" onClick={(e) => this.connectURL(e, stockVO.stockId)}>{stockVO.stockName + '  (' + stockVO.stockId + ')'}</a>
                      <div style={{ color: this.changeColorByAmout(this.calStockRange(stockVO)) }}>
                        {stockVO.historyPriceList[0].endPrice + '(' +
                          (this.calStockRange(stockVO) > 0 ? '+' : '') +
                          this.calStockRange(stockVO) + ')'}
                      </div>
                    </td>
                    <td align="right" style={{ color: this.changeColorByAmout(stockVO.securitiesTradeList[0].foreignAmount) }}>
                      {stockVO.securitiesTradeList[0].foreignAmount}
                    </td>
                    <td align="right" style={{ color: this.changeColorByAmout(stockVO.securitiesTradeList[0].investAmount) }}>
                      {stockVO.securitiesTradeList[0].investAmount}
                    </td>
                    <td align="right" style={{ color: this.changeColorByAmout(stockVO.securitiesTradeList[0].nativeAmount) }}>
                      {stockVO.securitiesTradeList[0].nativeAmount}
                    </td>
                    <td align="right" style={{ color: this.changeColorByAmout(stockVO.securitiesTradeList[0].totalAmount) }}>
                      {stockVO.securitiesTradeList[0].totalAmount}
                    </td>
                    <td align="center">
                      <a href="#" onClick={() => showDetail(stockVO, 'securities')}>
                        <span className="glyphicon glyphicon-list-alt"></span>
                      </a>
                    </td>
                    <td align="center">
                      <a href="#" onClick={() => showDetail(stockVO, 'history')}>
                        <span className="glyphicon glyphicon-signal"></span>
                      </a>
                    </td>
                    <td align="center">
                      <a href="#" onClick={() => showDetail(stockVO, 'financing')}>
                        <span className="glyphicon glyphicon-file"></span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {detailType && detailType == 'securities' ?
              (<SecuritiesDetail data={data} style={{ marginTop: '30px' }} />)
              : detailType == 'history' ?
                (<HistoryDetail data={data} style={{ marginTop: '30px' }} />)
                :
                (<FinancingDetail data={data} style={{ marginTop: '30px' }} />)
            }
          </div>
        }
      </div >
    );
  }
}

const mapStateToProps = state => (
  {
    inputStockId: state.items.inputStockId,
    stockList: state.items.stockList,
    data: state.items.stockVO,
    detailType: state.items.detailType
  }
);

export default connect(mapStateToProps, actionCreators)(StockList);
