'use client';

import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    const userMessage = message;
    setMessage('');
    setChat(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: chat }),
      });
      const data = await res.json();
      setChat(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setChat(prev => [...prev, { role: 'assistant', content: 'Error: Failed to get response' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 p-4 dark:bg-black">
      <h1 className="mb-4 text-2xl font-bold">Chat with Gemini</h1>
      
      <div className="flex w-full max-w-2xl flex-col gap-2 overflow-y-auto rounded-lg border p-4 dark:border-zinc-700" style={{ height: '60vh' }}>
        {chat.length === 0 && <p className="text-zinc-500">Start a conversation...</p>}
        {chat.map((msg, i) => (
          <div key={i} className={`rounded p-2 ${msg.role === 'user' ? 'bg-blue-100 dark:bg-blue-900 ml-auto' : 'bg-gray-100 dark:bg-gray-800'} max-w-[80%]`}>
            <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
          </div>
        ))}
        {loading && <p className="text-zinc-500">Thinking...</p>}
      </div>

      <div className="mt-4 flex w-full max-w-2xl gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 rounded-lg border p-2 dark:border-zinc-700 dark:bg-zinc-800"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
