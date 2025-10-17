/**
 * Safe JSON serialization with cycle detection and size limits
 */

export interface SerializeOptions {
  maxSize?: number;
  maxDepth?: number;
  replacer?: (key: string, value: any) => any;
}

const DEFAULT_OPTIONS: Required<SerializeOptions> = {
  maxSize: 10240, // 10KB
  maxDepth: 10,
  replacer: (_, value) => value,
};

/**
 * Safely serialize an object to JSON with cycle detection and size limits
 */
export function safeStringify(
  obj: any,
  options: SerializeOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const seen = new WeakSet();
  let size = 0;

  const replacer = (key: string, value: any, depth = 0): any => {
    // Check depth limit
    if (depth > opts.maxDepth) {
      return '[Max Depth Reached]';
    }

    // Check size limit (rough estimation)
    const stringified = JSON.stringify(value);
    if (size + stringified.length > opts.maxSize) {
      return '[Size Limit Reached]';
    }

    // Handle cycles
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular Reference]';
      }
      seen.add(value);
    }

    // Apply custom replacer
    const result = opts.replacer(key, value);

    // Update size counter
    size += JSON.stringify(result).length;

    return result;
  };

  try {
    const result = JSON.stringify(obj, (key, value) => replacer(key, value, 0));
    return result;
  } catch (error) {
    return `[Serialization Error: ${error instanceof Error ? error.message : 'Unknown error'}]`;
  }
}

/**
 * Safely parse JSON with error handling
 */
export function safeParse(json: string): any {
  try {
    return JSON.parse(json);
  } catch (error) {
    return { error: 'Parse Error', message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Redact sensitive information from headers
 */
export function redactHeaders(
  headers: Record<string, string>,
  sensitiveKeys: string[]
): Record<string, string> {
  const redacted = { ...headers };
  
  for (const key of sensitiveKeys) {
    const lowerKey = key.toLowerCase();
    for (const headerKey in redacted) {
      if (headerKey.toLowerCase() === lowerKey) {
        redacted[headerKey] = '[REDACTED]';
      }
    }
  }

  return redacted;
}

/**
 * Truncate string to maximum length
 */
export function truncateString(str: string, maxLength: number = 1000): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength - 3) + '...';
}
