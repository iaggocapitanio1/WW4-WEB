import { Box } from '@mui/material';
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import PrimaryBtn from '../buttons/primaryBtn';

const QrReaderComp = (props) => {
  // eslint-disable-next-line react/prop-types
  const { onScanned } = props;
  // eslint-disable-next-line no-unused-vars
  const [selected, setSelected] = useState('environment');
  const [startScan, setStartScan] = useState(false);
  const [data, setData] = useState('');
  const [count, setCount] = useState(0);

  function extraFunc (x) {
    console.log('extraFunc');
    setStartScan(false);
    onScanned(x);
    setData();
  }

  function OnResult ({ result }) {
    if (result?.text && count === 0) {
      setCount(1);
      extraFunc(result?.text);
    }
  }

  return count === 0 && (
    <Box className='fullCenter' sx={{ border: '1px solid blue', width: '100%', height: '100%' }} >
      {!startScan
        ? <PrimaryBtn text='Scan QR' onClick={() => setStartScan(!startScan)}/>
        : <Box sx={{ width: '100%', height: '100%', border: '5px solid red' }}>
          <QrReader
            facingMode={selected}
            delay={1000}
            value={data}
            onResult={(result, error) => result?.text && OnResult({ result, error }) }
            containerStyle={{ border: '2px solid purple', height: 'fit-content' }}
            videoContainerStyle={{ border: '2px solid orange', height: 'fit-content' }}
            videoStyle={{ border: '2px solid orange', height: 'fit-content' }}
          /></Box>
      }

    </Box>
  );
};

export default QrReaderComp;
