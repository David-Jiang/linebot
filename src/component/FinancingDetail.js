import React from 'react';
import { Link } from 'react-router';

class FinancingDetail extends React.Component {
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
    let exists = data.financingTradeList;
    if (!exists) {
      return (
        <div>
        </div>
      );
    }
    return (
      <div>
        <div style={{ fontSize: '16px' }}>
          {data.stockName + '融資融券餘額 '}
        </div>
        <table className="table table-striped" style={{ width: '70%' }}>
          <thead>
            <tr>
              <td>買賣日期</td>
              <td align="right">融資餘額</td>
              <td align="right">融資增減</td>
              <td align="right">融券餘額</td>
              <td align="right">融券增減</td>
            </tr>
          </thead>
          <tbody>
            {data.financingTradeList.map(financingVO => (
              <tr key={financingVO.transactionDate}>
                <td>
                  {financingVO.transactionDate}
                </td>
                <td align="right">
                  {financingVO.marginAmount}
                </td>
                <td align="right" style={{ color: this.changeColorByAmout(financingVO.marginBalance) }}>
                  {financingVO.marginBalance}
                </td>
                <td align="right">
                  {financingVO.shortAmount}
                </td>
                <td align="right" style={{ color: this.changeColorByAmout(financingVO.shortBalance) }}>
                  {financingVO.shortBalance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default FinancingDetail;