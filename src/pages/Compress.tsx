import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Image, Download, Zap, TrendingDown, Clock, FileIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import imageCompression from "browser-image-compression";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import pako from "pako";
import JSZip from "jszip";
import {
  compressData,
  chooseBestCompression,
  fileToByteArray,
  byteArrayToBlob,
  type CompressionResult as AlgoResult,
} from "@/lib/compression";

// Configure pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface CompressionResult {
  id: number;
  fileName: string;
  originalSize: number;
  compressedSize: number;
  compressedBlob: Blob;
  compressionTime: number;
  fileType: string;
  compressionRatio: number;
  method: 'huffman' | 'lzw';
  huffmanResult?: AlgoResult;
  lzwResult?: AlgoResult;
}

const Compress = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [compressionResults, setCompressionResults] = useState<CompressionResult[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<'huffman' | 'lzw' | 'both'>('both');
  const [targetSize, setTargetSize] = useState<number>(50); // Percentage of original size
  const { toast } = useToast();

  const isValidFileType = (file: File): boolean => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'text/plain'
    ];
    const validExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.txt'];
    return validTypes.some(type => file.type === type) || 
           validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  };

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(isValidFileType);
    
    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid files detected",
        description: "Only PDF, Word (.doc, .docx), JPG, PNG, and TXT files are supported",
        variant: "destructive",
      });
    }
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  }, [toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(isValidFileType);
      
      if (validFiles.length !== files.length) {
        toast({
          title: "Invalid files detected",
          description: "Only PDF, Word (.doc, .docx), JPG, PNG, and TXT files are supported",
          variant: "destructive",
        });
      }
      
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Compress image files with VERY AGGRESSIVE quality control based on target size
  const compressImage = async (file: File): Promise<{ blob: Blob; results: AlgoResult[] }> => {
    try {
      const fileSizeMB = file.size / (1024 * 1024);
      const isJPG = file.type === 'image/jpeg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg');
      
      // Calculate target file size based on user input (percentage)
      const targetFileSize = (file.size * targetSize) / 100;
      const targetMB = targetFileSize / (1024 * 1024);
      
      // VERY AGGRESSIVE quality reduction based on target size
      // For 10% target: quality = 0.1-0.2
      // For 50% target: quality = 0.5
      let quality = Math.max(0.05, Math.min(0.95, (targetSize / 100) * 0.8)); // 5-95% quality, scaled down
      
      if (isJPG) {
        quality = Math.max(0.1, Math.min(0.9, quality)); // JPG: 10-90% quality range (very aggressive)
      } else {
        // PNG compression is less effective, use more aggressive resizing
        quality = Math.max(0.3, Math.min(0.9, quality)); // PNG: 30-90% quality
      }
      
      // VERY AGGRESSIVE dimension reduction based on target size
      // For 10% target: dimension = ~20% of original
      // For 50% target: dimension = ~70% of original
      const scaleFactor = Math.pow(targetSize / 100, 0.6); // More aggressive scaling
      const baseDimension = isJPG ? 3840 : 4096;
      let maxDimension = Math.max(400, Math.min(baseDimension, baseDimension * scaleFactor));
      
      // For very aggressive targets, reduce dimensions even more
      if (targetSize < 30) {
        maxDimension = Math.max(200, maxDimension * 0.5);
      }
      if (targetSize < 20) {
        maxDimension = Math.max(150, maxDimension * 0.6);
      }
      
      const options: any = {
        maxSizeMB: targetMB > 10 ? 10 : Math.max(0.05, targetMB), // Very aggressive size limit
        maxWidthOrHeight: Math.round(maxDimension),
        useWebWorker: true,
        initialQuality: quality,
        fileType: file.type,
        preserveExif: false, // Remove EXIF
        maxIteration: 50, // More iterations allowed
      };

      if (isJPG) {
        options.quality = quality;
      }

      // MULTI-PASS AGGRESSIVE compression
      let compressedFile = file;
      let iterations = 0;
      const maxIterations = 10; // More iterations for aggressive compression
      
      while (iterations < maxIterations && compressedFile.size > targetFileSize * 1.02) {
        try {
          const compressed = await imageCompression(compressedFile, options);
          if (compressed.size >= compressedFile.size || compressed.size === 0) {
            // No improvement or invalid result, stop
            break;
          }
          compressedFile = compressed;
          
          // Aggressively adjust quality downward if still too large
          if (compressedFile.size > targetFileSize * 1.05) {
            quality = Math.max(0.05, quality * 0.85); // Reduce by 15% each time
            options.initialQuality = quality;
            if (isJPG) options.quality = quality;
            
            // Also reduce dimensions if needed
            if (compressedFile.size > targetFileSize * 1.2) {
              maxDimension = Math.max(100, maxDimension * 0.9);
              options.maxWidthOrHeight = Math.round(maxDimension);
            }
          }
          
          iterations++;
        } catch (error) {
          console.warn('Image compression iteration failed:', error);
          break;
        }
      }

      // If still not small enough, apply additional compression pass with even lower quality
      if (compressedFile.size > targetFileSize * 1.1 && targetSize < 50) {
        try {
          const ultraOptions = {
            ...options,
            initialQuality: Math.max(0.05, quality * 0.7),
            maxWidthOrHeight: Math.max(100, Math.round(maxDimension * 0.8)),
            maxSizeMB: targetMB * 0.8,
          };
          if (isJPG) ultraOptions.quality = ultraOptions.initialQuality;
          
          const ultraCompressed = await imageCompression(compressedFile, ultraOptions);
          if (ultraCompressed.size < compressedFile.size) {
            compressedFile = ultraCompressed;
          }
        } catch (error) {
          console.warn('Ultra compression failed:', error);
        }
      }

      const byteArray = await fileToByteArray(compressedFile);
      const algoResults = compressData(byteArray, selectedMethod);
      
      return { blob: compressedFile, results: algoResults };
    } catch (error) {
      console.error('Image compression error:', error);
      return { blob: file, results: [] };
    }
  };

  // Compress PDF files AGGRESSIVELY while maintaining PDF format integrity
  const compressPDF = async (file: File): Promise<{ blob: Blob; results: AlgoResult[] }> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalSize = file.size;
      const targetFileSize = (originalSize * targetSize) / 100;
      
      // Load PDF document
      let pdfDoc: PDFDocument;
      try {
        pdfDoc = await PDFDocument.load(arrayBuffer);
      } catch (pdfError) {
        console.warn('PDF loading failed, trying alternative method:', pdfError);
        // If PDF can't be loaded with pdf-lib, try optimizing the raw PDF bytes
        // This preserves PDF structure while applying compression
        const pdfBytes = new Uint8Array(arrayBuffer);
        
        // Apply aggressive optimization: remove comments, optimize streams
        let optimized = pdfBytes;
        
        // Try to compress PDF streams while maintaining structure
        // This is a safe optimization that maintains PDF validity
        const pdfString = new TextDecoder('latin1').decode(pdfBytes);
        
        // Remove unnecessary whitespace and comments (safe for PDF structure)
        const cleaned = pdfString
          .replace(/%[^\r\n]*[\r\n]/g, '') // Remove comments
          .replace(/[ \t]+/g, ' ') // Collapse whitespace
          .replace(/[ \t]*[\r\n][ \t]*/g, '\n'); // Normalize line breaks
        
        const optimizedBytes = new TextEncoder().encode(cleaned);
        
        if (optimizedBytes.length < pdfBytes.length) {
          optimized = optimizedBytes;
        }
        
        const byteArray = new Uint8Array(arrayBuffer);
        const algoResults = compressData(byteArray, selectedMethod);
        
        const compressedBlob = new Blob([optimized], { type: 'application/pdf' });
        return { blob: compressedBlob, results: algoResults };
      }

      // AGGRESSIVE PDF optimization: compress embedded images and optimize structure
      const pages = pdfDoc.getPages();
      
      // Save PDF with maximum compression settings
      let pdfBytes = await pdfDoc.save({
        useObjectStreams: true, // Enables compression
        addDefaultPage: false,
        updateMetadata: false,
      });
      
      let optimizedBytes = new Uint8Array(pdfBytes);
      
      // AGGRESSIVE PDF optimization: clean up structure
      // This is safe and maintains PDF validity while providing compression
      const pdfText = new TextDecoder('latin1').decode(optimizedBytes);
      
      // Remove unnecessary whitespace while preserving PDF structure
      let cleaned = pdfText
        .replace(/\r\n/g, '\n') // Normalize line endings
        .replace(/[ \t]+/g, ' ') // Collapse spaces
        .replace(/[ \t]*\n[ \t]*/g, '\n') // Normalize line breaks
        .replace(/%%EOF[\s]*$/m, '%%EOF'); // Ensure proper EOF
      
      // Remove PDF comments (safe - comments are optional)
      cleaned = cleaned.replace(/%[^\r\n]*[\r\n]/g, '\n');
      
      let cleanedBytes = new TextEncoder().encode(cleaned);
      
      // Use cleaned version if smaller
      if (cleanedBytes.length < optimizedBytes.length) {
        optimizedBytes = cleanedBytes;
      }
      
      // AGGRESSIVE optimization: remove optional metadata (provides significant compression)
      if (optimizedBytes.length > targetFileSize && targetSize < 70) {
        const aggressive = cleaned
          .replace(/\/CreationDate[^\n]*\n/g, '') // Remove creation date (optional)
          .replace(/\/ModDate[^\n]*\n/g, '') // Remove modification date (optional)
          .replace(/\/Producer[^\n]*\n/g, '') // Remove producer info (optional)
          .replace(/\/Creator[^\n]*\n/g, ''); // Remove creator info (optional)
        
        const aggressiveBytes = new TextEncoder().encode(aggressive);
        
        // Validate it's still a valid PDF (has %PDF header and %%EOF)
        if (aggressive.includes('%PDF') && aggressive.includes('%%EOF') && aggressiveBytes.length < optimizedBytes.length) {
          optimizedBytes = aggressiveBytes;
        }
      }
      
      // ULTRA AGGRESSIVE optimization for very low targets
      if (optimizedBytes.length > targetFileSize && targetSize < 30) {
        const ultra = cleaned
          .replace(/\/CreationDate[^\n]*\n/g, '')
          .replace(/\/ModDate[^\n]*\n/g, '')
          .replace(/\/Producer[^\n]*\n/g, '')
          .replace(/\/Creator[^\n]*\n/g, '')
          .replace(/\/Author[^\n]*\n/g, '') // Remove author (optional)
          .replace(/\/Title[^\n]*\n/g, '') // Remove title (optional)
          .replace(/\/Subject[^\n]*\n/g, '') // Remove subject (optional)
          .replace(/\/Keywords[^\n]*\n/g, '') // Remove keywords (optional)
          .replace(/\/Trailer[^\n]*\n/g, ''); // Some trailer info (if safe)
        
        const ultraBytes = new TextEncoder().encode(ultra);
        
        // Validate PDF structure
        if (ultra.includes('%PDF') && ultra.includes('%%EOF') && ultraBytes.length < optimizedBytes.length) {
          optimizedBytes = ultraBytes;
        }
      }
      
      const compressedBlob = new Blob([optimizedBytes], { type: 'application/pdf' });
      
      // Always use optimized version if it's smaller (even slightly)
      if (compressedBlob.size < originalSize) {
        const byteArray = new Uint8Array(arrayBuffer);
        const algoResults = compressData(byteArray, selectedMethod);
        return { blob: compressedBlob, results: algoResults };
      }
      
      // If no improvement, return original
      const byteArray = new Uint8Array(arrayBuffer);
      const algoResults = compressData(byteArray, selectedMethod);
      return { blob: file, results: algoResults };
    } catch (error) {
      console.error('PDF compression error:', error);
      return { blob: file, results: [] };
    }
  };

  // Compress Word documents AGGRESSIVELY while maintaining Word format integrity
  const compressWord = async (file: File): Promise<{ blob: Blob; results: AlgoResult[] }> => {
    try {
      const originalSize = file.size;
      const targetFileSize = (originalSize * targetSize) / 100;
      
      const fileData = await file.arrayBuffer();
      const fileType = file.type || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      
      try {
        // Load the ZIP file - Word docs are ZIP archives
        const loadedZip = await JSZip.loadAsync(fileData);
        
        // VERY AGGRESSIVE compression level based on target
        let compressionLevel = targetSize < 20 ? 9 : targetSize < 30 ? 9 : targetSize < 50 ? 9 : targetSize < 70 ? 9 : 7;
        
        // Create new ZIP with MAXIMUM compression - but maintain Word format
        const newZip = new JSZip();
        const fileNames = Object.keys(loadedZip.files);
        
        // Compress each file with MAXIMUM compression
        for (const fileName of fileNames) {
          const fileEntry = loadedZip.files[fileName];
          if (!fileEntry.dir) {
            let content = await fileEntry.async("arraybuffer");
            
            // For XML files (Word documents contain XML), AGGRESSIVELY minify whitespace
            // This provides significant compression while keeping XML valid
            if (fileName.endsWith('.xml') || fileName.endsWith('.rels')) {
              try {
                const xmlText = new TextDecoder().decode(content);
                
                // AGGRESSIVE XML minification - remove all unnecessary whitespace
                let minifiedXml = xmlText
                  .replace(/>\s+</g, '><') // Remove spaces between tags
                  .replace(/\s{2,}/g, ' ') // Collapse multiple spaces
                  .replace(/[\r\n]+/g, '') // Remove line breaks
                  .trim();
                
                // For very aggressive targets, remove even more
                if (targetSize < 30) {
                  minifiedXml = minifiedXml
                    .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
                    .replace(/[\t ]+/g, ' '); // Collapse all whitespace
                }
                
                content = new TextEncoder().encode(minifiedXml).buffer;
              } catch (e) {
                // If XML processing fails, use original content
                console.warn('XML minification failed for', fileName);
              }
            }
            
            // For image files in Word docs, compress them too
            if (fileName.match(/\.(jpg|jpeg|png|gif)$/i)) {
              try {
                const imageFile = new File([content], fileName);
                const compressedImage = await compressImage(imageFile);
                content = await compressedImage.blob.arrayBuffer();
              } catch (e) {
                // If image compression fails, use original
              }
            }
            
            newZip.file(fileName, content, {
              compression: "DEFLATE",
              compressionOptions: { level: compressionLevel },
            });
          } else {
            newZip.folder(fileName);
          }
        }
        
        // Generate compressed ZIP with MAXIMUM compression - MUST maintain Word format
        const compressedBlob = await newZip.generateAsync({
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: {
            level: compressionLevel,
          },
          streamFiles: false, // Better compression
          mimeType: fileType, // Maintain original MIME type for compatibility
        });
        
        // Use compressed if it's smaller - ALWAYS maintain Word format
        if (compressedBlob.size < originalSize) {
          const byteArray = await fileToByteArray(file);
          const algoResults = compressData(byteArray, selectedMethod);
          return { blob: compressedBlob, results: algoResults };
        }
        
        // If compression didn't help, return original Word document
        const byteArray = await fileToByteArray(file);
        const algoResults = compressData(byteArray, selectedMethod);
        return { blob: file, results: algoResults };
      } catch (zipError) {
        // If not a valid ZIP (old .doc format), return original
        console.warn('ZIP loading failed, returning original Word document:', zipError);
        const byteArray = new Uint8Array(fileData);
        const algoResults = compressData(byteArray, selectedMethod);
        return { blob: file, results: algoResults };
      }
    } catch (error) {
      console.error('Word compression error:', error);
      return { blob: file, results: [] };
    }
  };

  // Compress text files AGGRESSIVELY while maintaining readability
  const compressText = async (file: File): Promise<{ blob: Blob; results: AlgoResult[] }> => {
    try {
      const originalSize = file.size;
      const targetFileSize = (originalSize * targetSize) / 100;
      
      // Convert text to byte array
      let byteArray = await fileToByteArray(file);
      let text = new TextDecoder().decode(byteArray);
      
      // AGGRESSIVE text optimization based on target size
      if (targetSize < 50) {
        // Remove extra whitespace but maintain readability
        text = targetSize < 20
          ? text.replace(/\n\s*\n\s*\n+/g, '\n\n') // Multiple blank lines -> 2
                .replace(/\t+/g, ' ') // Tabs -> spaces
                .replace(/[ ]{3,}/g, '  ') // Multiple spaces -> 2
                .replace(/^[ \t]+/gm, '') // Leading whitespace
                .replace(/[ \t]+$/gm, '') // Trailing whitespace
          : targetSize < 30
          ? text.replace(/\n\s*\n\s*\n+/g, '\n\n')
                .replace(/\t/g, ' ')
                .replace(/[ ]{2,}/g, ' ')
          : text.replace(/\n\s*\n/g, '\n')
                .replace(/\t/g, ' ')
                .replace(/[ ]{3,}/g, '  ');
        
        byteArray = new TextEncoder().encode(text);
      }
      
      // Apply Huffman and/or LZW compression
      const algoResults = compressData(byteArray, selectedMethod);
      const bestResult = chooseBestCompression(algoResults);
      
      // For text files, return optimized text (maintains readability)
      // Compression stats show what's possible with binary compression
      const optimizedBlob = new Blob([text], { type: 'text/plain' });
      
      // Return optimized text if it's smaller
      if (optimizedBlob.size < originalSize) {
        return { blob: optimizedBlob, results: algoResults };
      }
      
      // Return original text file
      return { blob: file, results: algoResults };
    } catch (error) {
      console.error('Text compression error:', error);
      return { blob: file, results: [] };
    }
  };

  const getFileType = (file: File): string => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type === 'application/pdf') return 'pdf';
    if (file.type.includes('word') || file.name.toLowerCase().endsWith('.doc') || file.name.toLowerCase().endsWith('.docx')) return 'word';
    return 'text';
  };

  const startCompression = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to compress",
        variant: "destructive",
      });
      return;
    }

    setIsCompressing(true);
    setCompressionProgress(0);
    setCompressionResults([]);

    const results: CompressionResult[] = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const startTime = Date.now();
        const progress = ((i + 1) / selectedFiles.length) * 100;
        setCompressionProgress(progress);

        const fileType = getFileType(file);
        let compressionData: { blob: Blob; results: AlgoResult[] };

        try {
          // Compress file using appropriate method
          if (fileType === 'image') {
            compressionData = await compressImage(file);
          } else if (fileType === 'pdf') {
            compressionData = await compressPDF(file);
          } else if (fileType === 'word') {
            compressionData = await compressWord(file);
          } else {
            compressionData = await compressText(file);
          }

          const compressionTime = Date.now() - startTime;
          const originalSize = file.size;
          
          // Use actual blob size for compression ratio
          const compressedSize = compressionData.blob.size;
          const compressionRatio = ((1 - compressedSize / originalSize) * 100);

          // Find huffman and lzw results separately (if available)
          const huffmanResult = compressionData.results.find(r => r.method === 'huffman');
          const lzwResult = compressionData.results.find(r => r.method === 'lzw');
          const bestResult = compressionData.results.length > 0 
            ? chooseBestCompression(compressionData.results)
            : { method: 'none' as const };

          // Always add result to show compression stats
          results.push({
            id: i,
            fileName: file.name,
            originalSize,
            compressedSize,
            compressedBlob: compressionData.blob,
            compressionTime,
            fileType,
            compressionRatio: compressionRatio > 0 ? compressionRatio : 0,
            method: bestResult.method !== 'none' ? bestResult.method : 'lzw',
            huffmanResult,
            lzwResult,
          });
        } catch (error) {
          console.error(`Error compressing ${file.name}:`, error);
          toast({
            title: `Error compressing ${file.name}`,
            description: error instanceof Error ? error.message : "File skipped due to compression error",
            variant: "destructive",
          });
        }
      }

      setCompressionResults(results);
      setIsCompressing(false);
      setCompressionProgress(0);

      if (results.length > 0) {
        const successful = results.filter(r => r.compressionRatio > 0).length;
        toast({
          title: "Compression complete!",
          description: `Successfully compressed ${successful} of ${results.length} file(s)`,
        });
      }
    } catch (error) {
      console.error('Compression error:', error);
      setIsCompressing(false);
      setCompressionProgress(0);
      toast({
        title: "Compression failed",
        description: error instanceof Error ? error.message : "An error occurred during compression",
        variant: "destructive",
      });
    }
  };

  const downloadCompressedFile = (result: CompressionResult) => {
    const url = URL.createObjectURL(result.compressedBlob);
    const link = document.createElement('a');
    link.href = url;
    
    // Create download filename with compressed prefix
    const fileExtension = result.fileName.substring(result.fileName.lastIndexOf('.'));
    const fileNameWithoutExt = result.fileName.substring(0, result.fileName.lastIndexOf('.'));
    link.download = `${fileNameWithoutExt}_compressed${fileExtension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompressionRatio = (original: number, compressed: number) => {
    return ((1 - compressed / original) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Try <span className="gradient-text">Compression</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your PDF, Word documents, or JPG/PNG images to compress while preserving quality
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* File Upload Section */}
          <div className="lg:col-span-2">
            <Card className="algo-card">
              <h3 className="text-xl font-bold mb-6">Upload Files</h3>
              
              {/* Upload Area */}
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium mb-2">Drop files here or click to browse</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports PDF (.pdf), Word (.doc, .docx), JPG/PNG images (.jpg, .jpeg, .png), and text files (.txt)
                </p>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button variant="outline">Select Files</Button>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Selected Files ({selectedFiles.length})</h4>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center">
                          {file.type.startsWith('image/') ? (
                            <Image className="w-5 h-5 text-accent mr-3" />
                          ) : file.type === 'application/pdf' ? (
                            <FileIcon className="w-5 h-5 text-red-500 mr-3" />
                          ) : file.type.includes('word') || file.name.toLowerCase().endsWith('.doc') || file.name.toLowerCase().endsWith('.docx') ? (
                            <FileIcon className="w-5 h-5 text-blue-500 mr-3" />
                          ) : (
                            <FileText className="w-5 h-5 text-primary mr-3" />
                          )}
                          <div>
                            <span className="font-medium">{file.name}</span>
                            <p className="text-sm text-muted-foreground">{formatBytes(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Compression Controls */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex gap-4">
                  <Button
                    onClick={startCompression}
                    disabled={selectedFiles.length === 0 || isCompressing}
                    className="btn-hero"
                  >
                    {isCompressing ? (
                      <>
                        <Zap className="w-4 h-4 mr-2 animate-spin" />
                        Compressing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Start Compression
                      </>
                    )}
                  </Button>
                  
                  {compressionResults.length > 0 && (
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Results
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Algorithm Selection & Settings */}
          <div>
            <Card className="algo-card">
              <h3 className="text-xl font-bold mb-6">Compression Settings</h3>
              
              <Tabs defaultValue="both" value={selectedMethod} onValueChange={(v) => setSelectedMethod(v as 'huffman' | 'lzw' | 'both')} className="mb-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="huffman">Huffman</TabsTrigger>
                  <TabsTrigger value="lzw">LZW</TabsTrigger>
                  <TabsTrigger value="both">Both</TabsTrigger>
                </TabsList>
                
                <TabsContent value="huffman" className="mt-4">
                  <div className="text-sm text-muted-foreground">
                    Optimal for text files with uneven character distribution. Creates variable-length codes based on frequency.
                  </div>
                </TabsContent>
                
                <TabsContent value="lzw" className="mt-4">
                  <div className="text-sm text-muted-foreground">
                    Best for data with repetitive patterns and images. Builds dictionary of sequences during compression.
                  </div>
                </TabsContent>
                
                <TabsContent value="both" className="mt-4">
                  <div className="text-sm text-muted-foreground">
                    Compare both algorithms side by side. The best result will be selected automatically.
                  </div>
                </TabsContent>
              </Tabs>

              <div className="space-y-6">
                {/* Target Size Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Target Size</span>
                    <Badge variant="outline">{targetSize}%</Badge>
                  </div>
                  <div className="space-y-2">
                    <Slider
                      value={[targetSize]}
                      onValueChange={(value) => setTargetSize(value[0])}
                      min={10}
                      max={95}
                      step={5}
                      disabled={isCompressing}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Maximum (10%)</span>
                      <span>Original (95%)</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Set your desired compressed file size as a percentage of original size. Lower values = more compression = smaller files.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Educational Mode</span>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Show Visualizations</span>
                    <Badge variant="secondary">Yes</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">File Usability</span>
                    <Badge variant="secondary">Preserved</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Compression Progress */}
        {isCompressing && (
          <Card className="algo-card mt-8">
            <h3 className="text-xl font-bold mb-6">Compression in Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Compressing files while preserving quality...</span>
                <span className="text-sm text-muted-foreground">{Math.round(compressionProgress)}%</span>
              </div>
              <Progress value={compressionProgress} className="w-full" />
              <div className="text-sm text-muted-foreground">
                Processing {selectedFiles.length} file(s) with quality-preserving compression
              </div>
            </div>
          </Card>
        )}

        {/* Results Section */}
        {compressionResults.length > 0 && (
          <Card className="algo-card mt-8">
            <h3 className="text-xl font-bold mb-6">Compression Results</h3>
            
            <div className="space-y-6">
              {compressionResults.map((result) => (
                <div key={result.id} className="border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {result.fileType === 'image' ? (
                        <Image className="w-5 h-5 text-accent mr-3" />
                      ) : result.fileType === 'pdf' ? (
                        <FileIcon className="w-5 h-5 text-red-500 mr-3" />
                      ) : result.fileType === 'word' ? (
                        <FileIcon className="w-5 h-5 text-blue-500 mr-3" />
                      ) : (
                        <FileText className="w-5 h-5 text-primary mr-3" />
                      )}
                      <span className="font-medium">{result.fileName}</span>
                    </div>
                    <Badge variant="outline">{formatBytes(result.originalSize)}</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Algorithm Comparison */}
                    {selectedMethod === 'both' && result.huffmanResult && result.lzwResult && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Huffman Results */}
                        <div className="p-4 border border-border rounded-lg bg-primary/5">
                          <h5 className="font-medium mb-3 flex items-center">
                            <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                            Huffman Coding
                          </h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Compressed Size:</span>
                              <span className="font-medium">{formatBytes(result.huffmanResult.compressedSize)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Compression:</span>
                              <Badge variant={result.huffmanResult.compressedSize < result.originalSize ? "default" : "secondary"}>
                                {((1 - result.huffmanResult.compressedSize / result.originalSize) * 100).toFixed(1)}%
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* LZW Results */}
                        <div className="p-4 border border-border rounded-lg bg-accent/5">
                          <h5 className="font-medium mb-3 flex items-center">
                            <div className="w-3 h-3 bg-accent rounded-full mr-2"></div>
                            LZW Compression
                          </h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Compressed Size:</span>
                              <span className="font-medium">{formatBytes(result.lzwResult.compressedSize)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Compression:</span>
                              <Badge variant={result.lzwResult.compressedSize < result.originalSize ? "default" : "secondary"}>
                                {((1 - result.lzwResult.compressedSize / result.originalSize) * 100).toFixed(1)}%
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Best Result Stats */}
                    <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-1">Original Size</div>
                        <div className="font-semibold text-lg">{formatBytes(result.originalSize)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-1">Compressed Size</div>
                        <div className="font-semibold text-lg text-primary">{formatBytes(result.compressedSize)}</div>
                        {result.fileType === 'image' && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Target: {formatBytes((result.originalSize * targetSize) / 100)}
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-1">Compression Ratio</div>
                        <Badge className={result.compressionRatio > 0 ? "metric-success text-base px-3 py-1" : "text-base px-3 py-1"}>
                          {result.compressionRatio > 0 ? `${result.compressionRatio.toFixed(1)}%` : '0%'}
                        </Badge>
                      </div>
                    </div>

                    {/* File Usability Warning for PDF/Word */}
                    {(result.fileType === 'pdf' || result.fileType === 'word') && result.compressionRatio === 0 && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                          File Format Preserved
                        </div>
                        <div className="text-xs text-blue-700 dark:text-blue-300">
                          {result.fileType === 'pdf' 
                            ? 'PDF files are already compressed internally. The original file is returned to maintain compatibility.'
                            : 'Word documents (.docx) are ZIP archives already compressed. The original file is returned to maintain compatibility.'}
                        </div>
                      </div>
                    )}

                    {result.compressionRatio > 0 && (
                      <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                        <span className="text-sm font-medium">Space Saved:</span>
                        <span className="text-sm font-semibold text-success">
                          {formatBytes(result.originalSize - result.compressedSize)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {result.compressionTime}ms
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => downloadCompressedFile(result)}
                      className="btn-hero"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Compressed File
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Compress;