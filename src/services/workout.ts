import auth from '@react-native-firebase/auth';
import moment from 'moment';
import {workOut} from '../contexts/workOutContext';
import {getPercent} from '../utils/functions';
import {uploadImage} from './auth';
import {getBatch, getCollection, getDocument} from './firestore';
const colectionName = 'workouts';
const colectionRef = getCollection(colectionName);

export const createWorkout = async (workout?: workOut) => {
  const data: workOut = {
    ...workout,
    workOutType: workout?.workOutType || 'single',
    distanceLeft: workout?.distanceLeft || 0,
    distanceTotal: workout?.distanceTotal || 0,
    isInStart: workout?.isInStart || false,
    isInEnd: workout?.isInEnd || false,
    isCompleted: workout?.isCompleted || true,
    isRunning: workout?.isRunning || false,
    trayectoria: workout?.trayectoria || [],
    date: workout?.date || Date.now(),
    elapsedTime: workout?.elapsedTime || 0,
    startTime: workout?.startTime || Date.now(),
    endTime: workout?.endTime || Date.now(),
    note: workout?.note || '',
    temp: workout?.temp || 70,
    status: workout?.status || 'inProgress',
    userId: auth().currentUser?.uid || '',
  };

  const workoutsRef = getCollection(colectionName);
  await workoutsRef.add(data);
  return data;
};

export const observerWorkoutInProgress = (
  userId: string,
  callback: (arg0: workOut | null) => void,
) => {
  return colectionRef
    .where('status', '==', 'inProgress')
    .where('userId', '==', userId)
    .onSnapshot(
      workouts => {
        if (workouts.empty) {
          return callback(null);
        }
        const workout = workouts.docs[0];
        callback({...(workout.data() as workOut), workoutId: workout.id});
      },
      (error: any) => console.log('Error on observerWorkoutInProgress', error),
    );
};
export const observerWorkoutsByUserId = (
  userId: string,
  callback: (arg0: workOut[]) => void,
) => {
  return colectionRef
    .where('status', '!=', 'inProgress')
    .where('userId', '==', userId)
    .onSnapshot(
      workouts => {
        if (workouts.empty) {
          return callback([]);
        }
        const workout = workouts.docs.map(workout => {
          return {...(workout.data() as workOut), workoutId: workout.id};
        });
        callback(workout);
      },
      (error: any) => console.log('Error on observerWorkoutsByUserId', error),
    );
};
export const observerWorkoutById = (
  workoutId: string,
  callback: (arg0: workOut | null) => void,
) => {
  return colectionRef.doc(workoutId).onSnapshot(
    workout => {
      if (!workout.exists) {
        return callback(null);
      }
      callback({...(workout.data() as workOut), workoutId: workout.id});
    },
    (error: any) => console.log('Error on observerWorkoutInProgress', error),
  );
};

export const uploadWorkoutImage = async (
  uri: string,
  workoutId: string,
  userId: string,
) => {
  if (!userId || !uri) {
    return;
  }
  try {
    const time = moment().format('DD-MM-YYYY ss');
    const url = await uploadImage(
      uri,
      userId,
      `${colectionName}/${workoutId}/${time}.jpg`,
    );
    await getDocument(`${colectionName}/${workoutId}`).update({
      image: url,
      image_125x125: '',
      image_250x250: '',
      image_500x500: '',
    });
    return url;
  } catch (err) {
    console.log(err);
  }
};

export const updateAnalytics = async (workoutId: string, userId: string) => {
  if (!userId || !workoutId) {
    return;
  }
  const ref = getDocument(`${colectionName}/${workoutId}`);
  const payload = await ref.get();
  if (!payload.exists) {
    return;
  }
  const data = payload.data() as workOut;
  const status = data?.status || 'inProgress';
  const hasLog = Boolean(payload.data()?.log);
  if (status !== 'completed') {
    return;
  }
  if (hasLog) {
    return;
  }
  if (!userId) {
    return;
  }
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
  const batch = getBatch();
  batch.update(ref, {hasLog: true});
  await Promise.all(
    paths.map(async p => {
      const {path, type} = p;
      const doc = await getDocument(path).get();
      const dataFromPath = doc.data();
      const totalKlimbs = Number(dataFromPath?.totalKlimbs || 0) + 1;
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
      const newSlowestTime = !slowestTime
        ? newTime
        : Math.min(newTime, slowestTime);
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
      batch.set(getDocument(path), newData, {merge: true});
    }),
  );
  await batch.commit();
};

export const observeLastUserWorkout = (
  userId: string,
  callback: (workout: workOut) => void,
) => {
  return getCollection(colectionName)
    .where('userId', '==', userId)
    .where('status', '==', 'completed')
    .orderBy('date', 'desc')
    .limit(1)
    .onSnapshot(snapshot => {
      if (!snapshot || snapshot?.empty) {
        return null;
      }
      const workout = snapshot.docs[0].data() as workOut;
      callback({...workout, workoutId: snapshot.docs[0].id});
    });
};
export const observeBestUserWorkout = (
  userId: string,
  callback: (workout: workOut) => void,
) => {
  return getCollection(colectionName)
    .where('userId', '==', userId)
    .where('status', '==', 'completed')
    .orderBy('elapsedTime', 'asc')
    .limit(1)
    .onSnapshot(snapshot => {
      if (!snapshot || snapshot?.empty) {
        return null;
      }
      const workout = snapshot.docs[0].data() as workOut;
      callback({...workout, workoutId: snapshot.docs[0].id});
    });
};
