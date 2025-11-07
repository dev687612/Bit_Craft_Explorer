// Compression Algorithms: Huffman Coding and LZW

interface HuffmanNode {
  char?: number;
  frequency: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
}

interface CompressionResult {
  compressed: Uint8Array;
  tree: HuffmanNode | null;
  originalSize: number;
  compressedSize: number;
  method: 'huffman' | 'lzw';
}

// ==================== HUFFMAN CODING ====================

function buildFrequencyTable(data: Uint8Array): Map<number, number> {
  const frequencies = new Map<number, number>();
  
  for (let i = 0; i < data.length; i++) {
    const byte = data[i];
    frequencies.set(byte, (frequencies.get(byte) || 0) + 1);
  }
  
  return frequencies;
}

function buildHuffmanTree(frequencies: Map<number, number>): HuffmanNode {
  const nodes: HuffmanNode[] = [];
  
  // Create leaf nodes for each character
  frequencies.forEach((freq, char) => {
    nodes.push({ char, frequency: freq });
  });
  
  // Build tree by combining nodes
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.frequency - b.frequency);
    
    const left = nodes.shift()!;
    const right = nodes.shift()!;
    
    nodes.push({
      frequency: left.frequency + right.frequency,
      left,
      right,
    });
  }
  
  return nodes[0];
}

function buildCodes(node: HuffmanNode, prefix: string = '', codes: Map<number, string> = new Map()): Map<number, string> {
  if (node.char !== undefined) {
    codes.set(node.char, prefix || '0');
  } else {
    if (node.left) buildCodes(node.left, prefix + '0', codes);
    if (node.right) buildCodes(node.right, prefix + '1', codes);
  }
  return codes;
}

function encodeHuffman(data: Uint8Array): { compressed: Uint8Array; tree: HuffmanNode } {
  if (data.length === 0) {
    return { compressed: new Uint8Array(0), tree: { frequency: 0 } };
  }
  
  const frequencies = buildFrequencyTable(data);
  
  // If all bytes are the same, special case
  if (frequencies.size === 1) {
    const [byte] = Array.from(frequencies.keys());
    const tree: HuffmanNode = { char: byte, frequency: data.length };
    // Return compressed as single byte with count (6 bytes total)
    const compressed = new Uint8Array(6);
    compressed[0] = 1; // Flag: single byte
    compressed[1] = byte;
    compressed[2] = (data.length >>> 24) & 0xFF;
    compressed[3] = (data.length >>> 16) & 0xFF;
    compressed[4] = (data.length >>> 8) & 0xFF;
    compressed[5] = data.length & 0xFF;
    return { compressed, tree };
  }
  
  const tree = buildHuffmanTree(frequencies);
  const codes = buildCodes(tree);
  
  // Encode data
  let bitString = '';
  for (let i = 0; i < data.length; i++) {
    bitString += codes.get(data[i]) || '';
  }
  
  // Convert bit string to bytes
  const bitLength = bitString.length;
  const byteLength = Math.ceil(bitLength / 8);
  const compressed = new Uint8Array(byteLength + 5); // +4 for length, +1 for padding
  
  // Store original data length (4 bytes)
  compressed[0] = (data.length >>> 24) & 0xFF;
  compressed[1] = (data.length >>> 16) & 0xFF;
  compressed[2] = (data.length >>> 8) & 0xFF;
  compressed[3] = data.length & 0xFF;
  
  // Store bit string
  for (let i = 0; i < bitLength; i++) {
    const bitIndex = i % 8;
    const byteIndex = Math.floor(i / 8) + 4;
    
    if (bitString[i] === '1') {
      compressed[byteIndex] |= (1 << (7 - bitIndex));
    }
  }
  
  // Store padding info in last byte
  const paddingBits = (8 - (bitLength % 8)) % 8;
  compressed[compressed.length - 1] = paddingBits;
  
  return { compressed, tree };
}

function serializeHuffmanTree(node: HuffmanNode): Uint8Array {
  // Simple tree serialization: estimate size based on unique bytes
  // In a real implementation, you'd serialize the tree properly
  // For now, we estimate the overhead
  const uniqueBytes = node.frequency > 0 ? 256 : 0;
  // Rough estimate: 4 bytes per unique character in tree
  return new Uint8Array(uniqueBytes * 4);
}

export function compressHuffman(data: Uint8Array): CompressionResult {
  if (data.length < 100) {
    // For very small files, compression overhead is too high
    return {
      compressed: data,
      tree: null,
      originalSize: data.length,
      compressedSize: data.length,
      method: 'huffman',
    };
  }
  
  const { compressed, tree } = encodeHuffman(data);
  
  // Better tree overhead estimation based on unique bytes
  const frequencies = buildFrequencyTable(data);
  const uniqueBytes = frequencies.size;
  // Tree serialization: each node needs ~5 bytes (char + frequency + pointers)
  const treeOverhead = uniqueBytes <= 1 ? 6 : (uniqueBytes * 5);
  
  // Only use compression if it's actually beneficial
  const totalSize = compressed.length + treeOverhead;
  
  // If compression makes it larger, return original
  if (totalSize >= data.length) {
    return {
      compressed: data,
      tree: null,
      originalSize: data.length,
      compressedSize: data.length,
      method: 'huffman',
    };
  }
  
  return {
    compressed,
    tree,
    originalSize: data.length,
    compressedSize: totalSize,
    method: 'huffman',
  };
}

