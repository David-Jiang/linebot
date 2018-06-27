import React from 'react';
import { BeatLoader } from 'react-spinners';

const Spinner = (props) => (
  <div className='sweet-loading center-block' style={{ position: 'fixed', top: '40%', left: '40%' }}>
    <BeatLoader
      color={'rgb(54, 215, 183)'}
      loading={props.loading}
      size={100}
      margin={'10px'}
    />
  </div>
);

export default Spinner;