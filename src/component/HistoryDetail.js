import React from 'react';

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
        <table className="table table-striped">
          <thead>
            <tr>
              <td>買賣日期</td>
              <td align="right">開盤價</td>
              <td align="right">最高價<br />最低價</td>
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
                  <div>{historyVO.highPrice}</div>
                  <div>{historyVO.lowPrice}</div>
                </td>
                <td align="right" style={{ color: this.changeColorByAmout(historyVO.wavePrice) }}>
                  <div>{historyVO.endPrice}</div>
                  {'(' + (parseFloat(historyVO.wavePrice) > 0 ? '+' : '') + historyVO.wavePrice + ')'}
                </td>
                <td align="right">
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