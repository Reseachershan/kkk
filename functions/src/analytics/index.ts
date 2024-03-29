/* eslint-disable max-len */
import functions = require('firebase-functions');
import admin = require('firebase-admin');
import moment = require('moment');
if (!admin.apps.length) {
  admin.initializeApp();
}
const firestore = admin.firestore();
const getPercent = (num: number, total: number) => {
  return ((num || 0) * 100) / (total || 1);
};
const getKlimberLevel = (totalKlimbs: number) => {
  if (!totalKlimbs || totalKlimbs <= 4) {
    return 'klimber';
  }
  if (totalKlimbs <= 14) {
    return 'explorer';
  }
  if (totalKlimbs <= 39) {
    return 'master';
  }
  if (totalKlimbs <= 74) {
    return 'elite';
  }
  return 'ultra';
};
const getAge = (date: number) => {
  if (!date) return 0;
  const now = new Date();
  const birthDate = new Date(date);
  const age = moment(now).diff(birthDate, 'years');
  return age;
};
const getAgeFilter = (age: number) => {
  // 'Under 20', '20-29', '30-39', '40-49', '50-59', '60-69', 'Over 70', 'All',
  if (!age || age <= 20) return ['Under 20', 'All'];
  if (age >= 20 && age <= 29) return ['20-29', 'All'];
  if (age >= 30 && age <= 39) return ['30-39', 'All'];
  if (age >= 40 && age <= 49) return ['40-49', 'All'];
  if (age >= 50 && age <= 59) return ['50-59', 'All'];
  if (age >= 60 && age <= 69) return ['60-69', 'All'];
  if (age >= 70) return ['Over 70', 'All'];
  return ['All'];
};
const updateAnalytics = async (
  workoutId: string,
  userId: string,
  previousData: any,
  data: any,
  ref: any,
) => {
  if (!userId || !workoutId) {
    return;
  }
  if (!data) return;
  const status = data?.status || 'inProgress';
  const hasLog = Boolean(data?.log);
  if (status !== 'completed') {
    return;
  }
  if (hasLog) {
    return;
  }
  if (!userId) {
    return;
  }
  const needToIncrementKlimbsCount = previousData?.status !== 'completed' && data?.status === 'completed';
  const date = new Date(data?.date || Date.now());
  // const existsA = Boolean(after?.userId);
  // const existsB = Boolean(before?.userId);
  // const isNew = Boolean(existsA && !existsB);
  // const isDelete = Boolean(!existsA && existsB);

  const dayFormat = moment(date).format('YYYY-MM-DD');
  const weekFormat = moment(date).format('YYYY-[week-]w');
  const monthFormat = moment(date).format('YYYY-MM');
  const yearFormat = moment(date).format('YYYY');

  const workOutType = data?.workOutType || 'single';
  const types = [
    {type: 'all', value: 'all'},
    {type: 'day', value: dayFormat},
    {type: 'week', value: weekFormat},
    {type: 'month', value: monthFormat},
    {type: 'year', value: yearFormat},
  ];
  const paths = [
    ...types.map(type => {
      return {
        path: `users/${userId}/workoutAnalytics/${type.value}`,
        type: type.type,
        workOutType: 'all',
      };
    }),
    ...types.map(type => {
      return {
        path: `users/${userId}/workoutAnalytics/${type.value}_${workOutType}`,
        type: type.type,
        workOutType,
      };
    }),
  ];
  const batch = firestore.batch();
  batch.update(ref, {hasLog: true});
  let totalKlimbsInYear = 0;
  let totalKlimbsAll = 0;
  await Promise.all(
    paths.map(async p => {
      const {path, type} = p;
      const doc = await firestore.doc(path).get();
      const dataFromPath = doc.data();
      const totalKlimbs = Number((dataFromPath?.totalKlimbs || 0) + (needToIncrementKlimbsCount ? 1 : 0));
      if (type === 'year' && p.workOutType === 'all') {
        totalKlimbsInYear = totalKlimbs;
      }
      if (type === 'all' && p.workOutType === 'all') {
        totalKlimbsAll = totalKlimbs;
      }
      const newTime = Number(data?.elapsedTime) || 0;
      const totalTime = Number(dataFromPath?.totalTime || 0) + Number(newTime);
      const bestTime = dataFromPath?.bestTime || 0;
      const slowestTime = dataFromPath?.slowestTime || 0;
      const distanceTotal = dataFromPath?.distanceTotal || 0;
      const averageTemp = dataFromPath?.averageTemp || 0;
      const lastWorkout = dataFromPath?.lastWorkout || '';
      const newDistance =
        Number(data?.distanceTotal || 0) + Number(distanceTotal);
      const newTemp = data?.temp || 0;
      const newBestTime = Math.max(0, newTime, bestTime);
      let newSlowestTime = Math.min(newTime, slowestTime);
      if (!slowestTime) newSlowestTime = newTime;
      const newAverageTime = getPercent(totalTime, totalKlimbs) / 100;
      const newAverageTemp = (averageTemp + newTemp) / 2;
      const newData = {
        workOutType: p.workOutType,
        totalKlimbs: Number(totalKlimbs),
        totalTime: Number(totalTime),
        bestTime: newBestTime,
        slowestTime: newSlowestTime,
        distanceTotal: Number(newDistance),
        averageTime: newAverageTime,
        averageTemp: newAverageTemp,
        userId,
        lastWorkout: workoutId || lastWorkout,
        rangeType: type,
        day: moment(date).format('DD'),
        month: moment(date).format('MM'),
        year: moment(date).format('YYYY'),
        week: moment(date).format('w'),
      };
      batch.set(firestore.doc(path), newData, {merge: true});
    }),
  );
  batch.update(firestore.doc(`users/${userId}`), {
    lastAnalyticsUpdate: Date.now(),
    totalKlimbs: totalKlimbsInYear || 0,
    totalKlimbsAll: totalKlimbsAll || 0,
    klimbLevel: getKlimberLevel(totalKlimbsInYear),
  });
  await batch.commit();
};

