import moment from 'moment';
import {getCollection, getDocument} from './firestore';
import {workOutType} from '../types/workout';
export const observerAnalyticWorkoutById = (
  userId: string,
  date: number,
  workoutType: workOutType | 'all' = 'all',
  agrupation: 'day' | 'week' | 'month' | 'year' | 'all' = 'all',
  callback: (arg0: any) => void,
) => {
  const formats = {
    day: moment(date).format('YYYY-MM-DD'),
    week: moment(date).format('YYYY-[week-]w'),
    month: moment(date).format('YYYY-MM'),
    year: moment(date).format('YYYY'),
    all: 'all',
  };
  const type = workoutType === 'all' ? '' : `_${workoutType}`;
  const format = formats[agrupation] || formats.all;
  const path = `users/${userId}/workoutAnalytics/${format}${type}`;
  return getDocument(path).onSnapshot(
    analytic => {
      if (!analytic.exists) {
        return callback(null);
      }
      callback({...analytic.data(), analyticId: analytic.id});
    },
    (error: any) => console.log('Error on observerWorkoutInProgress', error),
  );
};
export const observerMonthsAnalyticWorkoutByYear = (
  userId: string,
  date: number,
  workOutType: workOutType,
  callback: (arg0: any[]) => void,
) => {
  const month = moment(date).format('MM');
  const path = `users/${userId}/workoutAnalytics`;
  return (
    getCollection(path)
    //comment this out to get all analytics
      // .where('month', '==', month)
      // .where('rangeType', '==', 'month')
      // .where('workOutType', '==', workOutType)
      .onSnapshot(
        analytics => {
          if (analytics.empty) {
            return callback([]);
          }
          callback(
            analytics.docs.map(analytic => ({
              ...analytic.data(),
              analyticId: analytic.id,
            })),
          );
        },
        (error: any) =>
          console.log('Error on observerWorkoutInProgress', error),
      )
  );
};
