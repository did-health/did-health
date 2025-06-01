import React from "react";

interface SelectFormsProps {
  options: Array<{ label: string; value: string | number }>;
  labelName?: string;
  placeholder: string;
  onChange: (value: string | number) => void;
  selectedValue?: string | number;
}

const SelectForms: React.FC<SelectFormsProps> = ({ options, labelName, placeholder, onChange, selectedValue }) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onChange(value);
  };
  console.log("options", options);
  return (
    <div className="flex flex-col">
      {labelName && <label className="font-medium text-gray-600 mb-2">{labelName}</label>}
      <select
        value={selectedValue}
        onChange={handleSelectChange}
        className="p-2 border rounded-md bg-white text-gray-800"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options?.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectForms;
