
import { useState, useEffect } from "react";
import { ArrowLeft, Play, RotateCcw, Pause } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SearchStep {
  currentIndex: number;
  found: boolean;
  comparison: string;
}

const LinearSearchTry = () => {
  const [array, setArray] = useState([7, 2, 9, 1, 5, 6, 3, 8, 4]);
  const [target, setTarget] = useState(5);
  const [currentStep, setCurrentStep] = useState(-1);
  const [steps, setSteps] = useState<SearchStep[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const generateSteps = (arr: number[], target: number): SearchStep[] => {
    const steps: SearchStep[] = [];
    
    for (let i = 0; i < arr.length; i++) {
      const found = arr[i] === target;
      const comparison = found 
        ? `Found ${target} at index ${i}!`
        : `${arr[i]} ≠ ${target}, continue searching...`;
      
      steps.push({ currentIndex: i, found, comparison });
      
      if (found) break;
    }

    if (steps.length === 0 || !steps[steps.length - 1].found) {
      if (steps.length > 0) {
        steps.push({ 
          currentIndex: -1, 
          found: false, 
          comparison: `${target} not found in array` 
        });
      }
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
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length]);

  const getCurrentStepData = () => {
    if (currentStep === -1) return null;
    return steps[currentStep];
  };

  const stepData = getCurrentStepData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-6">
      <div className="container mx-auto max-w-6xl">
        {/* header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" className="rounded-full p-3">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Linear Search Visualization</h1>
            <p className="text-slate-600">Watch how linear search checks each element sequentially</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* controls */}
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
                      setArray(newArray);
                    }}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-500 mt-1">No sorting required for linear search</p>
                </div>

                <div className="flex gap-2">
                  {!isPlaying ? (
                    <Button onClick={startVisualization} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
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
                  <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
                    <h4 className="font-semibold text-emerald-800 mb-2">Current Step:</h4>
                    <p className="text-sm text-emerald-700">{stepData.comparison}</p>
                    {stepData.currentIndex !== -1 && (
                      <div className="mt-2 text-xs text-emerald-600">
                        <p>Checking index: {stepData.currentIndex}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* vis */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Array Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {array.map((value, index) => {
                    let bgColor = "bg-slate-200";
                    let textColor = "text-slate-700";
                    let scale = "scale-100";
                    let border = "";

                    if (stepData) {
                      if (index === stepData.currentIndex) {
                        bgColor = stepData.found ? "bg-green-500" : "bg-orange-500";
                        textColor = "text-white";
                        scale = "scale-110";
                        border = "ring-4 ring-orange-300";
                      } else if (index < stepData.currentIndex) {
                        bgColor = "bg-slate-300";
                        textColor = "text-slate-500";
                      }
                    }

                    return (
                      <div
                        key={index}
                        className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center font-bold text-lg transition-all duration-500 transform ${bgColor} ${textColor} ${scale} ${border} shadow-md`}
                      >
                        <span>{value}</span>
                        <span className="text-xs font-normal opacity-70">{index}</span>
                      </div>
                    );
                  })}
                </div>

                {/* progress*/}
                {stepData && stepData.currentIndex !== -1 && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-slate-600 mb-2">
                      <span>Progress</span>
                      <span>{stepData.currentIndex + 1} / {array.length}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${((stepData.currentIndex + 1) / array.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-center">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-slate-700 mb-2">
                      Searching for: <span className="text-emerald-600 text-2xl">{target}</span>
                    </p>
                    {isComplete && (
                      <div className={`p-4 rounded-lg ${stepData?.found ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        <p className="font-semibold">
                          {stepData?.found ? `Found ${target}!` : `${target} not found`}
                        </p>
                        <p className="text-sm mt-1">
                          Elements checked: {steps.length}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* algo info */}
            <Card className="shadow-lg mt-6">
              <CardHeader>
                <CardTitle>How Linear Search Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-slate-600">
                  <p><strong>Time Complexity:</strong> O(n)</p>
                  <p><strong>Space Complexity:</strong> O(1)</p>
                  <p><strong>Requirements:</strong> None (works on unsorted arrays)</p>
                  <div>
                    <strong>Steps:</strong>
                    <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
                      <li>It starts from the first element (index 0)</li>
                      <li>Compares each element with the target</li>
                      <li>If it's equal, it means you found it</li>
                      <li>If not, move to next element</li>
                      <li>Repeat until found or end of array</li>
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

export default LinearSearchTry;