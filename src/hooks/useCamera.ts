
import { useEffect, RefObject } from "react";

export const useCamera = (videoRef: RefObject<HTMLVideoElement>) => {
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        console.log("🎥 Requesting camera access...");
        
        // Check if getUserMedia is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error("❌ getUserMedia not supported");
          return;
        }

        // Don't stop existing stream if video is already working
        if (videoRef.current?.srcObject) {
          const existingStream = videoRef.current.srcObject as MediaStream;
          const isStreamActive = existingStream.getVideoTracks().some(track => track.readyState === 'live');
          
          if (isStreamActive) {
            console.log("📹 Camera already active, reusing stream");
            currentStream = existingStream;
            return;
          } else {
            // Only stop if stream is dead
            existingStream.getTracks().forEach(track => {
              track.stop();
              console.log(`🛑 Stopped existing ${track.kind} track`);
            });
            videoRef.current.srcObject = null;
          }
        }

        // Request camera access with specific constraints
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 640, max: 1280 },
            height: { ideal: 480, max: 720 },
            frameRate: { ideal: 30, max: 60 },
            facingMode: 'user'
          },
          audio: false,
        });
        currentStream = stream;
        
        console.log("✅ Camera stream obtained successfully");
        console.log("📊 Stream tracks:", stream.getTracks().map(track => ({
          kind: track.kind,
          label: track.label,
          readyState: track.readyState,
          enabled: track.enabled
        })));
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Set up event handlers
          const video = videoRef.current;
          
          video.onloadedmetadata = () => {
            console.log("📹 Video metadata loaded");
            console.log(`📐 Video dimensions: ${video.videoWidth}x${video.videoHeight}`);
          };

          video.oncanplay = () => {
            console.log("🎬 Video can start playing");
            video.play().then(() => {
              console.log("▶️ Video playback started successfully");
            }).catch(e => {
              console.error("❌ Video play error:", e);
            });
          };

          video.onerror = (e) => {
            console.error("❌ Video element error:", e);
          };

          // Try to play immediately if metadata is already loaded
          if (video.readyState >= 1) {
            video.play().catch(e => {
              console.error("❌ Initial play attempt failed:", e);
            });
          }
        }
      } catch (error: any) {
        console.error("❌ Camera access error:", error);
        
        // Provide specific error messages
        if (error.name === 'NotAllowedError') {
          console.error("🚫 Camera permission denied by user");
        } else if (error.name === 'NotFoundError') {
          console.error("📷 No camera device found");
        } else if (error.name === 'NotReadableError') {
          console.error("🔒 Camera is already in use by another application");
        } else if (error.name === 'OverconstrainedError') {
          console.error("⚙️ Camera constraints cannot be satisfied");
        } else {
          console.error("🔧 General camera error:", error.message);
        }
      }
    };

    const checkPermissionAndStart = async () => {
      // Check if the Permissions API is available.
      console.log("navigator permissions: ", navigator.permissions);
      if (navigator.permissions) {
        try {
          // Query the current camera permission status.
          const permissionStatus = await navigator.permissions.query({ name: "camera" as PermissionName });
          console.log("Camera permission state:", permissionStatus.state);

          // Optionally, listen for changes in permission state.
          permissionStatus.onchange = () => {
            console.log("Camera permission state changed:", permissionStatus.state);
          };

          // If permission is granted or the browser is prompting, start the camera.
          if (permissionStatus.state === "granted" || permissionStatus.state === "prompt") {
            console.log("✅ Starting camera")
            startCamera();
          } else {
            console.warn("Camera permission is denied.");
          }
        } catch (err) {
          console.error("Error checking camera permission:", err);
          // Fallback to directly starting the camera if the Permissions API fails.
          console.log("❌ Failed to check camera permissions");
          startCamera();
        }
      } else {
        // Fallback for browsers that don't support the Permissions API.
        console.log("❌ Browser does not support permissions api");
        startCamera();
      }
    };

    // Start camera with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(checkPermissionAndStart, 100);

    return () => {
      console.log("🔄 Cleaning up camera resources...");
      clearTimeout(timeoutId);
      
      if (currentStream) {
        currentStream.getTracks().forEach(track => {
          track.stop();
          console.log(`🛑 Stopped ${track.kind} track during cleanup`);
        });
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  // Return camera status checking function
  const checkCameraStatus = () => {
    const video = videoRef.current;
    if (!video) return { ready: false, playing: false, hasStream: false };

    return {
      ready: video.readyState >= 2,
      playing: !video.paused && !video.ended && video.readyState > 2,
      hasStream: !!video.srcObject
    };
  };

  return { checkCameraStatus };
};
