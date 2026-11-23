import { StandardElementProps, inputStyle } from "components/common";
import React from "react";

interface props extends StandardElementProps {
  name: string;
  placeholder?: string;
  defaultValue?: number | string;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
}

const style = ` ${inputStyle} form-control form-control-sm`;

export const NumberInput: React.FC<props> = ({
  name,
  placeholder,
  defaultValue,
  handleChange,
}) => {
  return (
    <div>
      <input
        name={name}
        type="number"
        step="0.1"
        defaultValue={defaultValue}
        placeholder={placeholder ?? name}
        min={0}
        className={`${style}`}
        onChange={handleChange}
      />
    </div>
  );
};
