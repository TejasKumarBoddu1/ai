const video = document.getElementById("video");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
  faceapi.nets.ageGenderNet.loadFromUri("/models"),
]).then(webCam);

function webCam() {
  navigator.mediaDevices
    .getUserMedia({
      video: {
        width: { ideal: 320 }, // Lower resolution for better performance
        height: { ideal: 240 },
        facingMode: "user",
        frameRate: { ideal: 10 } // Lower framerate for better performance
      },
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      console.log(error);
    });
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  
  // Position the canvas absolutely over the video
  canvas.style.position = 'absolute';
  canvas.style.top = video.offsetTop + 'px';
  canvas.style.left = video.offsetLeft + 'px';

  // Update canvas dimensions to match video
  const updateCanvasSize = () => {
    const displaySize = { width: video.offsetWidth, height: video.offsetHeight };
    canvas.width = displaySize.width;
    canvas.height = displaySize.height;
    faceapi.matchDimensions(canvas, displaySize);
  };
  
  // Initial size setup
  updateCanvasSize();
  
  // Update size on window resize with debounce
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateCanvasSize, 200);
  });

  // Store last detection results for smoother performance
  let lastDetections = null;
  let detectionCounter = 0;
  let lastEmotionData = null;
  let emotionUpdateCounter = 0;

  // Optimized detection interval - reduced frequency for better performance
  setInterval(async () => {
    try {
      detectionCounter++;
      
      // Only run full detection every 5 frames for better performance
      // Use cached results for intermediate frames
      if (detectionCounter % 5 === 0) {
        // Detect faces with optimized settings
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({
            inputSize: 224, // Smaller input size for better performance
            scoreThreshold: 0.6 // Higher threshold to reduce false positives
          }))
          .withFaceExpressions()
          .withAgeAndGender();
          
        if (detections && detections.length > 0) {
          lastDetections = detections;
        }
      }
      
      // Skip rendering if no detections available
      if (!lastDetections) return;
      
      // Clear canvas less frequently for better performance
      if (detectionCounter % 2 === 0) {
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      }

      // Get current display size
      const displaySize = { width: video.offsetWidth, height: video.offsetHeight };
      
      // Resize results to match current display size
      const resizedDetections = faceapi.resizeResults(lastDetections, displaySize);

      // Draw only essential elements for better performance
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

      resizedDetections.forEach((detection) => {
        const box = detection.detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, {
          label: Math.round(detection.age) + " years, " + detection.gender,
        });
        drawBox.draw(canvas);
      });

      // Send emotion data to parent window if in iframe - optimized frequency
      if (window.parent && window.parent !== window && resizedDetections.length > 0) {
        emotionUpdateCounter++;
        
        // Only send emotion data every 3 frames to reduce lag
        if (emotionUpdateCounter % 3 === 0) {
          const detection = resizedDetections[0];
          const expressions = detection.expressions;
          
          // Find dominant emotion
          const emotionEntries = Object.entries(expressions);
          const [dominantEmotion, confidence] = emotionEntries.reduce((max, current) => 
            current[1] > max[1] ? current : max
          );

          const emotionIcons = {
            happy: '😊',
            sad: '😢',
            surprised: '😮',
            neutral: '😐',
            disgusted: '🤢',
            angry: '😠',
            fearful: '😨'
          };

          // Create emotion data
          const emotionData = {
            dominant: dominantEmotion,
            confidence: confidence,
            scores: {
              happy: expressions.happy || 0,
              sad: expressions.sad || 0,
              surprised: expressions.surprised || 0,
              neutral: expressions.neutral || 0,
              disgusted: expressions.disgusted || 0,
              angry: expressions.angry || 0,
              fearful: expressions.fearful || 0
            },
            icon: emotionIcons[dominantEmotion] || '😐',
            age: detection.age,
            gender: detection.gender
          };

          // Only send if data has changed significantly to reduce unnecessary updates
          if (!lastEmotionData || 
              Math.abs(lastEmotionData.confidence - confidence) > 0.1 ||
              lastEmotionData.dominant !== dominantEmotion) {
            
            lastEmotionData = emotionData;
            
            // Send to parent
            window.parent.postMessage({
              type: 'FACE_API_EMOTION',
              emotions: emotionData
            }, '*');
          }
        }
      }
    } catch (error) {
      console.error('Face detection error:', error);
    }
  }, 150); // Increased interval for better performance
});
