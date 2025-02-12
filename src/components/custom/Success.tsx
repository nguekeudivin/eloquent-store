import { X } from "lucide-react";

interface ErrorsProps {
  success: Record<string, string>;
  setSuccess: any;
}

export default function Success({ success, setSuccess }: ErrorsProps) {
  return (
    <div className="">
      {Object.entries(success).map(
        ([key, value], index) =>
          value && (
            <div
              key={`successmessage${index}`}
              className="flex items-center p-4 mb-4 text-green-800 rounded-lg bg-green-100"
              role="alert"
            >
              <div className="ms-3 text-sm font-medium">{value}</div>
              <button
                onClick={() =>
                  setSuccess((prev: Record<string, string>) =>
                    Object.fromEntries(
                      Object.entries(prev).filter(([k, _]) => k != key)
                    )
                  )
                }
                type="button"
                className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-green-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8"
              >
                <X />
              </button>
            </div>
          )
      )}
    </div>
  );
}
