import React from 'react';

interface YouTubeFrameProps {
  videoId: string; // YouTube video ID (e.g., "dQw4w9WgXcQ")
  width?: string; // Optional width, default to "100%"
  height?: string; // Optional height, default to "315"
}

const YouTubeFrame: React.FC<YouTubeFrameProps> = ({
  videoId,
  width = '100%',
  height = '1200',
}) => {
  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default YouTubeFrame;
