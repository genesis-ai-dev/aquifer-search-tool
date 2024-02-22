import React from 'react';

interface MediaTypeTagProps {
  mediaType: MediaType;
}

const MediaTypeTag: React.FC<MediaTypeTagProps> = ({ mediaType }) => {
  let tagColor = '';
  switch (mediaType) {
    case 'Text':
      tagColor = 'var(--vscode-charts-foreground)';
      break;
    case 'Audio':
      tagColor = 'var(--vscode-charts-green)';
      break;
    case 'Video':
      tagColor = 'var(--vscode-charts-red)';
      break;
    case 'Image':
      tagColor = 'var(--vscode-charts-yellow)';
      break;
    default:
      tagColor = 'var(--vscode-badge-background)';
      break;
  }
  return (
    <div color={tagColor}>
      {mediaType}
      <i
        className="codicon codicon-file-media"
        style={{ marginLeft: '5px' }}
      ></i>
    </div>
  );
};

export default MediaTypeTag;
