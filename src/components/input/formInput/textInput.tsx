import { StandardElementProps, inputStyle } from "components/common";
import React from "react";
interface props extends StandardElementProps {
  name: string;
  placeholder?: string;
  defaultValue?: string;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
}
const style = ` ${inputStyle} form-control form-control-sm`;

export const TextInput: React.FC<props> = ({
  name,
  placeholder,
  defaultValue,
  handleChange,
}) => {
  return (
    <div>
      <input
        name={name}
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder ?? name}
        className={`${style}`}
        onChange={handleChange}
      />
    </div>
  );
};
