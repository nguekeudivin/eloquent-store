import { cn } from "@/lib/utils";

interface CardProps {
  children: any;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={cn("h-full w-full p-6 bg-white rounded-lg", className)}>
      <div> {children}</div>
    </div>
  );
}
