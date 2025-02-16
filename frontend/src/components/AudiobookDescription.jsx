import React from 'react';

function AudiobookDescription({ description }) {
  // Split the description into parts
  const parts = description.split('\n\n');
  const metadata = parts[0].split('\n');
  const htmlContent = parts[1];

  // Parse metadata
  const authors = metadata[0].replace('Author(s): ', '');
  const narrators = metadata[1].replace('Narrator(s): ', '');

  return (
    <div>
      <p><strong>Author(s):</strong> {authors}</p>
      <p><strong>Narrator(s):</strong> {narrators}</p>
      <div>
        {/* dangerouslySetInnerHTML for rendering the HTML content */}
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </div>
  );
}

export default AudiobookDescription;