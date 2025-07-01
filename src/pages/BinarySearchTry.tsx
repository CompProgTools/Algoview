
import { useState, useEffect } from "react";
import { ArrowLeft, Play, RotateCcw, Pause } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SearchStep {
  left: number;
  right: number;
  mid: number;
  found: boolean;
  comparison: string;
}

const BinarySearchTry = () => {
  const [array, setArray] = useState([1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25]);
  const [target, setTarget] = useState(13);
  const [currentStep, setCurrentStep] = useState(-1);
  const [steps, setSteps] = useState<SearchStep[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const generateSteps = (arr: number[], target: number): SearchStep[] => {
    const steps: SearchStep[] = [];
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const found = arr[mid] === target;
      
      let comparison = "";
      if (found) {
        comparison = `Found ${target} at index ${mid}!`;
      } else if (arr[mid] < target) {
        comparison = `${arr[mid]} < ${target}, search right half`;
      } else {
        comparison = `${arr[mid]} > ${target}, search left half`;
      }

      steps.push({ left, right, mid, found, comparison });

      if (found) break;
      
      if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    if (steps.length === 0 || !steps[steps.length - 1].found) {
      steps.push({ 
        left: left > right ? left : right, 
        right: left > right ? left : right, 
        mid: -1, 
        found: false, 
        comparison: `${target} not found in array` 
      });
    }

    return steps;
  };

  const resetVisualization = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
    setIsComplete(false);
    setSteps(generateSteps(array, target));
  };

  const startVisualization = () => {
    if (steps.length === 0) {
      setSteps(generateSteps(array, target));
    }
    setIsPlaying(true);
  };

  const pauseVisualization = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    resetVisualization();
  }, [array, target]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          if (next >= steps.length - 1) {
            setIsPlaying(false);
            setIsComplete(true);
          }
          return next;
        });
      }, 1500);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length]);

  const getCurrentStepData = () => {
    if (currentStep === -1) return null;
    return steps[currentStep];
  };

  const stepData = getCurrentStepData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" className="rounded-full p-3">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Binary Search Visualization</h1>
            <p className="text-slate-600">Watch how binary search efficiently finds elements in sorted arrays</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Target Value</label>
                  <Input
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Array (comma-separated)</label>
                  <Input
                    value={array.join(", ")}
                    onChange={(e) => {
                      const newArray = e.target.value.split(",").map(n => parseInt(n.trim())).filter(n => !isNaN(n));
                      setArray(newArray.sort((a, b) => a - b));
                    }}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-500 mt-1">Array will be automatically sorted</p>
                </div>

                <div className="flex gap-2">
                  {!isPlaying ? (
                    <Button onClick={startVisualization} className="flex-1">
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                  ) : (
                    <Button onClick={pauseVisualization} variant="outline" className="flex-1">
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  <Button onClick={resetVisualization} variant="outline">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                {stepData && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Current Step:</h4>
                    <p className="text-sm text-blue-700">{stepData.comparison}</p>
                    <div className="mt-2 text-xs text-blue-600">
                      <p>Left: {stepData.left}, Right: {stepData.right}</p>
                      {stepData.mid !== -1 && <p>Middle: {stepData.mid}</p>}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Array Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 justify-center">
                  {array.map((value, index) => {
                    let bgColor = "bg-slate-200";
                    let textColor = "text-slate-700";
                    let scale = "scale-100";

                    if (stepData) {
                      if (index === stepData.mid) {
                        bgColor = stepData.found ? "bg-green-500" : "bg-yellow-500";
                        textColor = "text-white";
                        scale = "scale-110";
                      } else if (index >= stepData.left && index <= stepData.right) {
                        bgColor = "bg-blue-200";
                        textColor = "text-blue-800";
                      } else {
                        bgColor = "bg-slate-100";
                        textColor = "text-slate-400";
                      }
                    }

                    return (
                      <div
                        key={index}
                        className={`w-16 h-16 rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-500 transform ${bgColor} ${textColor} ${scale} shadow-md`}
                      >
                        {value}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-center">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-slate-700 mb-2">
                      Searching for: <span className="text-blue-600 text-2xl">{target}</span>
                    </p>
                    {isComplete && (
                      <div className={`p-4 rounded-lg ${stepData?.found ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        <p className="font-semibold">
                          {stepData?.found ? `Found ${target}!` : `${target} not found`}
                        </p>
                        <p className="text-sm mt-1">
                          Steps taken: {steps.length}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Algorithm Info */}
            <Card className="shadow-lg mt-6">
              <CardHeader>
                <CardTitle>How Binary Search Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-slate-600">
                  <p><strong>Time Complexity:</strong> O(log n)</p>
                  <p><strong>Space Complexity:</strong> O(1)</p>
                  <p><strong>Requirements:</strong> Array must be sorted</p>
                  <div>
                    <strong>Steps:</strong>
                    <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
                      <li>Compare target with middle element</li>
                      <li>If equal, we found it!</li>
                      <li>If target is smaller, search left half</li>
                      <li>If target is larger, search right half</li>
                      <li>Repeat until found or no elements left</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinarySearchTry;
