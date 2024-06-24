import React from 'react';

interface MediaTypeTagProps {
  mediaType: MediaType;
}

const MediaTypeTag: React.FC<MediaTypeTagProps> = ({ mediaType }) => {
  let tagColor = '';
  let iconClass = '';

  switch (mediaType) {
    case 'Text':
      tagColor = 'var(--vscode-charts-foreground)';
      iconClass = 'codicon-file-text';
      break;
    case 'Audio':
      tagColor = 'var(--vscode-charts-green)';
      iconClass = 'codicon-file-media';
      break;
    case 'Video':
      tagColor = 'var(--vscode-charts-red)';
      iconClass = 'codicon-device-camera-video';
      break;
    case 'Image':
      tagColor = 'var(--vscode-charts-yellow)';
      iconClass = 'codicon-file-media';
      break;
    default:
      tagColor = 'var(--vscode-badge-background)';
      iconClass = 'codicon-file';
      break;
  }

  return (
    <div style={{ color: tagColor, display: 'flex', alignItems: 'center' }}>
      <i className={`codicon ${iconClass}`} style={{ marginRight: '5px' }}></i>
      {mediaType}
    </div>
  );
};

export default MediaTypeTag;
