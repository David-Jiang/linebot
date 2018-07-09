import React from 'react';
import { Link } from 'react-router';

class HistoryDetail extends React.Component {
  constructor(props) {
    super(props);
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
        <table className="table table-striped center-block" style={{ width: '70%' }}>
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
                <td align="right">
                  {historyVO.endPrice}
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