import { StandardElementProps, inputStyle } from "components/common";
import React from "react";

interface ValueProp {
  name: string;
  value: string;
}
interface Props extends StandardElementProps {
  name: string;
  options: ValueProp[];
  handleChange: React.ChangeEventHandler<HTMLSelectElement>;
  value?: string;
}

const style = ` ${inputStyle} form-select form-select-sm`;

export const SelectInput: React.FC<Props> = ({
  name,
  options,
  handleChange,
  value,
}) => {
  return (
    <div>
      <select
        name={name}
        className={`${style}`}
        onChange={handleChange}
        value={value}
      >
        {options.map((o) => (
          <option value={o.value} key={o.name}>
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );
};
