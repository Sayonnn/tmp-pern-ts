import { useState } from "react";
import type { TextInputProps } from "../../interfaces/formsInterface";
import { sanitize } from "../../utils/sanitize";

const TextInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  hidden = false,
}: TextInputProps) => {
  if (hidden) return <input type={type} name={name} value={value} hidden />;

  const [focused, setFocused] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const cleanValue = sanitize(e.target.value);
      onChange?.({
        ...e,
        target: { ...e.target, value: cleanValue },
      });
    };
  

  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <input
          id={name}           
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder=" " 
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`peer border rounded px-3 pt-6 pb-2 w-full focus:outline-none 
                      focus:border-sky-400 ${error && !value  ? "border-red-600" : focused ? "border-sky-400" : "border-gray-300"} ${value ? "border-gray-300" : "border-gray-300"} `}
        />
        <label
          htmlFor={name}       
          className={`absolute left-3 top-1 ${error && !value ? "text-red-600" : focused ? "text-sky-500" : "text-gray-400"} ${value ? "text-gray-300" : "text-gray-300"} text-sm transition-all duration-200
                     peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                     peer-focus:top-1 peer-focus:text-sm peer-focus:text-sky-500 cursor-text`}
        >
          {label || placeholder}
        </label>
      </div>
      {error && <p className={`text-red-600 text-sm ${error && !value && !focused ? "text-red-600" : focused || value ? "hidden" : ""}`}>{error}</p>}
    </div>
  );
};

export default TextInput;
