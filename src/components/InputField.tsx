import * as React from "react";
import { cn } from "@/lib/utils";

interface InputFieldProps extends React.ComponentProps<"input"> {
  inputClassName?: string;
  labelClassName?: string;
  inputLabel?: string;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      className,
      type = "text",
      inputClassName,
      labelClassName,
      inputLabel,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("relative z-0", className)}>
        <input
          type={type}
          className={cn(
            "autofill:selection:bg-transparent block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
            inputClassName
          )}
          ref={ref}
          spellCheck={false}
          placeholder=""
          {...props}
        />
        <label
          className={cn(
            "absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto",
            labelClassName
          )}
        >
          {inputLabel}
        </label>
      </div>
    );
  }
);

InputField.displayName = "InputField";

export { InputField };
