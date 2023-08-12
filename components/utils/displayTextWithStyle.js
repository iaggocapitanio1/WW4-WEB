import { Typography } from '@mui/material';
import React from 'react';
import hasData from './hasData';
import ItsNumber from './ItsNumber';
import getKeywords from './Keywords';

const displayWithStyle = (item, col, index) => {
  const keywords = getKeywords();

  if (!hasData(item)) return <Typography>Nan {item}</Typography>;

  //  Find if the text match's with any of the keywords
  const resError = keywords.errorKeywords.find((keywork) => keywork === item);

  const resSuccess = keywords.successKeywords.find(
    (keywork) => keywork === item
  );

  const resWarning = keywords.warningKeywords.find(
    (keywork) => keywork === item
  );

  if (col) {
    if (item[`${col}`] < 0 && (col === 'desvio' || col === 'desvio2')) {
      return <Typography variant='md' className='successBalloon'>{item[`${col}`]} horas</Typography>;
    } else if (item[`${col}`] > 0 && (col === 'desvio' || col === 'desvio2')) {
      return <Typography variant='md' className='errorBalloon'>{item[`${col}`]} horas</Typography>;
    } else if (
      Math.ceil(item[`${col}`]) === 0 &&
      (col === 'desvio' || col === 'desvio2')
    ) {
      return <Typography variant='md' className='warningBalloon'>{item[`${col}`]} horas</Typography>;
    }

    if (index === 0) {
      return (
        <Typography variant='md' className='link'>
          {displayWithStyle(item[`${col}`])}{' '}
          {ItsNumber(item[`${col}`]) ? 'horas' : null}
        </Typography>
      );
    }
  }

  if (item < 0 && (col === 'desvio' || col === 'desvio2')) return <Typography variant='md' className='successBalloon'>{item} horas</Typography>;
  else if (item > 0 && (col === 'desvio' || col === 'desvio2')) return <Typography variant='md' className='errorBalloon'>{item} horas</Typography>;
  else if (item === 0 && (col === 'desvio' || col === 'desvio2')) return <Typography variant='md' className='warningBalloon'>{item} horas</Typography>;

  if (resError !== undefined) { return <Typography variant='md' className='errorBalloon'>{item} </Typography>; }

  if (resSuccess !== undefined) {
    return <Typography variant='md' className='successBalloon'>{item} </Typography>;
  }

  if (resWarning !== undefined) {
    return <Typography variant='md' className='warningBalloon'>{item} </Typography>;
  }

  return item;
};

export default displayWithStyle;
