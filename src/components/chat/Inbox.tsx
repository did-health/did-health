import React from 'react';

interface Message {
  from: string;
  content: string;
}

interface InboxProps {
  inbox: Message[];
}

export function Inbox({ inbox }: InboxProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">📥 Inbox</h2>
      {inbox.map((msg, i) => (
        <div key={i} className="border rounded p-2 text-sm">
          <p><strong>From:</strong> {msg.from}</p>
          <p>{msg.content}</p>
        </div>
      ))}
    </div>
  );
}
