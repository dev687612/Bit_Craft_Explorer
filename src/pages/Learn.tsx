import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, PlayCircle, Code, FileText, TrendingUp, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

const Learn = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Learn Data <span className="gradient-text">Compression</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Master the fundamentals of data compression through interactive lessons, 
            step-by-step tutorials, and hands-on exercises
          </p>
        </div>

        {/* Learning Path */}
        <Tabs defaultValue="fundamentals" className="mb-16">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
            <TabsTrigger value="huffman">Huffman Deep Dive</TabsTrigger>
            <TabsTrigger value="lzw">LZW Deep Dive</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
          </TabsList>

          {/* Fundamentals */}
          <TabsContent value="fundamentals" className="mt-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="algo-card">
                <div className="flex items-center mb-4">
                  <BookOpen className="w-8 h-8 text-primary mr-3" />
                  <h3 className="text-2xl font-bold">What is Data Compression?</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Data compression is the process of reducing the number of bits required to represent data. 
                  It's essential for efficient storage and transmission of information.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
                    <div>
                      <h4 className="font-medium">Lossless Compression</h4>
                      <p className="text-sm text-muted-foreground">Perfect reconstruction of original data</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3 mt-2"></div>
                    <div>
                      <h4 className="font-medium">Lossy Compression</h4>
                      <p className="text-sm text-muted-foreground">Approximate reconstruction for higher compression</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-success rounded-full mr-3 mt-2"></div>
                    <div>
                      <h4 className="font-medium">Compression Ratio</h4>
                      <p className="text-sm text-muted-foreground">Measure of compression effectiveness</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="algo-card">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-8 h-8 text-success mr-3" />
                  <h3 className="text-2xl font-bold">Information Theory Basics</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Understanding entropy and information content is crucial for effective compression algorithms.
                </p>
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Shannon's Entropy Formula</h4>
                    <code className="text-sm bg-background p-2 rounded block">
                      H(X) = -Σ p(x) log₂ p(x)
                    </code>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>H(X):</strong> Entropy in bits</p>
                    <p className="text-sm"><strong>p(x):</strong> Probability of symbol x</p>
                    <p className="text-sm"><strong>Lower entropy:</strong> Better compression</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="algo-card mt-8">
              <h3 className="text-2xl font-bold mb-6">Key Concepts to Master</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Redundancy</h4>
                  <p className="text-sm text-muted-foreground">
                    Identifying and eliminating unnecessary information
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Code className="w-8 h-8 text-accent" />
                  </div>
                  <h4 className="font-semibold mb-2">Encoding</h4>
                  <p className="text-sm text-muted-foreground">
                    Converting data into compressed representation
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-success" />
                  </div>
                  <h4 className="font-semibold mb-2">Efficiency</h4>
                  <p className="text-sm text-muted-foreground">
                    Measuring compression performance and trade-offs
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Huffman Deep Dive */}
          <TabsContent value="huffman" className="mt-8">
            <div className="space-y-8">
              <Card className="algo-card">
                <h3 className="text-2xl font-bold mb-6">Huffman Coding Step-by-Step</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Badge className="mr-4 mt-1">1</Badge>
                    <div>
                      <h4 className="font-semibold mb-2">Frequency Analysis</h4>
                      <p className="text-muted-foreground">
                        Count how often each character appears in your text. This creates a frequency table 
                        that forms the foundation of the compression algorithm.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Badge className="mr-4 mt-1">2</Badge>
                    <div>
                      <h4 className="font-semibold mb-2">Priority Queue Creation</h4>
                      <p className="text-muted-foreground">
                        Create leaf nodes for each character and add them to a min-heap ordered by frequency. 
                        Less frequent characters will have longer codes.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Badge className="mr-4 mt-1">3</Badge>
                    <div>
                      <h4 className="font-semibold mb-2">Tree Construction</h4>
                      <p className="text-muted-foreground">
                        Repeatedly combine the two nodes with lowest frequencies into a new internal node 
                        until only one node remains - the root of your Huffman tree.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Badge className="mr-4 mt-1">4</Badge>
                    <div>
                      <h4 className="font-semibold mb-2">Code Assignment</h4>
                      <p className="text-muted-foreground">
                        Traverse the tree to assign binary codes: left edges = 0, right edges = 1. 
                        Frequent characters get shorter codes near the root.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">💡 Pro Tip</h4>
                  <p className="text-sm text-muted-foreground">
                    Huffman coding produces optimal prefix-free codes. No code is a prefix of another, 
                    making decompression unambiguous and efficient.
                  </p>
                </div>
              </Card>

              <Card className="algo-card">
                <h3 className="text-xl font-bold mb-4">Interactive Example</h3>
                <div className="bg-muted/30 p-6 rounded-lg">
                  <h4 className="font-medium mb-4">Text: "HELLO WORLD"</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-2">Character Frequencies:</h5>
                      <div className="space-y-1 text-sm font-mono">
                        <div>L: 3 times</div>
                        <div>O: 2 times</div>
                        <div>H: 1 time</div>
                        <div>E: 1 time</div>
                        <div>Space: 1 time</div>
                        <div>W: 1 time</div>
                        <div>R: 1 time</div>
                        <div>D: 1 time</div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Huffman Codes:</h5>
                      <div className="space-y-1 text-sm font-mono">
                        <div>L: 00</div>
                        <div>O: 01</div>
                        <div>H: 100</div>
                        <div>E: 101</div>
                        <div>Space: 110</div>
                        <div>W: 1110</div>
                        <div>R: 11110</div>
                        <div>D: 11111</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-4">
                  <Link to="/algorithms/huffman">
                    <Button>
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Try Interactive Demo
                    </Button>
                  </Link>
                  <Link to="/compress">
                    <Button variant="outline">Compress Files</Button>
                  </Link>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* LZW Deep Dive */}
          <TabsContent value="lzw" className="mt-8">
            <div className="space-y-8">
              <Card className="algo-card">
                <h3 className="text-2xl font-bold mb-6">LZW Compression Process</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Badge variant="outline" className="mr-4 mt-1">1</Badge>
                    <div>
                      <h4 className="font-semibold mb-2">Dictionary Initialization</h4>
                      <p className="text-muted-foreground">
                        Start with a dictionary containing all possible single characters (0-255 for bytes). 
                        This gives us our initial vocabulary for encoding.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Badge variant="outline" className="mr-4 mt-1">2</Badge>
                    <div>
                      <h4 className="font-semibold mb-2">Pattern Recognition</h4>
                      <p className="text-muted-foreground">
                        Read input and find the longest string that's already in the dictionary. 
                        This adaptive approach learns patterns as it processes data.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Badge variant="outline" className="mr-4 mt-1">3</Badge>
                    <div>
                      <h4 className="font-semibold mb-2">Code Output & Dictionary Update</h4>
                      <p className="text-muted-foreground">
                        Output the code for the matched string, then add the string plus the next character 
                        to the dictionary for future use.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Badge variant="outline" className="mr-4 mt-1">4</Badge>
                    <div>
                      <h4 className="font-semibold mb-2">Adaptive Learning</h4>
                      <p className="text-muted-foreground">
                        As the dictionary grows, longer patterns are recognized and compressed more efficiently. 
                        The algorithm adapts to the specific characteristics of your data.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="algo-card">
                <h3 className="text-xl font-bold mb-4">LZW Example: "ABABABA"</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-border rounded-lg">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="p-3 text-left">Step</th>
                        <th className="p-3 text-left">Input</th>
                        <th className="p-3 text-left">Match</th>
                        <th className="p-3 text-left">Output</th>
                        <th className="p-3 text-left">Add to Dictionary</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border">
                        <td className="p-3">1</td>
                        <td className="p-3 font-mono">A</td>
                        <td className="p-3 font-mono">A</td>
                        <td className="p-3 font-mono">65</td>
                        <td className="p-3 font-mono">256: AB</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="p-3">2</td>
                        <td className="p-3 font-mono">B</td>
                        <td className="p-3 font-mono">B</td>
                        <td className="p-3 font-mono">66</td>
                        <td className="p-3 font-mono">257: BA</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="p-3">3</td>
                        <td className="p-3 font-mono">AB</td>
                        <td className="p-3 font-mono">AB</td>
                        <td className="p-3 font-mono">256</td>
                        <td className="p-3 font-mono">258: ABA</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="p-3">4</td>
                        <td className="p-3 font-mono">ABA</td>
                        <td className="p-3 font-mono">ABA</td>
                        <td className="p-3 font-mono">258</td>
                        <td className="p-3 font-mono">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 p-4 bg-success/10 rounded-lg border border-success/20">
                  <h4 className="font-semibold text-success mb-2">Result</h4>
                  <p className="text-sm">
                    Original: "ABABABA" (7 bytes) → Compressed: [65, 66, 256, 258] (8 bytes as codes)
                    <br />
                    <span className="text-muted-foreground">
                      Note: With longer, more repetitive text, LZW achieves much better compression ratios!
                    </span>
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Practice */}
          <TabsContent value="practice" className="mt-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="algo-card">
                <div className="flex items-center mb-4">
                  <Lightbulb className="w-8 h-8 text-warning mr-3" />
                  <h3 className="text-2xl font-bold">Practice Exercises</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-semibold mb-2">Exercise 1: Frequency Analysis</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Calculate character frequencies for "COMPRESSION" and determine optimal Huffman codes.
                    </p>
                    <Button size="sm" variant="outline">Start Exercise</Button>
                  </div>
                  
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-semibold mb-2">Exercise 2: LZW Dictionary</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Trace through LZW compression of "TOBEORNOTTOBEORTOBEORNOT".
                    </p>
                    <Button size="sm" variant="outline">Start Exercise</Button>
                  </div>
                  
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-semibold mb-2">Exercise 3: Compression Comparison</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Compare Huffman vs LZW performance on different types of text data.
                    </p>
                    <Button size="sm" variant="outline">Start Exercise</Button>
                  </div>
                </div>
              </Card>

              <Card className="algo-card">
                <div className="flex items-center mb-4">
                  <PlayCircle className="w-8 h-8 text-accent mr-3" />
                  <h3 className="text-2xl font-bold">Interactive Tools</h3>
                </div>
                <div className="space-y-4">
                  <Link to="/algorithms/huffman">
                    <div className="p-4 border border-border rounded-lg interactive-hover">
                      <h4 className="font-semibold mb-2">Huffman Tree Visualizer</h4>
                      <p className="text-sm text-muted-foreground">
                        Step through tree construction and see codes generated in real-time.
                      </p>
                    </div>
                  </Link>
                  
                  <Link to="/algorithms/lzw">
                    <div className="p-4 border border-border rounded-lg interactive-hover">
                      <h4 className="font-semibold mb-2">LZW Dictionary Tracker</h4>
                      <p className="text-sm text-muted-foreground">
                        Watch the dictionary grow as patterns are discovered and encoded.
                      </p>
                    </div>
                  </Link>
                  
                  <Link to="/compress">
                    <div className="p-4 border border-border rounded-lg interactive-hover">
                      <h4 className="font-semibold mb-2">File Compression Lab</h4>
                      <p className="text-sm text-muted-foreground">
                        Upload files and experiment with both algorithms on real data.
                      </p>
                    </div>
                  </Link>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Next Steps */}
        <Card className="algo-card text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Apply Your Knowledge?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Now that you understand the theory, try compressing real files and see these algorithms in action!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/compress">
              <Button size="lg" className="btn-hero">
                Start Compressing Files
              </Button>
            </Link>
            <Link to="/algorithms">
              <Button size="lg" variant="outline">
                Explore Algorithms
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Learn;