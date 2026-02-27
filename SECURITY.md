# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** open a public issue
2. Email: **leolunardelli@gmail.com**
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact

We will respond within **48 hours** and work on a fix promptly.

## Security Measures

- OAuth 2.0 authentication via Google and GitHub
- Optional email/password authentication with bcrypt-hashed passwords
- Database sessions with NextAuth.js
- Server-side input validation and normalization
- Credentials throttling on sign-in, sign-up, and password reset flows
- Environment variables for all secrets
- HTTPS enforced in production (Vercel)
