/// <reference types="vite/client" />

// Compression Stream API types (for browser compression)
interface CompressionStream {
  readonly writable: WritableStream<Uint8Array>;
  readonly readable: ReadableStream<Uint8Array>;
}

interface CompressionStreamConstructor {
  new (format: 'deflate' | 'deflate-raw' | 'gzip'): CompressionStream;
}

interface DecompressionStream {
  readonly writable: WritableStream<Uint8Array>;
  readonly readable: ReadableStream<Uint8Array>;
}

interface DecompressionStreamConstructor {
  new (format: 'deflate' | 'deflate-raw' | 'gzip'): DecompressionStream;
}

interface Window {
  CompressionStream?: CompressionStreamConstructor;
  DecompressionStream?: DecompressionStreamConstructor;
}