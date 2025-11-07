import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Code2, 
  BookOpen, 
  Zap, 
  Users, 
  Target, 
  Lightbulb,
  Github,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="gradient-text">DataElegance</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            An interactive educational platform designed to make data compression algorithms 
            accessible, understandable, and engaging for learners at all levels
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <Card className="algo-card">
            <div className="flex items-center mb-4">
              <Target className="w-8 h-8 text-primary mr-3" />
              <h3 className="text-2xl font-bold">Our Mission</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              To demystify the complex world of data compression algorithms through interactive 
              visualizations, hands-on learning, and practical applications that bridge the gap 
              between theory and real-world implementation.
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                <span className="text-sm">Make algorithms accessible to everyone</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                <span className="text-sm">Provide hands-on learning experiences</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                <span className="text-sm">Bridge theory with practical application</span>
              </div>
            </div>
          </Card>

          <Card className="algo-card">
            <div className="flex items-center mb-4">
              <Lightbulb className="w-8 h-8 text-accent mr-3" />
              <h3 className="text-2xl font-bold">Our Vision</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              We envision a world where understanding complex algorithms doesn't require a PhD in 
              computer science. Through intuitive interfaces and step-by-step guidance, we're making 
              advanced computer science concepts accessible to curious minds everywhere.
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                <span className="text-sm">Democratize computer science education</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                <span className="text-sm">Foster algorithmic thinking</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                <span className="text-sm">Inspire the next generation of developers</span>
              </div>
            </div>
          </Card>
        </div>

        {/* What We Offer */}
        <Card className="algo-card mb-16">
          <h3 className="text-2xl font-bold mb-8 text-center">What We Offer</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-3">Interactive Learning</h4>
              <p className="text-sm text-muted-foreground">
                Step-by-step algorithm visualizations that let you see exactly how 
                Huffman Coding and LZW compression work under the hood.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-accent" />
              </div>
              <h4 className="text-lg font-semibold mb-3">Real-Time Compression</h4>
              <p className="text-sm text-muted-foreground">
                Upload your own files and see both algorithms compress them in real-time, 
                with detailed performance metrics and comparisons.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code2 className="w-8 h-8 text-success" />
              </div>
              <h4 className="text-lg font-semibold mb-3">Educational Mode</h4>
              <p className="text-sm text-muted-foreground">
                Toggle between quick compression and educational mode to understand 
                every step of the algorithm execution process.
              </p>
            </div>
          </div>
        </Card>

        {/* Technology Stack */}
        <Card className="algo-card mb-16">
          <h3 className="text-2xl font-bold mb-6">Built with Modern Technology</h3>
          <p className="text-muted-foreground mb-6">
            DataElegance is built using cutting-edge web technologies to ensure a smooth, 
            responsive, and engaging learning experience across all devices.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Frontend Technologies</h4>
              <div className="space-y-2">
                <Badge variant="outline" className="mr-2">React + TypeScript</Badge>
                <Badge variant="outline" className="mr-2">Tailwind CSS</Badge>
                <Badge variant="outline" className="mr-2">Recharts</Badge>
                <Badge variant="outline" className="mr-2">Lucide React</Badge>
                <Badge variant="outline" className="mr-2">React Router</Badge>
                <Badge variant="outline" className="mr-2">Vite</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Backend & Algorithms</h4>
              <div className="space-y-2">
                <Badge variant="outline" className="mr-2">Python</Badge>
                <Badge variant="outline" className="mr-2">FastAPI</Badge>
                <Badge variant="outline" className="mr-2">NumPy</Badge>
                <Badge variant="outline" className="mr-2">Pillow (PIL)</Badge>
                <Badge variant="outline" className="mr-2">Custom Algorithm Implementations</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Features in Development */}
        <Card className="algo-card mb-16">
          <h3 className="text-2xl font-bold mb-6">Coming Soon</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Enhanced Visualizations</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 3D Huffman tree construction animation</li>
                <li>• Interactive LZW dictionary exploration</li>
                <li>• Real-time compression progress visualization</li>
                <li>• Side-by-side algorithm comparison charts</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Advanced Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Custom algorithm parameter tuning</li>
                <li>• Batch file processing capabilities</li>
                <li>• Detailed performance analytics</li>
                <li>• PDF report generation</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Target Audience */}
        <Card className="algo-card mb-16">
          <div className="flex items-center mb-6">
            <Users className="w-8 h-8 text-primary mr-3" />
            <h3 className="text-2xl font-bold">Who This Is For</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Computer Science Students</h4>
              <p className="text-sm text-muted-foreground">
                Perfect for understanding data structures, algorithms, and information theory 
                concepts with visual, hands-on examples.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Software Developers</h4>
              <p className="text-sm text-muted-foreground">
                Gain practical insights into compression algorithms you might encounter 
                in real-world applications and system design.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Curious Learners</h4>
              <p className="text-sm text-muted-foreground">
                Anyone interested in understanding how data compression works behind 
                the scenes of everyday technology.
              </p>
            </div>
          </div>
        </Card>

        {/* Open Source & Contact */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="algo-card">
            <div className="flex items-center mb-4">
              <Github className="w-8 h-8 text-foreground mr-3" />
              <h3 className="text-2xl font-bold">Open Source</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              DataElegance is open source and welcomes contributions from the community. 
              Whether you're fixing bugs, adding features, or improving documentation, 
              we'd love your help!
            </p>
            <div className="flex gap-4">
              <Button variant="outline">
                <Github className="w-4 h-4 mr-2" />
                View on GitHub
              </Button>
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Contribute
              </Button>
            </div>
          </Card>

          <Card className="algo-card">
            <h3 className="text-2xl font-bold mb-4">Get Started</h3>
            <p className="text-muted-foreground mb-6">
              Ready to dive into the fascinating world of data compression? 
              Start with our interactive tutorials or jump straight into compressing your own files.
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/learn">
                <Button className="w-full btn-hero">
                  Start Learning
                  <BookOpen className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/compress">
                <Button variant="outline" className="w-full">
                  Try Compression
                  <Zap className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;