import { useEffect, useRef } from 'react';

interface BarcodeScannerOptions {
  onScan: (barcode: string) => void;
  minChars?: number;
  maxIntervalMs?: number;
}

export function useBarcodeScanner({
  onScan,
  minChars = 3,
  maxIntervalMs = 60,
}: BarcodeScannerOptions) {
  const bufferRef = useRef<string>('');
  const lastKeyTimeRef = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        (activeEl as HTMLElement)?.isContentEditable;

      const now = performance.now();
      const interval = now - lastKeyTimeRef.current;
      lastKeyTimeRef.current = now;

      // Enter key completes scan
      if (e.key === 'Enter') {
        const scannedCode = bufferRef.current.trim();
        bufferRef.current = '';

        if (scannedCode.length >= minChars) {
          // If the user was in an input, but the buffer came fast like a scanner, prevent submit & trigger scan
          if (isInput && interval < 100) {
            e.preventDefault();
            e.stopPropagation();
          }
          onScan(scannedCode);
        }
        return;
      }

      // Ignore special navigation keys
      if (e.key.length > 1) {
        return;
      }

      // If typing too slowly and user is in an active input, reset buffer so we don't interfere with typing
      if (isInput && interval > maxIntervalMs && bufferRef.current.length > 0) {
        bufferRef.current = '';
      }

      // Accumulate buffer
      bufferRef.current += e.key;

      // Auto-clear buffer if idle for > 400ms
      setTimeout(() => {
        if (performance.now() - lastKeyTimeRef.current > 400) {
          bufferRef.current = '';
        }
      }, 450);
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [onScan, minChars, maxIntervalMs]);
}
