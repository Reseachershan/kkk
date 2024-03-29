import React, {createContext, FC, ReactNode, useState} from 'react';
import {trayectoriaType, workOutType} from '../types/workout';

export type workOut = {
  workOutType: workOutType;
  distanceLeft: number;
  distanceTotal: number;
  isInStart: boolean;
  isInEnd: boolean;
  startTime?: number;
  isRunning?: boolean;
  trayectoria: trayectoriaType[];
  isCompleted?: boolean;
  date?: number;
  elapsedTime: number;
  endTime?: number;
  workoutId?: string;
  status: 'inProgress' | 'completed' | 'canceled';
  userId?: string;
  temp: number;
  note: string;
  image?: string;
};
const defaultValues: workOut = {
  workOutType: 'single',
  distanceLeft: 0,
  distanceTotal: 0,
  isInStart: false,
  isInEnd: false,
  isCompleted: true,
  isRunning: false,
  trayectoria: [],
  date: Date.now(),
  elapsedTime: 0,
  startTime: Date.now(),
  endTime: Date.now(),
  note: '',
  temp: 70,
  status: 'inProgress',
};
type contextType = {
  workOut: workOut;
  currentWorkout: null | workOut;
  setWorkOut: React.Dispatch<React.SetStateAction<workOut>>;
  setCurrentWorkOut: React.Dispatch<React.SetStateAction<workOut | null>>;
};
const WorkOutContext = createContext({
  workOut: defaultValues,
  currentWorkout: null,
  setWorkOut: e => {},
} as contextType);

type Props = {
  children: ReactNode;
};
const WorkOutProvider: FC<Props> = ({children}) => {
  const [workOut, setWorkOut] = useState<workOut>(defaultValues);
  const [currentWorkout, setCurrentWorkOut] = useState<null | workOut>(null);
  return (
    <WorkOutContext.Provider
      value={{
        workOut,
        setWorkOut,
        currentWorkout,
        setCurrentWorkOut,
      }}>
      {children}
    </WorkOutContext.Provider>
  );
};

export {WorkOutProvider, WorkOutContext};
