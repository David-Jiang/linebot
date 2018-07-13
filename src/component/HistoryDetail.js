import React from 'react';
import { Link } from 'react-router';

class HistoryDetail extends React.Component {
  constructor(props) {
    super(props);
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

  calStockRange(historyVO) {
    let endPrice = historyVO.endPrice;
    let startPrice = historyVO.startPrice;
    let count = parseFloat(endPrice.replace(',', '')) - parseFloat(startPrice.replace(',', ''));
    return count.toFixed(2);
  }

  render() {
    let { data } = this.props;
    let exists = data.historyPriceList;
    if (!exists) {
      return (
        <div>
        </div>
      );
    }
    return (
      <div>
        <div style={{ fontSize: '16px' }}>
          {data.stockName + '歷史股價 '}
        </div>
        <table className="table table-striped" style={{ width: '70%' }}>
          <thead>
            <tr>
              <td>買賣日期</td>
              <td align="right">開盤價</td>
              <td align="right">最高價</td>
              <td align="right">最低價</td>
              <td align="right">收盤價</td>
              <td align="right">交易量</td>
            </tr>
          </thead>
          <tbody>
            {data.historyPriceList.map(historyVO => (
              <tr key={historyVO.transactionDate}>
                <td>
                  {historyVO.transactionDate}
                </td>
                <td align="right">
                  {historyVO.startPrice}
                </td>
                <td align="right">
                  {historyVO.highPrice}
                </td>
                <td align="right">
                  {historyVO.lowPrice}
                </td>
                <td align="right" style={{ color: this.changeColorByAmout(this.calStockRange(historyVO)) }}>
                  <div>{historyVO.endPrice}</div>
                  {'(' +
                    (this.calStockRange(historyVO) > 0 ? '+' : '') +
                    this.calStockRange(historyVO) + ')'}
                </td>
                <td align="right" >
                  {historyVO.transactionAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default HistoryDetail;