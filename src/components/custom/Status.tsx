const statusColors: Record<string, string[]> = {
  Open: ["#EAF5BB", "#97C220"],
  Closed: ["#FDF4F3", "#ED5147"],
  Draft: ["#F3F4F6", "#4B5563"],
};

interface StatusProps {
  status: string;
}

export default function Status({ status }: StatusProps) {
  return (
    <div
      className="px-3 py-1 rounded-lg flex items-center space-x-2"
      style={{
        backgroundColor: statusColors[status][0],
      }}
    >
      <span
        className="block w-2 h-2 rounded-full"
        style={{ backgroundColor: statusColors[status][1] }}
      ></span>
      <div>{status} </div>
    </div>
  );
}
