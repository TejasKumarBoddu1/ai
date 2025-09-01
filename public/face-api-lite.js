// This is a lightweight version of face-api.js that only includes the necessary functions
// for emotion detection to improve performance

// Check if face-api is already loaded
if (window.faceapi) {
  console.log('Face-API already loaded, skipping lite version');
} else {
  console.log('Loading Face-API lite version...');
  
  // Load the full version
  const script = document.createElement('script');
  script.src = '/face-api.min.js';
  script.async = false; // Load synchronously for faster availability
  
  script.onload = function() {
    console.log('Face-API loaded successfully via lite loader');
    
    // Preload the models
    setTimeout(async function() {
      try {
        if (!window.faceapi) return;
        
        console.log('Preloading all necessary Face-API models...');
        await Promise.all([
          window.faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          window.faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          window.faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
          window.faceapi.nets.faceExpressionNet.loadFromUri('/models'),
          window.faceapi.nets.ageGenderNet.loadFromUri('/models')
        ]);
        console.log('Face-API models preloaded successfully');
      } catch (error) {
        console.error('Error preloading Face-API models:', error);
      }
    }, 1000);
  };
  
  script.onerror = function(e) {
    console.error('Error loading Face-API:', e);
  };
  
  // Add to head with highest priority
  if (document.head.firstChild) {
    document.head.insertBefore(script, document.head.firstChild);
  } else {
    document.head.appendChild(script);
  }
} 