interface ChatEntry {
  user: string;
  bot: string;
}

interface ChatLogHistoryProps {
  chatLog: ChatEntry[];
}

export default function ChatLogHistory({ chatLog = [] }: ChatLogHistoryProps) {
  return (
    <div className="p-4 mt-4 max-w-3xl mx-auto">
      <h2 className="text-lg font-semibold mb-2">Conversation History</h2>
      <div className="bg-gray-100 p-4 rounded space-y-2">
        {chatLog.map((entry, i) => (
          <div key={i}>
            <p><strong>You:</strong> {entry.user}</p>
            <p><strong>AI:</strong> {entry.bot}</p>
          </div>
        ))}
      </div>
    </div>
  );
}