// ==================== LZW COMPRESSION ====================

export function compressLZW(data: Uint8Array): CompressionResult {
  if (data.length === 0) {
    return {
      compressed: new Uint8Array(0),
      tree: null,
      originalSize: 0,
      compressedSize: 0,
      method: 'lzw',
    };
  }
  
  if (data.length < 100) {
    // For very small files, compression overhead is too high
    return {
      compressed: data,
      tree: null,
      originalSize: data.length,
      compressedSize: data.length,
      method: 'lzw',
    };
  }
  
  // Initialize dictionary with all possible bytes (0-255)
  const dictionary = new Map<string, number>();
  let dictSize = 256;
  
  // Initialize dictionary with single bytes
  for (let i = 0; i < 256; i++) {
    dictionary.set(String.fromCharCode(i), i);
  }
  
  const output: number[] = [];
  let w = String.fromCharCode(data[0]);
  
  for (let i = 1; i < data.length; i++) {
    const c = String.fromCharCode(data[i]);
    const wc = w + c;
    
    if (dictionary.has(wc)) {
      w = wc;
    } else {
      // Output code for w
      output.push(dictionary.get(w)!);
      
      // Add wc to dictionary
      if (dictSize < 65536) { // Limit dictionary size to prevent memory issues
        dictionary.set(wc, dictSize++);
      }
      
      w = c;
    }
  }
  
  // Output code for remaining w
  if (w.length > 0) {
    output.push(dictionary.get(w)!);
  }
  
  // Check if compression is beneficial
  // Overhead: 4 bytes (data length) + 4 bytes (output count) + 2 bytes per code
  const overhead = 8;
  const codeSize = output.length * 2;
  const totalSize = overhead + codeSize;
  
  // If compression doesn't help, return original
  if (totalSize >= data.length) {
    return {
      compressed: data,
      tree: null,
      originalSize: data.length,
      compressedSize: data.length,
      method: 'lzw',
    };
  }
  
  // Convert output codes to bytes
  // Store original data length first (4 bytes)
  const compressed: number[] = [
    (data.length >>> 24) & 0xFF,
    (data.length >>> 16) & 0xFF,
    (data.length >>> 8) & 0xFF,
    data.length & 0xFF,
  ];
  
  // Store output count (4 bytes)
  compressed.push((output.length >>> 24) & 0xFF);
  compressed.push((output.length >>> 16) & 0xFF);
  compressed.push((output.length >>> 8) & 0xFF);
  compressed.push(output.length & 0xFF);
  
  // Store codes using 2 bytes per code (up to 65535)
  for (const code of output) {
    compressed.push((code >>> 8) & 0xFF);
    compressed.push(code & 0xFF);
  }
  
  const compressedArray = new Uint8Array(compressed);
  
  return {
    compressed: compressedArray,
    tree: null,
    originalSize: data.length,
    compressedSize: compressedArray.length,
    method: 'lzw',
  };
}

// ==================== COMPRESSION UTILITIES ====================

export function compressData(
  data: Uint8Array,
  method: 'huffman' | 'lzw' | 'both' = 'both'
): CompressionResult[] {
  const results: CompressionResult[] = [];
  
  if (method === 'huffman' || method === 'both') {
    const huffmanResult = compressHuffman(data);
    results.push(huffmanResult);
  }
  
  if (method === 'lzw' || method === 'both') {
    const lzwResult = compressLZW(data);
    results.push(lzwResult);
  }
  
  return results;
}

// Choose best compression result
export function chooseBestCompression(results: CompressionResult[]): CompressionResult {
  if (results.length === 0) {
    throw new Error('No compression results available');
  }
  
  // Choose the one with smallest compressed size relative to original
  return results.reduce((best, current) => {
    const bestRatio = best.compressedSize / best.originalSize;
    const currentRatio = current.compressedSize / current.originalSize;
    
    return currentRatio < bestRatio ? current : best;
  });
}

// Convert file to byte array
export async function fileToByteArray(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

// Convert byte array to blob
export function byteArrayToBlob(data: Uint8Array, mimeType: string): Blob {
  // Create a new ArrayBuffer to avoid SharedArrayBuffer issues
  const newBuffer = new ArrayBuffer(data.length);
  const newArray = new Uint8Array(newBuffer);
  newArray.set(data);
  return new Blob([newBuffer], { type: mimeType });
}

