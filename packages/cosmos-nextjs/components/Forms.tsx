import React, { ChangeEvent } from "react";

interface FormFieldProps {
  labelName?: string;
  placeholder: string;
  inputType?: string;
  isTextArea?: boolean;
  value: any;
  row?: number;
  handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  handleTextChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  isDiabled?: boolean;
}

const Forms: React.FC<FormFieldProps> = ({
  labelName,
  placeholder,
  inputType = "text",
  isTextArea = false,
  value,
  row = 3,
  handleChange,
  handleTextChange,
  isDiabled = false,
}) => {
  return (
    <label className="flex-1 w-full flex flex-col">
      {labelName && (
        <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
          {labelName}
        </span>
      )}
      {isTextArea ? (
        <textarea
          required
          value={value}
          onChange={handleTextChange ? handleTextChange : undefined}
          rows={row}
          placeholder={placeholder}
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-[#4b5264] text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
        />
      ) : (
        <input
          required
          value={value}
          onChange={handleChange ? handleChange : undefined}
          type={inputType}
          step="1"
          disabled={isDiabled}
          placeholder={placeholder}
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-[#4b5264] text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
        />
      )}
    </label>
  );
};

export default Forms;
