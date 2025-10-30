/**
 * Clipboard utility with graceful fallbacks across React Native versions.
 *
 * React Native 0.70+ removed the built-in Clipboard export in favour of
 * `@react-native-clipboard/clipboard`. We attempt to load the community
 * package first and gracefully fall back to the legacy API when available.
 */

type ClipboardModule = {
  setString: (value: string) => void | Promise<void>;
};

const clipboardModule: ClipboardModule | null = (() => {
  try {
    // Prefer the community clipboard module for modern React Native versions.
    // eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment
    const modernClipboard = require('@react-native-clipboard/clipboard') as ClipboardModule;
    if (modernClipboard && typeof modernClipboard.setString === 'function') {
      return modernClipboard;
    }
  } catch (error) {
    // Module not installed – fall back to legacy lookup below.
  }

  try {
    // Legacy React Native (<0.70) re-exported Clipboard from core.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const legacyClipboard = require('react-native').Clipboard as ClipboardModule | undefined;
    if (legacyClipboard && typeof legacyClipboard.setString === 'function') {
      return legacyClipboard;
    }
  } catch (error) {
    // Clipboard is truly unavailable.
  }

  return null;
})();

/**
 * Copy helper that resolves once the text is written to the clipboard.
 * Throws when no clipboard implementation is available.
 */
export async function copyToClipboard(value: string): Promise<void> {
  if (!clipboardModule) {
    throw new Error(
      'Clipboard module is not available. Install @react-native-clipboard/clipboard to enable copy actions.'
    );
  }

  const result = clipboardModule.setString(value);
  if (result instanceof Promise) {
    await result;
  }
}

/**
 * Utility for consumers that need to check clipboard availability.
 */
export function isClipboardAvailable(): boolean {
  return clipboardModule !== null;
}
