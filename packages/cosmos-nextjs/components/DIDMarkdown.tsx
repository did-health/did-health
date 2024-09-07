import React from 'react';
import ReactMarkdown from 'react-markdown';

const DIDMarkdownComponent = (didDocument:  any) => {
  // Prepare the markdown content with the JSON string inside a code block
  const markdownContent = "```json\n" + JSON.stringify(didDocument, null, 2) + "\n```";

  return (
    <div>
      {/* Render the markdown content */}
      <ReactMarkdown>
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default DIDMarkdownComponent;