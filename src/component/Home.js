import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';

import testData from './data';

class Home extends React.Component {
  static defaultProps = {
    options: {
      title: {
        text: 'My stock chart'
      },
      series: [{
        data: testData
      }]
    }
  };

  static propTypes = {
    options: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      show: true
    };
  }

  handleDismiss = () => {
    this.setState({ show: false });
  }

  handleShow = () => {
    this.setState({ show: true });
  }

  render() {
    return (
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={'stockChart'}
        options={this.props.options}
      />
    );
  }
}

export default Home;