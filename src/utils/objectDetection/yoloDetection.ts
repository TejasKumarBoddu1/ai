
import * as tf from '@tensorflow/tfjs';

export interface DetectedObject {
  class: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
}

export interface ObjectDetectionResult {
  phones: DetectedObject[];
  people: DetectedObject[];
  otherObjects: DetectedObject[];
}

export class YOLOv8Detector {
  private model: tf.GraphModel | null = null;
  private isLoaded = false;

  async loadModel(): Promise<void> {
    try {
      // Load YOLOv8n model (you'll need to host this model file)
      this.model = await tf.loadGraphModel('/models/yolov8n.json');
      this.isLoaded = true;
      console.log('YOLOv8n model loaded successfully');
    } catch (error) {
      console.error('Failed to load YOLOv8n model:', error);
      // Fallback: simulate detection for demo purposes
      this.isLoaded = false;
    }
  }

  async detectObjects(canvas: HTMLCanvasElement): Promise<ObjectDetectionResult> {
    if (!this.isLoaded || !this.model) {
      // Fallback simulation for demo
      return this.simulateDetection();
    }

    try {
      // Preprocess image
      const tensor = tf.browser.fromPixels(canvas)
        .resizeNearestNeighbor([640, 640])
        .expandDims(0)
        .div(255.0);

      // Run inference
      const predictions = await this.model.predict(tensor) as tf.Tensor;
      const resultsData = await predictions.data();
      
      // Ensure we have Float32Array
      const results = resultsData instanceof Float32Array 
        ? resultsData 
        : new Float32Array(resultsData);

      // Post-process results
      return this.processDetections(results, canvas.width, canvas.height);
    } catch (error) {
      console.error('Object detection error:', error);
      return { phones: [], people: [], otherObjects: [] };
    }
  }

  private processDetections(results: Float32Array, width: number, height: number): ObjectDetectionResult {
    const phones: DetectedObject[] = [];
    const people: DetectedObject[] = [];
    const otherObjects: DetectedObject[] = [];

    // YOLO output processing (simplified)
    // In a real implementation, you'd parse the actual YOLO output format
    for (let i = 0; i < results.length; i += 6) {
      const confidence = results[i + 4];
      const classId = Math.round(results[i + 5]);
      
      if (confidence > 0.5) {
        const bbox: [number, number, number, number] = [
          results[i] * width,     // x
          results[i + 1] * height, // y
          results[i + 2] * width,  // width
          results[i + 3] * height  // height
        ];

        const detection: DetectedObject = {
          class: this.getClassName(classId),
          confidence,
          bbox
        };

        if (classId === 67) { // cell phone class in COCO
          phones.push(detection);
        } else if (classId === 0) { // person class
          people.push(detection);
        } else {
          otherObjects.push(detection);
        }
      }
    }

    return { phones, people, otherObjects };
  }

  private getClassName(classId: number): string {
    const classes = ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone'];
    return classes[classId] || 'unknown';
  }

  private simulateDetection(): ObjectDetectionResult {
    // Simulate random detections for demo purposes
    const random = Math.random();
    
    return {
      phones: random > 0.9 ? [{
        class: 'cell phone',
        confidence: 0.8,
        bbox: [100, 100, 50, 100]
      }] : [],
      people: random > 0.95 ? [{
        class: 'person',
        confidence: 0.9,
        bbox: [200, 50, 150, 300]
      }] : [],
      otherObjects: []
    };
  }
}

export const yoloDetector = new YOLOv8Detector();
