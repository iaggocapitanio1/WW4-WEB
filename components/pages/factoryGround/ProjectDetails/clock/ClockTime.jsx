import moment from 'moment';
import { useEffect, useState } from 'react';

export const ClockTime = () => {
  const [clock, setClock] = useState();

  useEffect(() => {
    setInterval(() => {
      const date = new Date();

      setClock(date);
    }, 1000);
  }, []);

  return moment(clock).format('HH:mm:ss');
};