exports.onWorkoutResultsWrite = functions.firestore
  .document('workouts/{workoutId}')
  .onWrite(async (change, context) => {
    const {workoutId} = context.params;
    const after = change.after?.data();
    const before = change.before?.data();
    const userId = after?.userId || before?.userId;
    await updateAnalytics(workoutId, userId, before, after, change.after.ref);
  });

exports.onAnalyticsResultsWrite = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const {userId} = context.params;
    const after = change.after?.data();
    const before = change.before?.data();
    const hideProfileA = after?.hideProfile;
    const hideProfileB = before?.hideProfile;
    const lastAnalyticsUpdateA = after?.lastAnalyticsUpdate;
    const lastAnalyticsUpdateB = before?.lastAnalyticsUpdate;
    const hasHideChanged = hideProfileA !== hideProfileB;
    const hasAnalyticsChanged = lastAnalyticsUpdateA !== lastAnalyticsUpdateB;
    if (!hasHideChanged && !hasAnalyticsChanged) return;
    const date = Date.now();

    const dayFormat = moment(date).format('YYYY-MM-DD');
    const weekFormat = moment(date).format('YYYY-[week-]w');
    const monthFormat = moment(date).format('YYYY-MM');
    const yearFormat = moment(date).format('YYYY');

    const workOutTypes = ['all', 'single', 'double'];
    const types = [
      {type: 'all', value: 'all'},
      {type: 'day', value: dayFormat},
      {type: 'week', value: weekFormat},
      {type: 'month', value: monthFormat},
      {type: 'year', value: yearFormat},
    ];
    const paths: {
      path: string;
      type: string;
      workOutType: string;
      leaderBoardPath: string;
    }[] = [];
    workOutTypes.forEach(workOutType => {
      types.forEach(type => {
        let path = `users/${userId}/workoutAnalytics/${type.value}`;
        if (workOutType !== 'all') path += `_${workOutType}`;
        // eslint-disable-next-line max-len
        const leaderBoardPath = `leaderBoard/${type.value}/${workOutType}/${userId}`;
        paths.push({
          path,
          type: type.type,
          workOutType,
          leaderBoardPath,
        });
      });
    });
    const batch = firestore.batch();
    await Promise.all(
      paths.map(async p => {
        const {path, type, workOutType, leaderBoardPath} = p;

        const estadistica = await firestore.doc(path).get();
        const data = estadistica?.data();
        const totalKlimbsInYear = after?.totalKlimbsInYear || 0;
        const age = getAge(after?.birthDate);
        const leaderBoardData = {
          userId,
          klimbLevel: after?.klimbLevel || getKlimberLevel(totalKlimbsInYear),
          totalKlimbsInYear,
          userName: after?.userName || '',
          profileImage: after?.profileImage || null,
          hideProfile: Boolean(after?.hideProfile || !data?.bestTime),
          age,
          ageFilter: getAgeFilter(age),
          gender: after?.gender || 'male',
          bestTime: data?.bestTime || 0,
          workoutType: workOutType,
          lastWorkout: data?.lastWorkout || null,
          rangeType: type,
          day: moment(date).format('DD'),
          month: moment(date).format('MM'),
          year: moment(date).format('YYYY'),
          week: moment(date).format('w'),
        };
        batch.set(firestore.doc(leaderBoardPath), leaderBoardData);
      }),
    );
    await batch.commit();
  });
