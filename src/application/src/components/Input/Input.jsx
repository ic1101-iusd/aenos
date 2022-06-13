import React, { useCallback, forwardRef } from 'react';
import cn from 'classnames';

import styles from './Input.scss';

const Input = forwardRef(({ className, value, onChange, type = 'text', ...rest }, ref) => {
  const wrappedOnChange = useCallback((e) => {
    const value = type === 'number' ? Number(e.target.value) : e.target.value;

    onChange(value);
  }, [onChange]);

  return (
    <input
      className={cn([className, styles.input])}
      value={value}
      onChange={wrappedOnChange}
      type={type}
      ref={ref}
      {...rest}
    />
  );
});

export default Input;
