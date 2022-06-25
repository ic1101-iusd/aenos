import React from 'react';
import cn from 'classnames';

import styles from './Checkbox.scss';

const Checkbox = ({ disabled, checked, onChange, className }) => {
  return (
    <input
      className={cn([styles.checkbox, className])}
      type="checkbox"
      name="checkbox-checked"
      disabled={disabled}
      checked={checked}
      onChange={onChange}
    />
  )
};

export default Checkbox;
