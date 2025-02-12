import { X } from "lucide-react";

interface ErrorsProps {
  errors: Record<string, string>;
  setErrors: any;
}

export default function Errors({ errors, setErrors }: ErrorsProps) {
  return (
    <div className="">
      {Object.entries(errors).map(
        ([key, value], index) =>
          value && (
            <div
              key={`errormessage${index}`}
              className="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-100 dark:bg-gray-800 dark:text-red-400"
              role="alert"
            >
              <div className="ms-3 text-sm font-medium">{value}</div>
              <button
                onClick={() =>
                  setErrors((prev: Record<string, string>) =>
                    Object.fromEntries(
                      Object.entries(prev).filter(([k, _]) => k != key)
                    )
                  )
                }
                type="button"
                className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8"
              >
                <X />
              </button>
            </div>
          )
      )}
    </div>
  );
}
