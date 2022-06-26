import React from 'react';
import cn from 'classnames';

import styles from './Checkbox.scss';

const Checkbox = ({ disabled, checked, onChange, className, ...rest }) => {
  return (
    <input
      {...rest}
      className={cn([styles.checkbox, className])}
      type="checkbox"
      disabled={disabled}
      checked={checked}
      onChange={onChange}
    />
  )
};

export default Checkbox;
