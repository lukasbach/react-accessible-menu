import { useEffect, useRef } from 'react';

export const useRefCopy = <T>(currentValue: T) => {
  const ref = useRef(currentValue);

  useEffect(() => {
    ref.current = currentValue;
  }, [currentValue]);

  return ref;
}