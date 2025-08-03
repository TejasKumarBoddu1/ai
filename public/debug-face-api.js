// Debug script to check Face-API loading status
(function() {
  console.log('🔍 Debug Face-API script running...');
  
  // Check if Face-API is loaded
  function checkFaceApi() {
    if (window.faceapi) {
      console.log('✅ Face-API is loaded!', window.faceapi);
      
      // Check if models are available
      try {
        const modelStatus = {
          tinyFaceDetector: window.faceapi.nets.tinyFaceDetector.isLoaded,
          faceLandmark68: window.faceapi.nets.faceLandmark68Net.isLoaded,
          faceRecognition: window.faceapi.nets.faceRecognitionNet.isLoaded,
          faceExpression: window.faceapi.nets.faceExpressionNet.isLoaded,
          ageGender: window.faceapi.nets.ageGenderNet.isLoaded
        };
        
        console.log('📊 Face-API model status:', modelStatus);
      } catch (e) {
        console.error('❌ Error checking Face-API models:', e);
      }
    } else {
      console.error('❌ Face-API is not loaded!');
      
      // Try to load it
      console.log('🔄 Attempting to load Face-API...');
      const script = document.createElement('script');
      script.src = '/face-api.min.js';
      script.async = true;
      
      script.onload = function() {
        console.log('✅ Face-API loaded successfully via debug script!');
        setTimeout(checkFaceApi, 500); // Check again after loading
      };
      
      script.onerror = function(e) {
        console.error('❌ Failed to load Face-API:', e);
      };
      
      document.head.appendChild(script);
    }
  }
  
  // Check Face-API status after a short delay
  setTimeout(checkFaceApi, 1000);
  
  // Add a global function to check Face-API status
  window.debugFaceApi = function() {
    console.log('🔍 Manual Face-API check triggered');
    checkFaceApi();
  };
  
  // Add a global function to load models
  window.loadFaceApiModels = async function() {
    if (!window.faceapi) {
      console.error('❌ Face-API not available, cannot load models');
      return;
    }
    
    console.log('🔄 Loading Face-API models...');
    
    try {
      await Promise.all([
        window.faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        window.faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        window.faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        window.faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        window.faceapi.nets.ageGenderNet.loadFromUri('/models'),
      ]);
      
      console.log('✅ Face-API models loaded successfully!');
      checkFaceApi(); // Check status after loading
    } catch (error) {
      console.error('❌ Error loading Face-API models:', error);
    }
  };
  
  console.log('🔧 Debug tools added. Use window.debugFaceApi() to check status and window.loadFaceApiModels() to load models.');
})(); 