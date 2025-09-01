import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';

const TensorFlowDebug: React.FC = () => {
  const [tfStatus, setTfStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [modelStatus, setModelStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [tfVersion, setTfVersion] = useState<string>('');
  const [backend, setBackend] = useState<string>('');
  const [tfError, setTfError] = useState<string>('');
  const [modelError, setModelError] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    testTensorFlow();
  }, []);

  const testTensorFlow = async () => {
    try {
      setTfStatus('loading');
      setTfError('');
      addLog('Testing TensorFlow.js...');
      
      // Check if tf is available
      if (!tf) {
        throw new Error('TensorFlow.js is not available');
      }

      // Get version
      setTfVersion(tf.version.tfjs || 'Unknown');
      addLog(`TensorFlow.js version: ${tf.version.tfjs || 'Unknown'}`);

      // Initialize backend
      addLog('Initializing TensorFlow.js backend...');
      await tf.ready();
      const currentBackend = tf.getBackend();
      setBackend(currentBackend);
      addLog(`TensorFlow.js backend: ${currentBackend}`);

      // Test basic tensor operations
      addLog('Testing basic tensor operations...');
      const tensor = tf.tensor([1, 2, 3, 4]);
      const result = tensor.square().dataSync();
      addLog(`Test tensor operation result: ${Array.from(result)}`);
      tensor.dispose();

      setTfStatus('success');
      addLog('TensorFlow.js test completed successfully');
    } catch (err: any) {
      console.error('TensorFlow.js test failed:', err);
      setTfError(err.message);
      setTfStatus('error');
      addLog(`TensorFlow.js test failed: ${err.message}`);
    }
  };

  const testCocoSSD = async () => {
    try {
      setModelStatus('loading');
      setModelError('');
      addLog('Testing coco-ssd model loading...');
      
      if (tfStatus !== 'success') {
        throw new Error('TensorFlow.js must be working first');
      }

      addLog('Loading coco-ssd model...');
      const model = await cocossd.load();
      
      if (!model) {
        throw new Error('Model failed to load');
      }

      addLog('coco-ssd model loaded successfully');
      addLog(`Model type: ${typeof model}`);
      addLog(`Model methods: ${Object.keys(model).join(', ')}`);

      setModelStatus('success');
    } catch (err: any) {
      console.error('coco-ssd test failed:', err);
      setModelError(err.message);
      setModelStatus('error');
      addLog(`coco-ssd test failed: ${err.message}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">TensorFlow.js Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TensorFlow.js Test */}
        <Card>
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
                  <p className="mt-2 text-sm">{tfError}</p>
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={testTensorFlow} variant="outline" size="sm">
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry Test
            </Button>
          </CardContent>
        </Card>

        {/* Coco-SSD Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5" />
              Coco-SSD Model Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {modelStatus === 'idle' && (
              <div className="text-gray-500">
                Click "Test Model" to load coco-ssd
              </div>
            )}

            {modelStatus === 'loading' && (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading coco-ssd model...</span>
              </div>
            )}

            {modelStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>coco-ssd model loaded successfully!</span>
              </div>
            )}

            {modelStatus === 'error' && (
              <Alert variant="destructive">
                <AlertDescription>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    <span>coco-ssd test failed</span>
                  </div>
                  <p className="mt-2 text-sm">{modelError}</p>
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={testCocoSSD} 
              variant="outline" 
              size="sm"
              disabled={tfStatus !== 'success'}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Test Model
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Debug Logs</span>
            <Button onClick={clearLogs} variant="outline" size="sm">
              Clear Logs
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TensorFlowDebug; 