import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action';
import { BeatLoader } from 'react-spinners';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { userId, loading, getGithub, changeUserId } = this.props;
    return (
      <div>
        <input type="text" className="form-control" onChange={changeUserId} placeholder="Please Key in your Github User Id." />
        <button type="button" className="btn btn-info" onClick={() => getGithub(userId)}>Submit</button>

        <div className='sweet-loading center-block' style={{ marginLeft: '40%' }}>
          <BeatLoader
            color={'rgb(54, 215, 183)'}
            loading={loading}
            size={100}
            margin={'10px'}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    userId: state.items.userId,
    loading: state.items.loading
  }
);

export default connect(mapStateToProps, actionCreators)(Home);