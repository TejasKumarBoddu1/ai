import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export const TensorFlowTest: React.FC = () => {
  const [tfStatus, setTfStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [tfVersion, setTfVersion] = useState<string>('');
  const [backend, setBackend] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    testTensorFlow();
  }, []);

  const testTensorFlow = async () => {
    try {
      console.log('Testing TensorFlow.js...');
      
      // Check if tf is available
      if (!tf) {
        throw new Error('TensorFlow.js is not available');
      }

      // Get version
      setTfVersion(tf.version);
      console.log('TensorFlow.js version:', tf.version);

      // Initialize backend
      await tf.ready();
      const currentBackend = tf.getBackend();
      setBackend(currentBackend);
      console.log('TensorFlow.js backend:', currentBackend);

      // Test basic tensor operations
      const tensor = tf.tensor([1, 2, 3, 4]);
      const result = tensor.square().dataSync();
      console.log('Test tensor operation result:', result);
      tensor.dispose();

      setTfStatus('success');
    } catch (err: any) {
      console.error('TensorFlow.js test failed:', err);
      setError(err.message);
      setTfStatus('error');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Loader2 className="h-5 w-5" />
          TensorFlow.js Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tfStatus === 'loading' && (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Testing TensorFlow.js...</span>
          </div>
        )}

        {tfStatus === 'success' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>TensorFlow.js is working!</span>
            </div>
            <div className="space-y-1 text-sm">
              <div>Version: <Badge variant="outline">{tfVersion}</Badge></div>
              <div>Backend: <Badge variant="outline">{backend}</Badge></div>
            </div>
          </div>
        )}

        {tfStatus === 'error' && (
          <Alert variant="destructive">
            <AlertDescription>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                <span>TensorFlow.js test failed</span>
              </div>
              <p className="mt-2 text-sm">{error}</p>
            </AlertDescription>
          </Alert>
        )}

        <Button onClick={testTensorFlow} variant="outline" size="sm">
          Retry Test
        </Button>
      </CardContent>
    </Card>
  );
};

export default TensorFlowTest; 