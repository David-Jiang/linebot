import React from 'react';
import { BeatLoader } from 'react-spinners';

const Spinner = (props) => (
  <div className='sweet-loading center-block' style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)' }}>
    <BeatLoader
      color={'red'}
      loading={props.loading}
      size={40}
      margin={'10px'}
    />
  </div>
);

export default Spinner;