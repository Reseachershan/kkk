import moment from 'moment';
import {workOutType} from '../types/workout';
import {getCollection} from './firestore';
export type ageRangeType =
  | 'All'
  | 'Under 20'
  | '20-29'
  | '30-39'
  | '40-49'
  | '50-59'
  | '60-69'
  | 'Over 70';
export type agrupationType = 'day' | 'week' | 'month' | 'year' | 'all';
export const observerLeaderboards = (
  date: number,
  workoutType: workOutType | 'all' = 'all',
  agrupation: agrupationType = 'all',
  gender: 'male' | 'female' | 'All' = 'All',
  age: ageRangeType = 'All',
  callback: (arg0: any[]) => void,
) => {
  const formats = {
    day: moment(date).format('YYYY-MM-DD'),
    week: moment(date).format('YYYY-[week-]w'),
    month: moment(date).format('YYYY-MM'),
    year: moment(date).format('YYYY'),
    all: 'all',
  };
  const format = formats[agrupation] || formats.all;
  const leaderBoardPath = `leaderBoard/${format}/${workoutType}`;
  let ref = getCollection(leaderBoardPath).where('hideProfile', '==', false);
  if (gender !== 'All') {
    ref = ref.where('gender', '==', gender);
  }
  if (age !== 'All') {
    ref = ref.where('ageFilter', 'array-contains', age);
  }
  return ref
    .orderBy('bestTime', 'asc')
    .limit(50)
    .onSnapshot(
      leaderBoards => {
        if (leaderBoards.empty) {
          return callback([]);
        }
        callback(
          leaderBoards.docs.map(leaderBoard => ({
            ...leaderBoard.data(),
            leaderBoardId: leaderBoard.id,
          })),
        );
      },
      (error: any) => console.log('Error on observerWorkoutInProgress', error),
    );
};

export const getAllObserverLeaderboards = (
  date: number,
  workoutType: workOutType | 'all' = 'all',
  agrupation: agrupationType = 'all',
  gender: 'male' | 'female' | 'All' = 'All',
  age: ageRangeType = 'All',
  callback: (arg0: any[]) => void,
) => {
  const formats = {
    day: moment(date).format('YYYY-MM-DD'),
    week: moment(date).format('YYYY-[week-]w'),
    month: moment(date).format('YYYY-MM'),
    year: moment(date).format('YYYY'),
    all: 'all',
  };
  const format = formats[agrupation] || formats.all;
  const leaderBoardPath = `leaderBoard/${format}/${workoutType}`;
  let ref = getCollection(leaderBoardPath).where('hideProfile', '==', false);
  if (gender !== 'All') {
    ref = ref.where('gender', '==', gender);
  }
  if (age !== 'All') {
    ref = ref.where('ageFilter', 'array-contains', age);
  }
  return ref
    .orderBy('bestTime', 'asc')
    .onSnapshot(
      leaderBoards => {
        if (leaderBoards.empty) {
          return callback([]);
        }
        callback(
          leaderBoards.docs.map(leaderBoard => ({
            ...leaderBoard.data(),
            leaderBoardId: leaderBoard.id,
          })),
        );
      },
      (error: any) => console.log('Error on observerWorkoutInProgress', error),
    );
};