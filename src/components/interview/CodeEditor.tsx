import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Play, 
  Save, 
  Download, 
  Eye, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Copy,
  RotateCcw,
  Settings,
  Terminal
} from 'lucide-react';

interface CodeChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  initialCode: string;
  testCases: TestCase[];
  timeLimit: number; // in minutes
}

interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

interface CodeEditorProps {
  onCodeReview?: (code: string, analysis: string) => void;
  isInterviewActive?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  onCodeReview, 
  isInterviewActive = false 
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<CodeChallenge | null>(null);
  const [showOutput, setShowOutput] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Sample coding challenges
  const challenges: CodeChallenge[] = [
    {
      id: '1',
      title: 'Reverse String',
      description: 'Write a function that reverses a string without using built-in reverse methods.',
      difficulty: 'easy',
      language: 'javascript',
      timeLimit: 10,
      initialCode: `function reverseString(str) {
  // Your code here
  return str;
}

// Test your function
console.log(reverseString("hello")); // Should output: "olleh"
console.log(reverseString("world")); // Should output: "dlrow"`,
      testCases: [
        { input: '"hello"', expectedOutput: '"olleh"', description: 'Basic string reversal' },
        { input: '"world"', expectedOutput: '"dlrow"', description: 'Another basic test' },
        { input: '""', expectedOutput: '""', description: 'Empty string test' }
      ]
    },
    {
      id: '2',
      title: 'Find Missing Number',
      description: 'Given an array containing n distinct numbers taken from 0 to n, find the missing number.',
      difficulty: 'medium',
      language: 'javascript',
      timeLimit: 15,
      initialCode: `function findMissingNumber(nums) {
  // Your code here
  return 0;
}

// Test your function
console.log(findMissingNumber([3, 0, 1])); // Should output: 2
console.log(findMissingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1])); // Should output: 8`,
      testCases: [
        { input: '[3, 0, 1]', expectedOutput: '2', description: 'Missing number is 2' },
        { input: '[9, 6, 4, 2, 3, 5, 7, 0, 1]', expectedOutput: '8', description: 'Missing number is 8' },
        { input: '[0]', expectedOutput: '1', description: 'Missing number is 1' }
      ]
    },
    {
      id: '3',
      title: 'Valid Parentheses',
      description: 'Given a string containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
      difficulty: 'hard',
      language: 'javascript',
      timeLimit: 20,
      initialCode: `function isValid(s) {
  // Your code here
  return false;
}

// Test your function
console.log(isValid("()")); // Should output: true
console.log(isValid("()[]{}")); // Should output: true
console.log(isValid("(]")); // Should output: false`,
      testCases: [
        { input: '"()"', expectedOutput: 'true', description: 'Simple parentheses' },
        { input: '"()[]{}"', expectedOutput: 'true', description: 'Mixed brackets' },
        { input: '"(]"', expectedOutput: 'false', description: 'Invalid brackets' },
        { input: '"([)]"', expectedOutput: 'false', description: 'Invalid order' }
      ]
    }
  ];

