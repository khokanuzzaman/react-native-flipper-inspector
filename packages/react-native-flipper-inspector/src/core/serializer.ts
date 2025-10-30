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
  const seenStack: any[] = [];

  const sanitize = (value: any, depth: number): any => {
    if (depth > opts.maxDepth) {
      return '[Max Depth Reached]';
    }

    if (value === null) {
      return null;
    }

    const valueType = typeof value;

    if (valueType === 'object') {
      if (seenStack.includes(value)) {
        return '[Circular Reference]';
      }

      seenStack.push(value);

      try {
        if (Array.isArray(value)) {
          const result = value.map((item) => {
            try {
              const sanitizedItem = sanitize(item, depth + 1);
              return sanitizedItem === undefined ? null : sanitizedItem;
            } catch (error) {
              return `[Serialization Error: ${
                error instanceof Error ? error.message : 'Unknown error'
              }]`;
            }
          });

          seenStack.pop();
          return result;
        }

        const result: Record<string, any> = {};

        for (const key of Object.keys(value)) {
          let propertyValue: any;
          try {
            propertyValue = (value as any)[key];
          } catch (error) {
            result[key] = `[Serialization Error: ${
              error instanceof Error ? error.message : 'Unknown error'
            }]`;
            continue;
          }

          try {
            const sanitizedValue = sanitize(propertyValue, depth + 1);
            if (sanitizedValue !== undefined) {
              result[key] = sanitizedValue;
            }
          } catch (error) {
            result[key] = `[Serialization Error: ${
              error instanceof Error ? error.message : 'Unknown error'
            }]`;
          }
        }

        seenStack.pop();
        return result;
      } catch (error) {
        seenStack.pop();
        return `[Serialization Error: ${error instanceof Error ? error.message : 'Unknown error'}]`;
      }
    }

    if (valueType === 'function' || valueType === 'symbol') {
      return undefined;
    }

    if (valueType === 'undefined') {
      return undefined;
    }

    return value;
  };

  try {
    const sanitized = sanitize(obj, 0);
    const serialized = JSON.stringify(sanitized, opts.replacer);

    if (typeof serialized !== 'string') {
      return 'undefined';
    }

    if (serialized.length > opts.maxSize) {
      return '[Size Limit Reached]';
    }

    return serialized;
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
