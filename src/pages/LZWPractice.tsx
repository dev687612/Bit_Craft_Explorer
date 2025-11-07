import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { compressLZW } from "@/lib/compression";

interface DictionaryEntry {
  code: number;
  string: string;
}

const LZWPractice = () => {
  const [inputText, setInputText] = useState("ABABABA");
  const [dictionary, setDictionary] = useState<DictionaryEntry[]>([]);
  const [compressed, setCompressed] = useState<number[]>([]);
  const [compressionStats, setCompressionStats] = useState<{
    original: number;
    compressed: number;
    ratio: number;
  } | null>(null);
  const [step, setStep] = useState<number>(0);

  const initializeDictionary = () => {
    // Initialize with ASCII 0-255
    const initialDict: DictionaryEntry[] = [];
    for (let i = 0; i < 256; i++) {
      initialDict.push({
        code: i,
        string: String.fromCharCode(i),
      });
    }
    setDictionary(initialDict);
    setStep(1);
  };

  const compressText = () => {
    if (!inputText) return;
    
    const encoder = new TextEncoder();
    const byteArray = encoder.encode(inputText);
    const result = compressLZW(byteArray);
    
    // Simulate LZW compression for visualization
    const dict = new Map<string, number>();
    let dictSize = 256;
    
    // Initialize dictionary
    for (let i = 0; i < 256; i++) {
      dict.set(String.fromCharCode(i), i);
    }
    
    const output: number[] = [];
    const dictEntries: DictionaryEntry[] = [];
    
    let w = String.fromCharCode(byteArray[0]);
    
    for (let i = 1; i < byteArray.length; i++) {
      const c = String.fromCharCode(byteArray[i]);
      const wc = w + c;
      
      if (dict.has(wc)) {
        w = wc;
      } else {
        output.push(dict.get(w)!);
        
        if (dictSize < 512) {
          dict.set(wc, dictSize);
          dictEntries.push({
            code: dictSize++,
            string: wc,
          });
        }
        
        w = c;
      }
    }
    
    if (w.length > 0) {
      output.push(dict.get(w)!);
    }
    
    setCompressed(output);
    setDictionary(Array.from(dict.entries()).slice(256).map(([str, code]) => ({
      code,
      string: str,
    })));
    
    const stats = {
      original: byteArray.length,
      compressed: result.compressedSize,
      ratio: ((1 - result.compressedSize / byteArray.length) * 100),
    };
    
    setCompressionStats(stats);
    setStep(2);
  };

  const reset = () => {
    setDictionary([]);
    setCompressed([]);
    setCompressionStats(null);
    setStep(0);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link to="/learn">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learning
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            LZW Compression <span className="gradient-text">Practice</span>
          </h1>
          <p className="text-muted-foreground">
            Interactive practice tool for understanding LZW compression algorithm
          </p>
        </div>

        <Card className="algo-card p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Step 1: Enter Text</h3>
          <div className="space-y-4">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to compress..."
              className="text-lg"
            />
            <Button onClick={initializeDictionary} className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Initialize Dictionary
            </Button>
          </div>
        </Card>

        {step >= 1 && (
          <Card className="algo-card p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Step 2: Compress</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Dictionary initialized with 256 entries (0-255)
            </p>
            <Button onClick={compressText} className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Compress Text
            </Button>
          </Card>
        )}

        {step >= 2 && (
          <>
            <Card className="algo-card p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Step 3: Compression Output</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Compressed Codes:</h4>
                  <div className="p-4 bg-muted/30 rounded-lg font-mono text-sm">
                    [{compressed.join(', ')}]
                  </div>
                </div>
                
                {dictionary.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">New Dictionary Entries:</h4>
                    <div className="grid md:grid-cols-3 gap-2">
                      {dictionary.slice(0, 12).map((entry) => (
                        <div key={entry.code} className="p-2 border border-border rounded text-sm">
                          <span className="font-mono text-primary">{entry.code}:</span> "{entry.string}"
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {compressionStats && (
              <Card className="algo-card p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Compression Statistics</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Original Size</div>
                    <div className="text-2xl font-bold">{compressionStats.original} bytes</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Compressed Size</div>
                    <div className="text-2xl font-bold text-primary">{compressionStats.compressed} bytes</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Compression Ratio</div>
                    <Badge className="text-xl px-4 py-2">
                      {compressionStats.ratio.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}

        <div className="flex gap-4">
          <Button onClick={reset} variant="outline" className="flex-1">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Link to="/compress" className="flex-1">
            <Button className="w-full">
              Try Real Compression
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LZWPractice;