  useEffect(() => {
    if (selectedChallenge) {
      setCode(selectedChallenge.initialCode);
      setOutput('');
      setTestResults([]);
      setExecutionTime(0);
    }
  }, [selectedChallenge]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && code) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(`code_${selectedChallenge?.id || 'default'}`, code);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [code, autoSave, selectedChallenge]);

  // Load saved code
  useEffect(() => {
    if (selectedChallenge) {
      const savedCode = localStorage.getItem(`code_${selectedChallenge.id}`);
      if (savedCode) {
        setCode(savedCode);
      }
    }
  }, [selectedChallenge]);

  const runCode = async () => {
    if (!code.trim()) return;

    setIsRunning(true);
    setShowOutput(true);
    const startTime = Date.now();

    try {
      // Create a safe execution environment
      const safeEval = new Function(`
        const console = {
          log: (...args) => {
            window.outputLog.push(args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' '));
          }
        };
        ${code}
      `);

      // Capture console output
      (window as any).outputLog = [];
      safeEval();
      const logs = (window as any).outputLog;
      setOutput(logs.join('\n'));
      setExecutionTime(Date.now() - startTime);

      // Run test cases if available
      if (selectedChallenge) {
        await runTestCases();
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runTestCases = async () => {
    if (!selectedChallenge) return;

    const results = [];
    for (const testCase of selectedChallenge.testCases) {
      try {
        // Create test function
        const testFunction = new Function(`
          ${code}
          return ${testCase.input.includes('[') ? 
            `findMissingNumber(${testCase.input})` : 
            testCase.input.includes('"') ? 
              `reverseString(${testCase.input})` :
              `isValid(${testCase.input})`
          };
        `);

        const result = testFunction();
        const expected = testCase.expectedOutput.includes('"') ? 
          testCase.expectedOutput.slice(1, -1) : 
          testCase.expectedOutput;

        results.push({
          testCase,
          passed: String(result) === expected,
          actual: result,
          expected: expected
        });
      } catch (error) {
        results.push({
          testCase,
          passed: false,
          actual: 'Error',
          expected: testCase.expectedOutput,
          error: error.message
        });
      }
    }
    setTestResults(results);
  };

  const analyzeCode = async () => {
    if (!code.trim() || !onCodeReview) return;

    setIsAnalyzing(true);
    try {
      // Simulate AI code analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysis = generateCodeAnalysis(code, selectedChallenge);
      onCodeReview(code, analysis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateCodeAnalysis = (code: string, challenge: CodeChallenge | null): string => {
    const lines = code.split('\n').length;
    const complexity = lines > 50 ? 'High' : lines > 20 ? 'Medium' : 'Low';
    
    return `💻 **Code Analysis for ${challenge?.title || 'Current Code'}**\n\n**Code Metrics:**\n• Lines of Code: ${lines}\n• Complexity: ${complexity}\n• Language: ${selectedLanguage}\n\n**Code Quality Assessment:**\n• Structure: ${code.includes('function') ? 'Good function organization' : 'Could use more functions'}\n• Readability: ${code.includes('//') ? 'Good comments' : 'Could use more comments'}\n• Efficiency: ${code.includes('for') || code.includes('while') ? 'Uses loops appropriately' : 'Consider algorithm efficiency'}\n\n**Suggestions:**\n• Add more error handling\n• Consider edge cases\n• Add input validation\n• Improve variable naming\n\n**Overall Rating:** 7.5/10`;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || colors.easy;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  const resetCode = () => {
    if (selectedChallenge) {
      setCode(selectedChallenge.initialCode);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Live Coding Challenges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="challenges" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="editor">Code Editor</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
          </TabsList>

          <TabsContent value="challenges" className="space-y-4">
            <div className="grid gap-4">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                    selectedChallenge?.id === challenge.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedChallenge(challenge)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{challenge.title}</h3>
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          {challenge.language}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {challenge.timeLimit} min
                        </span>
                        <span>{challenge.testCases.length} test cases</span>
                      </div>
                    </div>
                    {selectedChallenge?.id === challenge.id && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="editor" className="space-y-4">
            {selectedChallenge ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{selectedChallenge.title}</h3>
                    <p className="text-sm text-gray-600">{selectedChallenge.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetCode}
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Code Editor</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="autoSave"
                        checked={autoSave}
                        onChange={(e) => setAutoSave(e.target.checked)}
                        className="h-4 w-4"
                      />
                      <label htmlFor="autoSave" className="text-xs">Auto-save</label>
                    </div>
                  </div>
                  
                  <Textarea
                    ref={editorRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Write your code here..."
                    className="font-mono text-sm h-64 resize-none"
                    style={{ 
                      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                      lineHeight: '1.5'
                    }}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={runCode}
                    disabled={isRunning || !code.trim()}
                    className="flex items-center gap-2"
                  >
                    {isRunning ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    {isRunning ? 'Running...' : 'Run Code'}
                  </Button>
                  
                  <Button
                    onClick={analyzeCode}
                    disabled={isAnalyzing || !code.trim()}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MessageSquare className="h-4 w-4" />
                    )}
                    {isAnalyzing ? 'Analyzing...' : 'AI Review'}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Code className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Select a coding challenge to get started</p>
                <p className="text-sm">Choose from the available challenges above</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="output" className="space-y-4">
            {showOutput ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Output & Results</h3>
                  {executionTime > 0 && (
                    <span className="text-sm text-gray-500">
                      Execution time: {executionTime}ms
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Console Output</h4>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-32 overflow-auto">
                      {output || 'No output yet. Run your code to see results.'}
                    </div>
                  </div>

                  {testResults.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Test Results</h4>
                      <div className="space-y-2">
                        {testResults.map((result, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border ${
                              result.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {result.passed ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              )}
                              <span className="font-medium">
                                Test Case {index + 1}: {result.testCase.description}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <div>Input: {result.testCase.input}</div>
                              <div>Expected: {result.expected}</div>
                              <div>Actual: {result.actual}</div>
                              {result.error && (
                                <div className="text-red-500">Error: {result.error}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Terminal className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No output yet</p>
                <p className="text-sm">Run your code to see the output and test results</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CodeEditor; 