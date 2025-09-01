import React, { useEffect, useRef, useState, useCallback } from 'react';

interface EmbeddedFaceApiCameraProps {
  onEmotionDetected?: (emotions: any) => void;
}

const EmbeddedFaceApiCamera: React.FC<EmbeddedFaceApiCameraProps> = ({ onEmotionDetected }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Direct emotion handler - no debouncing for instant updates
  const handleEmotionUpdate = useCallback((emotions: any) => {
    // Instant update - no delays
    onEmotionDetected?.(emotions);
  }, [onEmotionDetected]);
  
  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Check origin for security
      if (event.origin !== window.location.origin) return;
      
      // Process emotion data
      if (event.data && event.data.type === 'FACE_API_EMOTION' && event.data.emotions) {
        handleEmotionUpdate(event.data.emotions);
      }
    };
    
    // Add message listener
    window.addEventListener('message', handleMessage);
    
    // Clean up
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleEmotionUpdate]);

  // Check if iframe loaded correctly
  useEffect(() => {
    const checkIframe = setTimeout(() => {
      if (iframeRef.current) {
        try {
          // Try to access iframe content (will throw if cross-origin)
          const iframeWindow = iframeRef.current.contentWindow;
          if (!iframeWindow) {
            setError('Failed to access iframe content');
          }
        } catch (e) {
          console.error('Error accessing iframe:', e);
          setError('Failed to load Face-API camera');
        }
      }
    }, 5000);

    return () => clearTimeout(checkIframe);
  }, []);
  
  return (
    <div className="camera-container w-full h-full" style={{ width: '100%', height: '240px', margin: '0 auto', overflow: 'hidden', position: 'relative' }}>
      {error && (
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'rgba(254, 226, 226, 0.9)',
          zIndex: 10,
          padding: '1rem'
        }}>
          <p style={{ fontWeight: 'bold', color: '#dc2626', marginBottom: '1rem' }}>{error}</p>
          <a 
            href="/face-api-direct/index.html" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Open Face-API Test Page
          </a>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src="/face-api-direct/index.html"
        title="Face-API Camera"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          overflow: 'hidden',
          objectFit: 'cover',
          transform: 'scaleX(-1)'
        }}
        allow="camera;microphone;fullscreen;autoplay"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
      />
    </div>
  );
};

export default EmbeddedFaceApiCamera; 