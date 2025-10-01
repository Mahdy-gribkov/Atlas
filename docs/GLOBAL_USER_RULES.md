# Global User Rules for Travel AI Agent Project

## 🎯 Project Philosophy
- **Learning-First Approach**: Every step should be educational and well-explained
- **Security Priority**: All API keys and sensitive data must be properly secured
- **Performance Focus**: Optimize for response times and user experience
- **Documentation-Driven**: Comprehensive documentation for every component

## 🐍 Python Development Standards

### Code Style
- Follow PEP 8 guidelines
- Use type hints for all function parameters and return values
- Write docstrings for all classes and functions
- Use meaningful variable and function names
- Keep functions small and focused (single responsibility)

### Error Handling
- Always use try-catch blocks for API calls
- Provide meaningful error messages
- Log errors appropriately
- Graceful degradation when services are unavailable

### Testing
- Write unit tests for all core functions
- Test API integrations with mock data
- Include integration tests for end-to-end flows
- Aim for 80%+ code coverage

## 🤖 LangChain Best Practices

### Agent Design
- Use ReAct pattern for complex reasoning
- Implement proper tool selection logic
- Handle tool execution errors gracefully
- Provide clear feedback on tool usage

### Memory Management
- Use appropriate memory types for different use cases
- Implement memory persistence for user sessions
- Clear sensitive information from memory
- Optimize memory usage for long conversations

### Prompt Engineering
- Create clear, specific prompts
- Use few-shot examples for complex tasks
- Implement prompt versioning for A/B testing
- Validate prompt effectiveness with testing

## 🔐 Security Guidelines

### API Key Management
- Never commit API keys to version control
- Use environment variables for all secrets
- Implement key rotation procedures
- Monitor API usage and costs

### Data Privacy
- Minimize data collection
- Implement data retention policies
- Provide user data deletion capabilities
- Follow GDPR/privacy best practices

### Input Validation
- Validate all user inputs
- Sanitize data before processing
- Implement rate limiting
- Protect against injection attacks

## 📚 Documentation Standards

### Code Documentation
- Every module needs a docstring explaining its purpose
- Every function needs a docstring with parameters and return values
- Include usage examples in docstrings
- Document any external dependencies

### User Documentation
- Create clear setup instructions
- Provide example usage scenarios
- Document all configuration options
- Include troubleshooting guides

### API Documentation
- Document all endpoints and parameters
- Provide example requests and responses
- Include error code explanations
- Keep documentation up-to-date with code changes

## 🚀 Development Workflow

### Version Control
- Use meaningful commit messages
- Create feature branches for new development
- Review all code before merging
- Tag releases appropriately

### Environment Management
- Use virtual environments for Python
- Pin dependency versions
- Document environment setup
- Test in multiple environments

### Deployment
- Use containerization (Docker) for consistency
- Implement health checks
- Monitor application performance
- Plan for rollback procedures

## 🎓 Learning Objectives

### Python Skills to Develop
- Object-oriented programming patterns
- Async/await for API calls
- Error handling and logging
- Testing frameworks (pytest)
- Package management and distribution

### LangChain Skills to Develop
- Agent architecture and design
- Tool creation and integration
- Memory management strategies
- Prompt engineering techniques
- Chain composition and optimization

### General Development Skills
- API integration and testing
- Database design and management
- User experience design
- Performance optimization
- Security best practices

## 🔄 Review and Update Process

### Weekly Reviews
- Assess progress against learning objectives
- Review code quality and documentation
- Plan next week's priorities
- Address any technical debt

### Monthly Assessments
- Evaluate overall project direction
- Update documentation and plans
- Incorporate new learning and best practices
- Plan for scaling and optimization

---

*These rules will be updated as we learn more about the project requirements and best practices.*
