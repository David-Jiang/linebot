import React from 'react';
import { Link } from 'react-router';

class SecuritiesDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  changeColorByAmout(amt) {
    let amount = parseInt(amt);
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
    let exists = data.securitiesTradeList;
    if (!exists) {
      return (
        <div>
        </div>
      );
    }
    return (
      <div>
        <div style={{ fontSize: '16px' }}>
          {data.stockName + '法人買賣統計'}
        </div>
        <table className="table table-striped center-block" style={{ width: '70%' }}>
          <thead>
            <tr>
              <td>買賣日期</td>
              <td align="right">外資</td>
              <td align="right">投信</td>
              <td align="right">自營商</td>
              <td align="right">三大法人</td>
            </tr>
          </thead>
          <tbody>
            {data.securitiesTradeList.map(securitiesVO => (
              <tr key={securitiesVO.transactionDate}>
                <td>
                  {securitiesVO.transactionDate}
                </td>
                <td align="right" style={{ color: this.changeColorByAmout(securitiesVO.foreignAmount) }}>
                  {securitiesVO.foreignAmount}
                </td>
                <td align="right" style={{ color: this.changeColorByAmout(securitiesVO.investAmount) }}>
                  {securitiesVO.investAmount}
                </td>
                <td align="right" style={{ color: this.changeColorByAmout(securitiesVO.nativeAmount) }}>
                  {securitiesVO.nativeAmount}
                </td>
                <td align="right" style={{ color: this.changeColorByAmout(securitiesVO.totalAmount) }}>
                  {securitiesVO.totalAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default SecuritiesDetail;