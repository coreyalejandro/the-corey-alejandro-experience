interface DebugPanelProps {
  debug: string[];
}

export default function DebugPanel({ debug = [] }: DebugPanelProps) {
  return (
    <div className="bg-black text-green-300 text-xs p-2 max-w-4xl mx-auto mt-4 rounded font-mono h-32 overflow-y-auto">
      {debug.map((line, i) => <div key={i}>{line}</div>)}
    </div>
  );
}