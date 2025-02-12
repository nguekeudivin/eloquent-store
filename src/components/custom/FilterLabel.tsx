import { ChevronUp, ChevronDown } from "lucide-react";

interface FilterlabelProps {
  id: string;
  label: string;
  show: boolean;
  onToggle: () => void;
}

export default function FilterLabel({
  id,
  label,
  show,
  onToggle,
}: FilterlabelProps) {
  return (
    <button onClick={onToggle} className="flex items-center justify-between">
      <span className="font-medium">{label}</span>
      {/* <Label htmlFor={id}>{label}</Label>
      <button className="text-sm text-blue-500 hover:underline"></button> */}

      {show ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
  );
}
