import React from 'react';
import { Link } from 'react-router';

class Second extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { data } = this.props;
    return (
      <div>
        {'查詢的標的為:' + data.queryData}<br />
        {data.resultList.map(resultVO => (
          <li key={resultVO.rcvNo}>
            <input type="checkbox" id={resultVO.rcvNo} />
            {resultVO.rcvNo + ' - ' + resultVO.cmpyName}
          </li>
        ))}
      </div>
    );
  }
}

export default Second;