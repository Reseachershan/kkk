import {useCallback, useRef} from 'react';
import useKeyboardListener from './useKeyboardListener';

const useScroll = () => {
  const {isKeyboardVisible} = useKeyboardListener();

  const inputsRef = useRef<any>({});
  const scrollRef = useRef<any>();
  const scrollTimmer = useRef<any>();
  const focusAction = useCallback((key: string) => {
    if (!inputsRef.current[key]) {
      return;
    }
    inputsRef.current[key]?.focus();
  }, []);
  const scrollTo = useCallback(
    (scrollItem: any) => {
      const time = isKeyboardVisible ? 10 : 120;
      scrollTimmer.current && clearTimeout(scrollTimmer.current);
      scrollTimmer.current = setTimeout(() => {
        if (scrollItem === 'ScrollTop') {
          scrollRef.current?.scrollToPosition(0, 0, true);
          return;
        }
        scrollRef.current?.scrollToFocusedInput(scrollItem, 300);
      }, time);
    },
    [isKeyboardVisible],
  );
  const registerInput = useCallback((name: string) => {
    return (ref: any) => {
      inputsRef.current[name] = ref;
    };
  }, []);

  return {
    inputsRef,
    scrollRef,
    focusAction,
    scrollTo,
    isKeyboardVisible,
    registerInput,
  };
};

export default useScroll;
