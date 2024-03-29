import {TransitionSpec} from "@react-navigation/stack/lib/typescript/src/types";

export const horizontalAnimation = {
  cardStyleInterpolator: ({ current, layouts }: any) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 300,
      },
    } as TransitionSpec,
    close: {
      animation: 'timing',
      config: {
        duration: 300,
      },
    } as TransitionSpec,
  },
};
