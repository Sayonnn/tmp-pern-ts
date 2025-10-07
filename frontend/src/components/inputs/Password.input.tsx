import { useState } from "react";
import { type PasswordInputProps } from "../../interfaces/formsInterface";

function PasswordInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  hidden,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  if (hidden) return <input type="password" name={name} value={value} hidden />;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <input
          id={name}
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder=" "
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`peer border rounded-tl rounded-bl px-3 pt-6 pb-2 w-[calc(100%-3rem)] border-r-0 focus:outline-none 
                      ${error && !value && !focused  ? "border-red-600" : focused ? "border-sky-400" : "border-gray-300"} ${value ? "border-gray-300" : "border-gray-300"} `}
        />
        <label
          htmlFor={name}
          className={`absolute left-3 top-1 ${error && !value ? "text-red-600" : focused ? "text-sky-500" : "text-gray-400"} ${value ? "text-gray-300" : "text-gray-300"} text-sm transition-all duration-200
                     peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                     peer-focus:top-1 peer-focus:text-sm peer-focus:text-sky-500 cursor-text`}
        >
          {label || placeholder}
        </label>

        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className={`absolute pr-2 right-0 h-full w-12 top-1/2 -translate-y-1/2 text-sm text-sky-600 hover:text-sky-700
                      border border-l-0 rounded-tr rounded-br ${error && !value && !focused  ? "border-red-600" : focused ? "border-sky-400" : "border-gray-300"} ${value ? "border-gray-300" : "border-gray-300"}`}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {error && <p className={`text-red-600 text-sm ${error && !value && !focused ? "text-red-600" : focused || value ? "hidden" : ""}`}>{error}</p>}
    </div>
  );
}

export default PasswordInput;
