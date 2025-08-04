# Contributing to Xylethol

Thank you for your interest in contributing to Xylethol! We welcome contributions from developers of all skill levels. This guide will help you get started with contributing to our open-source alert management and feature toggle platform.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful, inclusive, and constructive in all interactions.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- A code editor (we recommend VS Code)

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/xylethol.git
   cd xylethol
   ```

3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/originalowner/xylethol.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Set up the database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Start the development server**:
   ```bash
   npm run dev
   ```

7. **Verify your setup** by visiting `http://localhost:3000`

## 📋 Types of Contributions

We welcome various types of contributions:

### 🐛 Bug Reports
- Use the GitHub issue template
- Include steps to reproduce
- Provide browser/environment details
- Add screenshots if applicable

### ✨ Feature Requests
- Check existing issues first
- Describe the problem you're solving
- Provide use cases and examples
- Consider implementation complexity

### 🔧 Code Contributions
- Bug fixes
- New features
- Performance improvements
- Documentation updates
- Test coverage improvements

### 📚 Documentation
- README improvements
- Code comments
- API documentation
- Usage examples
- Tutorial content

## 🛠 Development Workflow

### Branch Naming Convention

Use descriptive branch names with prefixes:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test improvements
- `chore/` - Maintenance tasks

Examples:
- `feature/alert-templates`
- `fix/widget-memory-leak`
- `docs/api-endpoints`

### Making Changes

1. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes**:
   ```bash
   npm run lint
   npm run build
   npm run test # If tests exist
   ```

4. **Commit your changes** with a descriptive message:
   ```bash
   git add .
   git commit -m "feat: add alert template system

   - Add template creation interface
   - Implement template variables
   - Add template preview functionality
   
   Closes #123"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

### Commit Message Format

We use conventional commits for consistent commit messages:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**
```
feat(widget): add auto-refresh configuration option

fix(alerts): resolve memory leak in alert cleanup

docs(readme): update installation instructions

refactor(api): simplify alert validation logic
```

## 🎯 Coding Standards

### JavaScript/TypeScript Guidelines

- Use **TypeScript** for all new code
- Follow **ESLint** configuration
- Use **Prettier** for code formatting
- Write **JSDoc comments** for public APIs
- Prefer **async/await** over Promises
- Use **meaningful variable names**

### React Component Guidelines

- Use **functional components** with hooks
- Implement **proper error boundaries**
- Add **PropTypes** or TypeScript interfaces
- Follow **component composition** patterns
- Keep components **small and focused**

### Database Guidelines

- Use **Prisma migrations** for schema changes
- Write **descriptive migration names**
- Consider **backward compatibility**
- Add **proper indexes** for performance
- Follow **normalization principles**

### Widget Development

- Maintain **framework agnostic** approach
- Keep **bundle size minimal**
- Ensure **cross-browser compatibility**
- Add **comprehensive error handling**
- Write **clear API documentation**

## 🧪 Testing Guidelines

### Test Structure
```
├── __tests__/
│   ├── components/          # Component tests
│   ├── api/                # API endpoint tests
│   ├── widget/             # Widget functionality tests
│   └── utils/              # Utility function tests
```

### Writing Tests

- Write **unit tests** for utilities and functions
- Write **integration tests** for API endpoints
- Write **component tests** for React components
- Write **E2E tests** for critical user flows
- Aim for **80%+ code coverage**

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📝 Pull Request Process

### Before Submitting

- [ ] Code follows our style guidelines
- [ ] Self-review of the code completed
- [ ] Comments added for complex logic
- [ ] Tests added for new functionality
- [ ] Documentation updated if needed
- [ ] No breaking changes (or properly documented)

### Pull Request Template

When creating a PR, please include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows the style guidelines
- [ ] Self-review completed
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings introduced
```

### Review Process

1. **Automated checks** must pass (linting, tests, build)
2. **At least one maintainer** must approve
3. **Address feedback** promptly and respectfully
4. **Squash commits** if requested
5. **Maintainer will merge** when ready

## 🏗 Project Architecture

### Frontend (Next.js)
- **Pages**: Route components and API endpoints
- **Components**: Reusable UI components
- **Hooks**: Custom React hooks
- **Utils**: Helper functions and utilities
- **Styles**: CSS and styling files

### Backend (API Routes)
- **REST endpoints** for CRUD operations
- **Validation** using Zod or similar
- **Error handling** with proper HTTP codes
- **Authentication** (when implemented)

### Database (Prisma + SQLite/PostgreSQL)
- **Schema definition** in `prisma/schema.prisma`
- **Migrations** for schema changes
- **Seeding** for development data

### Widget (Vanilla JavaScript)
- **Framework agnostic** implementation
- **Minimal dependencies**
- **ES5 compatibility** for broad browser support
- **Modular architecture**

## 🎨 Design Guidelines

### UI/UX Principles
- **Accessibility first** - WCAG 2.1 AA compliance
- **Mobile responsive** - Mobile-first design
- **Performance focused** - Fast loading times
- **User-friendly** - Intuitive interfaces

### Color Palette
- Primary: `#007bff` (Blue)
- Success: `#28a745` (Green)
- Warning: `#ffc107` (Yellow)
- Error: `#dc3545` (Red)
- Gray: `#6c757d` (Neutral)

### Typography
- Headers: System fonts stack
- Body: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- Code: `'SF Mono', Monaco, 'Cascadia Code', monospace`

## 📖 Documentation Standards

### Code Documentation
- Use **JSDoc** for functions and classes
- Add **inline comments** for complex logic
- Include **usage examples** in documentation
- Keep **README files** up to date

### API Documentation
- Document **all endpoints**
- Include **request/response examples**
- Specify **error codes** and messages
- Provide **authentication** requirements

### User Documentation
- Write **clear tutorials**
- Include **code examples**
- Add **troubleshooting guides**
- Create **migration guides** for breaking changes

## 🚀 Release Process

### Versioning
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist
- [ ] Update version in `package.json`
- [ ] Update `CHANGELOG.md`
- [ ] Create release notes
- [ ] Tag the release
- [ ] Deploy to production
- [ ] Announce the release

## 🆘 Getting Help

### Communication Channels
- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Discord** - Real-time chat (if available)
- **Email** - security@xylethol.com for security issues

### Common Issues
- **Build failures** - Check Node.js version and clean install
- **Database issues** - Ensure Prisma is properly configured
- **Widget integration** - Check browser console for errors
- **Performance issues** - Profile with browser dev tools

## 📚 Resources

### Learning Materials
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### Tools
- [VS Code](https://code.visualstudio.com/) - Recommended editor
- [GitHub CLI](https://cli.github.com/) - Command-line GitHub tool
- [Prisma Studio](https://www.prisma.io/studio) - Database GUI
- [React DevTools](https://reactjs.org/blog/2019/08/15/new-react-devtools.html) - Browser extension

## 🏆 Recognition

We appreciate all contributions and recognize contributors in:
- **README.md** contributor section
- **Release notes** for significant contributions
- **GitHub contributor graph**
- **Special mentions** in project updates

## 📄 License

By contributing to Xylethol, you agree that your contributions will be licensed under the same [MIT License](LICENSE) that covers the project.

---

Thank you for contributing to Xylethol! Together, we're building something amazing. 🚀

If you have questions about contributing, please don't hesitate to ask in our GitHub Discussions or create an issue.