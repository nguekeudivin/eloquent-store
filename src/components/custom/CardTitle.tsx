interface CardTitleProps {
  label: string;
  action: any;
  count?: number;
}

export default function CardTitle({ label, action, count }: CardTitleProps) {
  return (
    <div className="justify-between flex  items-center">
      <h3 className="text-xl font-medium">
        {label}
        {count != undefined && (
          <span className="text-muted-foreground text-sm ml-2">({count})</span>
        )}
      </h3>
      <div>{action}</div>
    </div>
  );
}
