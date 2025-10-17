import { describe, it, expect } from 'vitest';
import { safeStringify, safeParse, redactHeaders, truncateString } from '../core/serializer';

describe('Serializer', () => {
  describe('safeStringify', () => {
    it('should stringify simple objects', () => {
      const obj = { name: 'John', age: 30 };
      const result = safeStringify(obj);
      expect(result).toBe('{"name":"John","age":30}');
    });

    it('should handle circular references', () => {
      const obj: any = { name: 'John' };
      obj.self = obj;
      
      const result = safeStringify(obj);
      expect(result).toContain('[Circular Reference]');
    });

    it('should respect size limits', () => {
      const largeObj = { data: 'x'.repeat(10000) };
      const result = safeStringify(largeObj, { maxSize: 100 });
      
      expect(result).toContain('[Size Limit Reached]');
    });

    it('should respect depth limits', () => {
      const deepObj = { level1: { level2: { level3: { level4: { level5: 'deep' } } } } };
      const result = safeStringify(deepObj, { maxDepth: 2 });
      
      expect(result).toContain('[Max Depth Reached]');
    });

    it('should handle errors gracefully', () => {
      const obj = {
        get value() {
          throw new Error('Getter error');
        }
      };
      
      const result = safeStringify(obj);
      expect(result).toContain('[Serialization Error');
    });
  });

  describe('safeParse', () => {
    it('should parse valid JSON', () => {
      const json = '{"name":"John","age":30}';
      const result = safeParse(json);
      expect(result).toEqual({ name: 'John', age: 30 });
    });

    it('should handle invalid JSON', () => {
      const invalidJson = '{"name":"John",age:30}';
      const result = safeParse(invalidJson);
      expect(result).toEqual({ error: 'Parse Error', message: expect.any(String) });
    });
  });

  describe('redactHeaders', () => {
    it('should redact sensitive headers', () => {
      const headers = {
        'authorization': 'Bearer token123',
        'content-type': 'application/json',
        'cookie': 'session=abc123',
        'x-api-key': 'secret-key'
      };
      
      const result = redactHeaders(headers, ['authorization', 'cookie', 'x-api-key']);
      
      expect(result).toEqual({
        'authorization': '[REDACTED]',
        'content-type': 'application/json',
        'cookie': '[REDACTED]',
        'x-api-key': '[REDACTED]'
      });
    });

    it('should be case insensitive', () => {
      const headers = {
        'Authorization': 'Bearer token123',
        'Content-Type': 'application/json'
      };
      
      const result = redactHeaders(headers, ['authorization']);
      
      expect(result).toEqual({
        'Authorization': '[REDACTED]',
        'Content-Type': 'application/json'
      });
    });
  });

  describe('truncateString', () => {
    it('should not truncate short strings', () => {
      const str = 'Hello World';
      const result = truncateString(str, 20);
      expect(result).toBe('Hello World');
    });

    it('should truncate long strings', () => {
      const str = 'This is a very long string that should be truncated';
      const result = truncateString(str, 20);
      expect(result).toBe('This is a very lo...');
      expect(result.length).toBe(20);
    });

    it('should use default max length', () => {
      const str = 'x'.repeat(1500);
      const result = truncateString(str);
      expect(result.length).toBe(1000);
      expect(result.endsWith('...')).toBe(true);
    });
  });
});
