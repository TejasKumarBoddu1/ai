
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from './utils/queryClient'
import App from './App.tsx'
import './index.css'
import './styles/home.css'
import './styles/camera.css'

// Function to ensure Face-API is loaded
const ensureFaceApi = async () => {
  // Check if Face-API is loaded
  if (!(window as any).faceapi) {
    console.warn('Face-API not detected, attempting to load it dynamically');
    try {
      // Create script element
      const script = document.createElement('script');
      script.src = '/face-api.min.js';
      script.async = true;
      
      // Wait for script to load
      await new Promise<void>((resolve, reject) => {
        script.onload = () => {
          console.log('Face-API loaded dynamically');
          resolve();
        };
        script.onerror = (e) => {
          console.error('Failed to load Face-API:', e);
          reject(new Error('Failed to load Face-API'));
        };
        document.head.appendChild(script);
      });
    } catch (error) {
      console.error('Error loading Face-API:', error);
    }
  } else {
    console.log('Face-API already loaded');
  }
};

const queryClient = createQueryClient();

// Ensure Face-API is loaded before rendering the app
ensureFaceApi().then(() => {
  createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
});
