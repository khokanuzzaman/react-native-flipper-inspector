# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do Not Disclose Publicly

**Do not** create a public GitHub issue for security vulnerabilities. This could put users at risk.

### 2. Report Privately

Send an email to: **security@your-org.com** (replace with actual email)

Include the following information:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Any suggested fixes or mitigations

### 3. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution**: Within 30 days (depending on complexity)

### 4. Disclosure Process

- We will work with you to understand and resolve the issue
- Once fixed, we will release a security update
- We will credit you in the security advisory (unless you prefer to remain anonymous)

## Security Considerations

### Data Privacy

This library is designed with privacy in mind:

- **No Data Collection**: We don't collect or transmit any user data
- **Local Only**: All debugging data stays on your device
- **Redaction Support**: Built-in support for redacting sensitive information
- **Production Safe**: Automatically disabled in production builds

### Network Security

- **Header Redaction**: Automatically redact sensitive headers like `authorization`
- **Body Redaction**: Option to redact request/response bodies
- **HTTPS Only**: Network monitoring respects HTTPS/TLS

### Code Security

- **TypeScript**: Strict type checking prevents many runtime errors
- **Input Validation**: All inputs are validated and sanitized
- **Safe Serialization**: JSON serialization with cycle detection and size limits
- **Error Handling**: Comprehensive error handling prevents crashes

## Best Practices

### For Developers

1. **Keep Dependencies Updated**
   ```bash
   pnpm audit
   pnpm update
   ```

2. **Use Production Builds**
   ```typescript
   // Inspector is automatically disabled in production
   init({ enabled: __DEV__ });
   ```

3. **Redact Sensitive Data**
   ```typescript
   patchNetwork({
     redactHeaders: ['authorization', 'cookie', 'x-api-key'],
     redactBody: true, // For sensitive APIs
   });
   ```

4. **Limit Payload Size**
   ```typescript
   init({
     maxPayloadSize: 10240, // 10KB limit
   });
   ```

### For Organizations

1. **Security Audit**
   - Regularly audit your dependencies
   - Use tools like `npm audit` or `yarn audit`
   - Consider using `pnpm audit` for this project

2. **Code Review**
   - Review all changes before merging
   - Pay special attention to network and data handling code
   - Ensure proper error handling

3. **Monitoring**
   - Monitor for unusual network activity
   - Set up alerts for failed requests
   - Log security-related events

## Known Security Considerations

### 1. Debug Information Exposure

**Risk**: Debug information might contain sensitive data
**Mitigation**: 
- Use redaction features
- Limit payload sizes
- Disable in production

### 2. Network Traffic Monitoring

**Risk**: Network monitoring might capture sensitive requests
**Mitigation**:
- Redact sensitive headers
- Redact request/response bodies when needed
- Use allowlists for endpoints

### 3. State Information

**Risk**: Application state might contain sensitive information
**Mitigation**:
- Use whitelist/blacklist for Redux integration
- Custom serializers to filter sensitive data
- Regular state cleanup

## Security Updates

Security updates will be released as:
- **Patch releases** (1.0.1, 1.0.2, etc.) for critical fixes
- **Minor releases** (1.1.0, 1.2.0, etc.) for security improvements
- **Major releases** (2.0.0, etc.) for breaking security changes

## Contact

For security-related questions or concerns:

- **Email**: security@your-org.com
- **GitHub**: Create a private security advisory
- **Discord**: Join our security channel (if available)

## Acknowledgments

We thank the security researchers and developers who help keep this project secure:

- [List of security contributors]

## Changelog

### Security Updates

- **v1.0.1** - Fixed potential XSS in Flipper plugin
- **v1.0.0** - Initial release with security features

---

**Note**: This security policy is subject to change. Please check back regularly for updates.
