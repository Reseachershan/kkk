import moment from 'moment';
import {useCallback, useContext, useMemo} from 'react';
import {workOut, WorkOutContext} from '../contexts/workOutContext';
import {getDocument} from '../services/firestore';
import {createWorkout} from '../services/workout';
import {trayectoriaType, workOutType} from '../types/workout';

const difTime = (date: number) => {
  const diff = moment().diff(new Date(date), 'milliseconds');
  return diff;
};
const useWorkOut = () => {
  const {setWorkOut, workOut, setCurrentWorkOut, currentWorkout} =
    useContext(WorkOutContext);

  const workoutDbRef = useMemo(() => {
    if (!currentWorkout?.workoutId) {
      return null;
    }
    return getDocument(`workouts/${currentWorkout?.workoutId}`);
  }, [currentWorkout?.workoutId]);

  const updateWorkOut = useCallback(
    (workOutT: workOutType) => {
      setWorkOut(prev => ({...prev, workOutType: workOutT}));
    },
    [setWorkOut],
  );
  const setIsInStart = useCallback(
    (isInStart: boolean = true) => {
      workoutDbRef?.update({isInStart});
      setWorkOut(prev => ({...prev, isInStart}));
    },
    [setWorkOut, workoutDbRef],
  );
  const setIsInEnd = useCallback(
    (isInEnd: boolean = true) => {
      workoutDbRef?.update({isInEnd});
      setWorkOut(prev => ({...prev, isInEnd}));
    },
    [setWorkOut, workoutDbRef],
  );
  const updateDistanceLeft = useCallback(
    (distanceLeft: number = 0) => {
      workoutDbRef?.update({distanceLeft});
      setWorkOut(prev => ({...prev, distanceLeft}));
    },
    [setWorkOut, workoutDbRef],
  );
  const updateDistanceTotal = useCallback(
    (distanceTotal: number) => {
      workoutDbRef?.update({distanceTotal});
      setWorkOut(prev => ({...prev, distanceTotal}));
    },
    [setWorkOut, workoutDbRef],
  );
  const updateStartTime = useCallback(
    (startTime: number) => {
      workoutDbRef?.update({startTime: startTime || Date.now()});
      setWorkOut(prev => ({...prev, startTime}));
    },
    [setWorkOut, workoutDbRef],
  );
  const updateElapsedTime = useCallback(
    (elapsedTime: number) => {
      workoutDbRef?.update({elapsedTime: Number(elapsedTime || 0)});
      setWorkOut(prev => ({...prev, elapsedTime: Number(elapsedTime || 0)}));
    },
    [setWorkOut, workoutDbRef],
  );
  const toggleRunning = useCallback(() => {
    setWorkOut(prev => {
      let elapsedTime = prev.elapsedTime;
      const newIsRunning = !prev.isRunning;
      let startTime = prev.startTime;

      if (isNaN(elapsedTime)) {
        elapsedTime = 0;
      }
      if (!newIsRunning) {
        elapsedTime = elapsedTime + difTime(startTime || Date.now());
      } else {
        startTime = Date.now();
      }
      workoutDbRef?.update({isRunning: newIsRunning, elapsedTime, startTime});
      return {...prev, elapsedTime, startTime, isRunning: newIsRunning};
    });
  }, [setWorkOut, workoutDbRef]);
  const resetWorkout = useCallback(() => {
    console.log('resetWorkout');
    setWorkOut(prev => {
      return {
        ...prev,
        distanceLeft: 0,
        distanceTotal: 0,
        isInStart: false,
        isInEnd: false,
        startTime: 0,
        isRunning: false,
        elapsedTime: 0,
        trayectoria: [],
      };
    });
  }, [setWorkOut]);
  const stopRuning = useCallback(
    (isCompleted?: boolean) => {
      setWorkOut(prev => {
        let elapsedTime = prev.elapsedTime;
        const newIsRunning = !prev.isRunning;
        let startTime = prev.startTime;
        let date = prev.date;
        let endTime = prev.endTime;
        if (!newIsRunning) {
          elapsedTime = elapsedTime + difTime(startTime || Date.now());
        }
        startTime = 0;
        if (isCompleted) {
          date = Date.now();
          endTime = Date.now();
          startTime = endTime - elapsedTime;
        }
        workoutDbRef?.update({
          date,
          endTime,
          startTime,
          elapsedTime,
          isRunning: false,
          isCompleted: Boolean(isCompleted),
          status: isCompleted ? 'completed' : 'stopped',
        });

        return {
          ...prev,
          date,
          endTime,
          startTime,
          elapsedTime,
          isRunning: false,
          isCompleted: Boolean(isCompleted),
          status: isCompleted ? 'completed' : 'canceled',
        };
      });
    },
    [setWorkOut, workoutDbRef],
  );
  const startRuning = useCallback(
    (reestart?: boolean) => {
      setWorkOut(prev => {
        const newIsRunning = !prev.isRunning;
        let elapsedTime = prev.elapsedTime;
        let startTime = prev.startTime;
        if (!newIsRunning && !reestart) {
          elapsedTime = elapsedTime + difTime(startTime || Date.now());
        }
        if (reestart) {
          elapsedTime = 0;
        }
        startTime = Date.now();
        workoutDbRef?.update({isRunning: true, elapsedTime, startTime});
        return {...prev, elapsedTime, startTime, isRunning: true};
      });
    },
    [setWorkOut, workoutDbRef],
  );
  const updateTrayectory = useCallback(
    (trayectoria: trayectoriaType[]) => {
      setWorkOut(prev => ({...prev, trayectoria}));
    },
    [setWorkOut],
  );

  // const updateLocation = useCallback(
  //   (newLocation: any) => {
  //     setWorkOut(prev => {
  //       const {type, isInStart, isInEnd, position} = newLocation;
  //       const {locations, workOutType} = prev;
  //       const firstLocation = locations[0];
  //       if (type === 'start' || !firstLocation) {
  //         newLocation.isInStart = !isInEnd;
  //         newLocation.isInEnd = !newLocation.isInStart;
  //         newLocation.type = 'start';
  //         locations[0] = newLocation;
  //         return {...prev, locations};
  //       }
  //       if (workOutType === 'single') {
  //         if (type === 'end') {
  //           if (
  //             (firstLocation.isInStart && !isInStart) ||
  //             (!firstLocation.isInStart && isInStart)
  //           ) {
  //             newLocation.isInEnd = !isInStart;
  //             newLocation.isInStart = !newLocation.isInEnd;
  //             newLocation.type = 'end';
  //             return {...prev, locations: [...locations, newLocation]};
  //           }
  //           newLocation.isInEnd = !isInStart;
  //           newLocation.isInStart = !newLocation.isInEnd;
  //           return {...prev, locations: [...locations, newLocation]};
  //         }
  //       }
  //       return {...prev, locations: [...locations, newLocation]};
  //     });
  //   },
  //   [setWorkOut],
  // );
  const createWorkOut = useCallback(async (workOut?: workOut) => {
    try {
      createWorkout(workOut);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return {
    setWorkOut,
    updateWorkOut,
    setIsInStart,
    setIsInEnd,
    updateDistanceLeft,
    updateDistanceTotal,
    updateStartTime,
    updateElapsedTime,
    toggleRunning,
    stopRuning,
    startRuning,
    updateTrayectory,
    resetWorkout,
    createWorkOut,
    // updateLocation,
    workOut,
    setCurrentWorkOut,
    currentWorkout,
  };
};

export default useWorkOut;
