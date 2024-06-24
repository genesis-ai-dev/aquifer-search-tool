import React from 'react';

interface ImageResourceProps {
  resource: ResourceResult;
}

const ImageResource: React.FC<ImageResourceProps> = ({ resource }) => {
  if (resource.grouping.mediaType !== 'Image' || !resource.content.url) {
    return <div>Invalid image resource</div>;
  }

  return (
    <div className="image-resource">
      <img
        src={resource.content.url}
        alt={resource.name}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <div
        className="image-metadata"
        style={{
          marginTop: '10px',
          fontSize: '0.9em',
          color: 'var(--vscode-descriptionForeground)',
        }}
      >
        <p>Title: {resource.name}</p>
        <p>License: {resource.grouping.licenseInfo.licenses[0].eng.name}</p>
        <p>Copyright: {resource.grouping.licenseInfo.copyright.holder.name}</p>
        {resource.grouping.licenseInfo.licenses[0].eng.url && (
          <p>
            License URL:{' '}
            <a
              href={resource.grouping.licenseInfo.licenses[0].eng.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {resource.grouping.licenseInfo.licenses[0].eng.url}
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageResource;
