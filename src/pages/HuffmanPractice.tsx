import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { compressHuffman } from "@/lib/compression";

interface FrequencyEntry {
  char: string;
  frequency: number;
  code: string;
}

const HuffmanPractice = () => {
  const [inputText, setInputText] = useState("HELLO WORLD");
  const [frequencies, setFrequencies] = useState<FrequencyEntry[]>([]);
  const [compressed, setCompressed] = useState<string>("");
  const [compressionStats, setCompressionStats] = useState<{
    original: number;
    compressed: number;
    ratio: number;
  } | null>(null);
  const [step, setStep] = useState<number>(0);

  const analyzeFrequencies = () => {
    const freqMap = new Map<string, number>();
    
    for (const char of inputText) {
      freqMap.set(char, (freqMap.get(char) || 0) + 1);
    }
    
    const sorted = Array.from(freqMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([char, freq]) => ({
        char: char === ' ' ? '[Space]' : char,
        frequency: freq,
        code: '',
      }));
    
    setFrequencies(sorted);
    setStep(1);
  };

  const compressText = () => {
    if (!inputText) return;
    
    const encoder = new TextEncoder();
    const byteArray = encoder.encode(inputText);
    const result = compressHuffman(byteArray);
    
    // Simulate code assignment for display
    const freqMap = new Map<string, number>();
    for (const char of inputText) {
      freqMap.set(char, (freqMap.get(char) || 0) + 1);
    }
    
    // Create simple code assignments for visualization
    const sorted = Array.from(freqMap.entries()).sort((a, b) => b[1] - a[1]);
    const codes: Map<string, string> = new Map();
    
    sorted.forEach(([char], index) => {
      if (index === 0) codes.set(char, '0');
      else if (index === 1) codes.set(char, '1');
      else {
        const binary = (index - 1).toString(2);
        codes.set(char, '1' + '0'.repeat(binary.length) + binary);
      }
    });
    
    const compressedCodes = Array.from(inputText)
      .map(char => codes.get(char) || '')
      .join(' ');
    
    setCompressed(compressedCodes);
    
    const stats = {
      original: byteArray.length,
      compressed: result.compressedSize,
      ratio: ((1 - result.compressedSize / byteArray.length) * 100),
    };
    
    setCompressionStats(stats);
    setStep(2);
    
    // Update frequencies with codes
    const updatedFreqs = frequencies.map(freq => ({
      ...freq,
      code: codes.get(freq.char === '[Space]' ? ' ' : freq.char) || '',
    }));
    setFrequencies(updatedFreqs);
  };

  const reset = () => {
    setFrequencies([]);
    setCompressed("");
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
            Huffman Coding <span className="gradient-text">Practice</span>
          </h1>
          <p className="text-muted-foreground">
            Interactive practice tool for understanding Huffman Coding algorithm
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
            <Button onClick={analyzeFrequencies} className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Analyze Frequencies
            </Button>
          </div>
        </Card>

        {step >= 1 && (
          <Card className="algo-card p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Step 2: Character Frequencies</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {frequencies.map((entry, index) => (
                <div key={index} className="p-3 border border-border rounded-lg">
                  <div className="font-mono text-lg mb-1">{entry.char}</div>
                  <div className="text-sm text-muted-foreground">
                    Frequency: {entry.frequency}
                  </div>
                  {entry.code && (
                    <div className="text-sm font-mono text-primary mt-1">
                      Code: {entry.code}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Button onClick={compressText} className="w-full mt-4">
              <Play className="w-4 h-4 mr-2" />
              Compress Text
            </Button>
          </Card>
        )}

        {step >= 2 && compressionStats && (
          <Card className="algo-card p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Step 3: Compression Results</h3>
            <div className="space-y-4">
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
              
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Compressed Binary:</h4>
                <div className="p-4 bg-muted/30 rounded-lg font-mono text-sm break-all">
                  {compressed || "Processing..."}
                </div>
              </div>
            </div>
          </Card>
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

export default HuffmanPractice;


