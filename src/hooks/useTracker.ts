import {useEffect, useMemo, useState, useRef} from 'react';
import moment from 'moment';
const MS_IN_HOUR = 3600000;

const difTime = (date: number) => {
  const diff = moment().diff(new Date(date), 'milliseconds');
  return diff;
};
export const getTimeFormat = (
  time: number,
  negativeTime: number = 0,
  isSecond: boolean = true,
  format?: string,
) => {
  let hours = Math.floor((time + negativeTime || 0) / MS_IN_HOUR);
  if (isNaN(hours)) {
    hours = 0;
  }
  const timeNoDecimal = Number(Number(time + negativeTime).toFixed(0));
  if (!hours) {
    if (isSecond) {
      return moment(new Date(0, 0, 0, 0, 0, 0, timeNoDecimal)).format(
        format || 'HH :mm :ss',
      );
    } else {
      return moment(new Date(0, 0, 0, 0, 0, 0, timeNoDecimal)).format(
        format || 'm').concat(':00')
    }
  }
  if (isSecond) {
    return (
      hours +
      moment(new Date(0, 0, 0, 0, 0, 0, timeNoDecimal)).format(format || ':mm:ss')
    )
  } else {
    return (
      hours +
      moment(new Date(0, 0, 0, 0, 0, 0, timeNoDecimal)).format(format || ':mm').concat(':00')
    )
  }
};

type Props = {
  isTracking?: boolean;
  startTime: number;
  elapsedTime: number;
  format?: string;
};
const useTracking = (props: Props) => {
  const {isTracking, startTime, elapsedTime, format} = props;
  const [time, setTime] = useState(elapsedTime);
  const [negativeTime, setNegativeTime] = useState(0);
  const convertInHours = useMemo(() => {
    return getTimeFormat(time, negativeTime, true, format);
  }, [format, negativeTime, time]);
  useEffect(() => {
    const diff = difTime(startTime);
    // console.log(new Date(startTime), new Date(), diff);
    if (diff < 0 && isTracking) {
      setNegativeTime(Math.abs(diff));
    } else {
      setNegativeTime(0);
    }
    setTime(isTracking ? diff + Number(elapsedTime || 0) : elapsedTime || 0);
  }, [isTracking, elapsedTime, startTime]);

  const timerTracker = useRef<any>(null);

  useEffect(() => {
    timerTracker.current && clearInterval(timerTracker.current);
    if (!isTracking) {
      return;
    }
    timerTracker.current = setInterval(() => {
      let time = difTime(startTime) + Number(elapsedTime || 0);
      setTime(time);
    }, 1000);
    return () => {
      timerTracker.current && clearInterval(timerTracker.current);
    };
  }, [isTracking, elapsedTime, startTime]);
  return [convertInHours];
};

export default useTracking;
