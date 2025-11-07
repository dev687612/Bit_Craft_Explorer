import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Zap, BookOpen, TrendingUp, FileText, Image } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-accent/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Data Elegance</span> in Bits
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Explore the fascinating world of data compression through interactive demonstrations 
            of Huffman Coding and LZW algorithms
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/compress">
              <Button size="lg" className="btn-hero">
                Try Compression Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/learn">
              <Button size="lg" variant="outline">
                Learn How It Works
                <BookOpen className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Compression Matters */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Data Compression <span className="gradient-text">Matters</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Data compression is everywhere - from the images on your phone to the videos you stream. 
              Understanding these algorithms opens up a world of efficient data storage and transmission.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="algo-card text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Faster Transfer</h3>
              <p className="text-muted-foreground">
                Compressed files transfer faster over networks, saving time and bandwidth costs
              </p>
            </Card>

            <Card className="algo-card text-center">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Less Storage</h3>
              <p className="text-muted-foreground">
                Reduce storage requirements by 50-90% while preserving data integrity
              </p>
            </Card>

            <Card className="algo-card text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Learn Fundamentals</h3>
              <p className="text-muted-foreground">
                Understand the mathematical principles behind efficient data representation
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Algorithm Overview */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Two Powerful <span className="gradient-text">Algorithms</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover how Huffman Coding and LZW compression work through interactive visualizations
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Huffman Coding */}
            <Card className="algo-card">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Huffman Coding</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                A variable-length encoding algorithm that assigns shorter codes to more frequent characters, 
                creating optimal prefix-free codes through binary tree construction.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-success rounded-full mr-3"></div>
                  <span>Best for text with uneven character frequency</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-success rounded-full mr-3"></div>
                  <span>Guaranteed optimal compression for given frequencies</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-success rounded-full mr-3"></div>
                  <span>Creates visual binary trees</span>
                </div>
              </div>
              <Link to="/algorithms/huffman">
                <Button variant="outline" className="w-full">
                  Explore Huffman
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </Card>

            {/* LZW Compression */}
            <Card className="algo-card">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mr-4">
                  <Image className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">LZW Compression</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                A dictionary-based compression algorithm that builds a table of strings during encoding, 
                replacing repeated patterns with shorter codes for efficient compression.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                  <span>Excellent for data with repetitive patterns</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                  <span>Adapts to data during compression</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                  <span>Works well with images and structured data</span>
                </div>
              </div>
              <Link to="/algorithms/lzw">
                <Button variant="outline" className="w-full">
                  Explore LZW
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start <span className="gradient-text">Compressing</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload your files and see these algorithms in action. Compare compression ratios, 
            analyze performance, and understand the magic behind efficient data storage.
          </p>
          <Link to="/compress">
            <Button size="lg" className="btn-hero">
              Start Compressing Files
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;