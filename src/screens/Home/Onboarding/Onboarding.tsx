import React from 'react';
import {useNavigation} from '@react-navigation/native';
import WorkTypeInfoModal from '../../../components/WorkTypeInfoModal';
import useWorkOut from '../../../hooks/useWorkOut';

export const Onboarding = () => {
  const navigation = useNavigation<any>();
  const {workOut, resetWorkout, currentWorkout, createWorkOut} = useWorkOut();

  return (
    <WorkTypeInfoModal
      isOpen
      onClose={() => navigation.goBack()}
      onSelected={async () => {
        if (!currentWorkout) {
          resetWorkout();
          await createWorkOut({
            distanceLeft: 0,
            distanceTotal: 0,
            isInStart: false,
            isInEnd: false,
            isCompleted: true,
            isRunning: false,
            elapsedTime: 0,
            note: '',
            status: 'inProgress',
            temp: 70,
            trayectoria: [],
            workOutType: workOut.workOutType,
            date: Date.now(),
            endTime: Date.now(),
            image: '',
            startTime: Date.now(),
          });
        }
        navigation.navigate('Splash', {toKlimber: true});
      }}
      type={workOut.workOutType}
      startText="START"
    />
  );
};
