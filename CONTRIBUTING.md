# Contributing to React Native Flipper Inspector

We welcome contributions to React Native Flipper Inspector! This guide will help you get started.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- React Native development environment
- Git

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/react-native-flipper-inspector.git
   cd react-native-flipper-inspector
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Build Packages**
   ```bash
   pnpm build
   ```

4. **Run Tests**
   ```bash
   pnpm test
   ```

## 📁 Project Structure

```
react-native-flipper-inspector/
├── packages/
│   ├── react-native-flipper-inspector/    # Core RN library
│   └── flipper-plugin-rn-inspector/       # Flipper desktop plugin
├── apps/
│   └── example/                           # Example React Native app
├── docs/                                  # Documentation
├── .github/
│   └── workflows/                         # CI/CD
└── package.json                           # Root package.json
```

## 🔧 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Changes

- Write code following our style guidelines
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm -F react-native-flipper-inspector test

# Test the example app
cd apps/example
pnpm android  # or pnpm ios
```

### 4. Lint and Format

```bash
# Check linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Check formatting
pnpm fmt:check

# Format code
pnpm fmt
```

### 5. Submit a Pull Request

1. Push your changes to your fork
2. Create a pull request against the main branch
3. Fill out the PR template completely
4. Request review from maintainers

## 📝 Code Style

### TypeScript

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use explicit return types for public APIs
- Add JSDoc comments for public functions

```typescript
/**
 * Log an event with optional payload
 * @param event - Event name/identifier
 * @param payload - Additional data to include
 */
export function log(event: string, payload?: Record<string, any>): void {
  // Implementation
}
```

### React/JSX

- Use functional components with hooks
- Prefer const assertions for props
- Use proper TypeScript types for props

```typescript
interface ComponentProps {
  readonly title: string;
  readonly onClick: () => void;
}

export const Component: React.FC<ComponentProps> = ({ title, onClick }) => {
  // Implementation
};
```

### Naming Conventions

- Use camelCase for functions and variables
- Use PascalCase for components and classes
- Use UPPER_SNAKE_CASE for constants
- Use descriptive names that explain intent

```typescript
// Good
const MAX_RETRY_ATTEMPTS = 3;
const userProfile = getUserProfile();
const UserProfileComponent = () => {};

// Avoid
const max = 3;
const up = getUserProfile();
const UserProfile = () => {};
```

## 🧪 Testing

### Unit Tests

- Write tests for all public APIs
- Aim for 95%+ code coverage
- Use descriptive test names
- Test both success and error cases

```typescript
describe('Inspector', () => {
  it('should log events with payload', () => {
    const logSpy = vi.spyOn(inspector as any, 'sendMessage');
    inspector.log('test-event', { key: 'value' });
    
    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'log',
        data: expect.objectContaining({
          event: 'test-event',
          payload: { key: 'value' },
        }),
      })
    );
  });
});
```

### Integration Tests

- Test the complete flow from RN app to Flipper plugin
- Test error handling and edge cases
- Test performance with large datasets

### Manual Testing

- Test on both Android and iOS
- Test with Hermes enabled and disabled
- Test in both debug and release modes

## 📚 Documentation

### API Documentation

- Document all public APIs with JSDoc
- Include usage examples
- Document parameters and return values
- Add type information

### User Documentation

- Update README files for significant changes
- Add troubleshooting information for new features
- Include code examples
- Update the example app to demonstrate new features

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment Information**
   - React Native version
   - Node.js version
   - Platform (Android/iOS)
   - Device/emulator details

2. **Reproduction Steps**
   - Clear, numbered steps
   - Expected vs actual behavior
   - Minimal code example if possible

3. **Additional Context**
   - Error messages and stack traces
   - Screenshots if applicable
   - Related issues or discussions

## ✨ Feature Requests

When requesting features:

1. **Describe the Problem**
   - What problem does this solve?
   - Who would benefit from this feature?

2. **Propose a Solution**
   - How should this feature work?
   - What would the API look like?

3. **Consider Alternatives**
   - Are there existing workarounds?
   - Have you considered other approaches?

## 🏷️ Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Changelog

- Document all changes in CHANGELOG.md
- Use conventional commit messages
- Include migration guides for breaking changes

### Release Steps

1. Update version numbers
2. Update CHANGELOG.md
3. Create release PR
4. Merge to main
5. Create and push tag
6. GitHub Actions handles the rest

## 🤝 Community Guidelines

### Be Respectful

- Be kind and respectful to all contributors
- Welcome newcomers and help them learn
- Provide constructive feedback

### Be Collaborative

- Discuss significant changes before implementing
- Consider different perspectives and use cases
- Help others with their contributions

### Be Professional

- Use clear, professional language
- Follow the project's code of conduct
- Focus on the code, not the person

## 📞 Getting Help

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and general discussion
- **Pull Requests**: Code contributions
- **Documentation**: Check existing docs first

## 🎯 Areas for Contribution

### High Priority

- Performance optimizations
- Additional integrations (Zustand, MobX, etc.)
- Enhanced Flipper plugin features
- Better error handling and recovery

### Medium Priority

- Additional platform support
- More comprehensive testing
- Documentation improvements
- Example apps and tutorials

### Low Priority

- UI/UX improvements for the Flipper plugin
- Additional export formats
- Advanced filtering and search

## 📋 Checklist for Contributors

Before submitting a PR, ensure:

- [ ] Code follows the project's style guidelines
- [ ] All tests pass
- [ ] New functionality has tests
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] No linting errors
- [ ] Code is properly formatted
- [ ] PR description is clear and complete
- [ ] Breaking changes are documented

## 🏆 Recognition

Contributors will be recognized in:

- CHANGELOG.md
- README.md contributors section
- GitHub contributors page
- Release notes

Thank you for contributing to React Native Flipper Inspector! 🎉
