import {TransitionSpec} from '@react-navigation/stack/lib/typescript/src/types';

export const fadeAnimation = {
  cardStyleInterpolator: ({current}: any) => {
    return {
      cardStyle: {
        opacity: current.progress,
      },
    };
  },
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 600,
      },
    } as TransitionSpec,
    close: {
      animation: 'timing',
      config: {
        duration: 600,
      },
    } as TransitionSpec,
  },
};
export const noAnimation = {
  cardStyleInterpolator: ({current}: any) => {
    return {
      cardStyle: {
        opacity: current.progress,
      },
    };
  },
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 2,
      },
    } as TransitionSpec,
    close: {
      animation: 'timing',
      config: {
        duration: 2,
      },
    } as TransitionSpec,
  },
};
