import { MoreVertical, User } from 'lucide-react';

const MOCK_CHAT_HISTORY = [
  { id: 1, title: 'Getting started with AI', date: '2024-01-15' },
  { id: 2, title: 'TypeScript best practices', date: '2024-01-14' },
  { id: 3, title: 'Next.js deployment guide', date: '2024-01-13' },
  { id: 4, title: 'Database optimization', date: '2024-01-12' },
];

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      {/* Chat History Section */}
      <div className="flex-1 p-4">
        <h2 className="text-lg font-semibold mb-4">Chat History</h2>
        <div className="space-y-2">
          {MOCK_CHAT_HISTORY.map((chat) => (
            <div
              key={chat.id}
              className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <h3 className="text-sm font-medium truncate">{chat.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{chat.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <span className="text-sm font-medium">User Name</span>
          </div>
          <button className="p-1 hover:bg-gray-700 rounded">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}