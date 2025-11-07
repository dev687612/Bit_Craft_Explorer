import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, TreePine, Database, Zap, TrendingUp } from "lucide-react";

const Algorithms = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Compression <span className="gradient-text">Algorithms</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Deep dive into the mathematical foundations and practical implementations 
            of Huffman Coding and LZW compression algorithms
          </p>
        </div>

        {/* Algorithm Comparison */}
        <Tabs defaultValue="overview" className="mb-16">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="huffman">Huffman Coding</TabsTrigger>
            <TabsTrigger value="lzw">LZW Compression</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="algo-card">
                <div className="flex items-center mb-4">
                  <TreePine className="w-8 h-8 text-primary mr-3" />
                  <h3 className="text-2xl font-bold">Huffman Coding</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  A statistical compression method that creates optimal variable-length codes 
                  based on character frequency analysis.
                </p>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Compression Type:</span>
                    <span className="text-sm text-muted-foreground">Lossless</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Best For:</span>
                    <span className="text-sm text-muted-foreground">Text, Source Code</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Time Complexity:</span>
                    <span className="text-sm text-muted-foreground">O(n log n)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Space Complexity:</span>
                    <span className="text-sm text-muted-foreground">O(n)</span>
                  </div>
                </div>
                <Link to="/algorithms/huffman">
                  <Button className="w-full">
                    Learn Huffman
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </Card>

              <Card className="algo-card">
                <div className="flex items-center mb-4">
                  <Database className="w-8 h-8 text-accent mr-3" />
                  <h3 className="text-2xl font-bold">LZW Compression</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  A dictionary-based compression algorithm that builds patterns dynamically 
                  during the encoding process.
                </p>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Compression Type:</span>
                    <span className="text-sm text-muted-foreground">Lossless</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Best For:</span>
                    <span className="text-sm text-muted-foreground">Images, Repetitive Data</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Time Complexity:</span>
                    <span className="text-sm text-muted-foreground">O(n)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Space Complexity:</span>
                    <span className="text-sm text-muted-foreground">O(k)</span>
                  </div>
                </div>
                <Link to="/algorithms/lzw">
                  <Button variant="outline" className="w-full">
                    Learn LZW
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="huffman" className="mt-8">
            <Card className="algo-card">
              <h3 className="text-2xl font-bold mb-6">Huffman Coding Deep Dive</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3">How It Works</h4>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Count frequency of each character in the input text</li>
                    <li>Create leaf nodes for each character with their frequencies</li>
                    <li>Build a min-heap of nodes ordered by frequency</li>
                    <li>Combine two nodes with lowest frequencies into a new internal node</li>
                    <li>Repeat until only one node remains (the root)</li>
                    <li>Assign binary codes: left edge = 0, right edge = 1</li>
                    <li>Replace characters with their binary codes</li>
                  </ol>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3">Advantages</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <Zap className="w-5 h-5 text-success mr-2 mt-0.5" />
                      <div>
                        <span className="font-medium">Optimal Compression</span>
                        <p className="text-sm text-muted-foreground">Guaranteed minimum average code length</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <TrendingUp className="w-5 h-5 text-success mr-2 mt-0.5" />
                      <div>
                        <span className="font-medium">Prefix-Free</span>
                        <p className="text-sm text-muted-foreground">No code is prefix of another</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link to="/algorithms/huffman">
                    <Button>Interactive Demo</Button>
                  </Link>
                  <Link to="/compress">
                    <Button variant="outline">Try It Now</Button>
                  </Link>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="lzw" className="mt-8">
            <Card className="algo-card">
              <h3 className="text-2xl font-bold mb-6">LZW Compression Deep Dive</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3">How It Works</h4>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Initialize dictionary with all single characters (0-255)</li>
                    <li>Read characters and find longest string already in dictionary</li>
                    <li>Output the code for that string</li>
                    <li>Add the string plus next character to dictionary</li>
                    <li>Repeat from step 2 with remaining input</li>
                    <li>Dictionary grows dynamically during compression</li>
                    <li>Decoder rebuilds dictionary using same rules</li>
                  </ol>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3">Key Features</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <Database className="w-5 h-5 text-accent mr-2 mt-0.5" />
                      <div>
                        <span className="font-medium">Adaptive Dictionary</span>
                        <p className="text-sm text-muted-foreground">Learns patterns as it compresses</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Zap className="w-5 h-5 text-accent mr-2 mt-0.5" />
                      <div>
                        <span className="font-medium">Single Pass</span>
                        <p className="text-sm text-muted-foreground">No need to analyze input first</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link to="/algorithms/lzw">
                    <Button>Interactive Demo</Button>
                  </Link>
                  <Link to="/compress">
                    <Button variant="outline">Try It Now</Button>
                  </Link>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Performance Comparison */}
        <Card className="algo-card">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Performance <span className="gradient-text">Comparison</span>
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Metric</th>
                  <th className="text-center py-3 px-4">Huffman Coding</th>
                  <th className="text-center py-3 px-4">LZW Compression</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium">Compression Ratio (Text)</td>
                  <td className="text-center py-3 px-4">50-70%</td>
                  <td className="text-center py-3 px-4">40-60%</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium">Compression Ratio (Images)</td>
                  <td className="text-center py-3 px-4">10-30%</td>
                  <td className="text-center py-3 px-4">20-50%</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium">Speed</td>
                  <td className="text-center py-3 px-4">Medium</td>
                  <td className="text-center py-3 px-4">Fast</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium">Memory Usage</td>
                  <td className="text-center py-3 px-4">Low</td>
                  <td className="text-center py-3 px-4">Medium</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Best Use Case</td>
                  <td className="text-center py-3 px-4">Natural language text</td>
                  <td className="text-center py-3 px-4">Repetitive patterns</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Algorithms;