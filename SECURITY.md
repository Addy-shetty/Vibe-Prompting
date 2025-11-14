# Security Policy

## 🔒 Security Overview

Vibe Prompting takes security seriously. This document outlines our security measures and how to report vulnerabilities.

## 🛡️ Security Features

### Database Security
- **Row Level Security (RLS)** enabled on all tables
- **IDOR Protection**: Users can only access their own data
- **Secure Functions**: PostgreSQL functions use `SECURITY DEFINER`
- **Input Validation**: XSS and SQL injection prevention

### Authentication
- Supabase Auth with email verification
- Secure session management
- Password hashing with bcrypt
- JWT token validation

### API Security
- Environment variables for sensitive keys
- Rate limiting on API endpoints
- CORS configuration
- Secure headers

## 📋 Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

### Where to Report
**Email**: Harshithms@gmail.com

### What to Include
1. **Description**: Clear description of the vulnerability
2. **Steps to Reproduce**: Detailed steps to replicate the issue
3. **Impact**: Potential impact and severity
4. **Proof of Concept**: Code or screenshots (if applicable)
5. **Suggested Fix**: Your recommendations (optional)

### Response Timeline
- **Initial Response**: Within 48 hours
- **Status Update**: Every 5 business days
- **Resolution Target**: 30 days for critical issues

### What to Expect
- **Accepted**: We'll work on a fix and credit you in release notes
- **Declined**: We'll explain why it's not considered a vulnerability
- **Duplicate**: We'll reference the original report

## 🔐 Security Best Practices

### For Users
- Use strong, unique passwords
- Enable two-factor authentication (when available)
- Keep your browser updated
- Don't share API keys

### For Contributors
- Never commit sensitive data (.env files)
- Use environment variables for secrets
- Follow secure coding practices
- Run security linters before PR

## 📚 Security Documentation

For detailed security implementation:
- [Security Implementation Guide](docs/SECURITY_IMPLEMENTATION_FULL.md)
- [Database Setup](docs/SUPABASE_SETUP.md)

## 🏆 Recognition

We appreciate responsible disclosure. Security researchers will be:
- Credited in release notes
- Listed in our security acknowledgments
- Given appropriate recognition

## 📞 Contact

For security concerns: Harshithms@gmail.com

---

**Thank you for helping keep Vibe Prompting secure!** 🔒
