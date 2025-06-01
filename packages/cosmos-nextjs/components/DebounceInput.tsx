import { useEffect, useState } from "react";

const DebouncedInput = ({ onDebouncedChange }: { onDebouncedChange: (value: string) => void }) => {
  const [inputValue, setInputValue] = useState('');  // Store the input value
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  // Update the debounced value after 500ms of inactivity
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);  // Update the debounced value
    }, 500);  // Adjust this delay to your needs (500ms)

    // Cleanup function that resets the timeout if input changes before the delay
    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);  // Only re-run the effect if the input value changes

  // Call the function when the debounced value changes
  useEffect(() => {
    if (debouncedValue) {
      onDebouncedChange(debouncedValue);
    }
  }, [debouncedValue]);  // Only re-run when debouncedValue changes

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}  // Update the input value
      />
    </div>
  );
};

export default DebouncedInput;