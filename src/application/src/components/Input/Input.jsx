import React from 'react';
import cn from 'classnames';

import styles from './Input.scss';

const Input = ({ className, value, onChange, type = 'text' }) => {
  return (
    <input
      className={cn([className, styles.input])}
      value={value}
      onChange={onChange}
      type={type}
    />
  );
};

export default Input;
