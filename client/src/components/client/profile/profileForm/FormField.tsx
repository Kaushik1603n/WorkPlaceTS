import type{ ChangeEvent } from "react";

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  placeholder?: string;
  rows?: number;
}

export default function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  rows,
}: FormFieldProps) {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-1">{label}</label>
      {type === "textarea" ? (
        <textarea
          name={name}
          rows={rows || 4}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border border-[#27AE60] rounded-md px-3 py-2 focus:ring-green-500 focus:outline-none focus:border-green-500"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border border-[#27AE60] rounded-md px-3 py-2 focus:ring-green-500 focus:outline-none focus:border-green-500"
        />
      )}
    </div>
  );
}