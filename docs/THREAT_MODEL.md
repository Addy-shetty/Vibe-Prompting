# Threat Model - Vibe Prompting

## Overview
Comprehensive threat analysis using STRIDE methodology for the Vibe Prompting application.

## System Architecture

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   Browser   │──────▶│    Vercel    │──────▶│  Supabase   │
│  (Client)   │       │  (Frontend)  │       │  (Backend)  │
└─────────────┘       └──────────────┘       └─────────────┘
                              │                      │
                              ▼                      ▼
                      ┌──────────────┐       ┌─────────────┐
                      │Edge Functions│       │ PostgreSQL  │
                      │   (Deno)     │       │  Database   │
                      └──────────────┘       └─────────────┘
                              │
                              ▼
                      ┌──────────────┐
                      │  Gemini API  │
                      │ OpenRouter   │
                      └──────────────┘
```

## STRIDE Threat Analysis

### 1. Spoofing Identity

#### Threats:
- **T1.1**: Attacker impersonates legitimate user
- **T1.2**: Session hijacking through XSS
- **T1.3**: Stolen authentication tokens
- **T1.4**: Social engineering to obtain credentials

#### Mitigations:
- ✅ Supabase JWT authentication
- ✅ Email verification required
- ✅ Password strength enforcement
- ✅ Honeypot for bot detection
- ⚠️ TODO: 2FA/MFA implementation
- ⚠️ TODO: Session timeout (30 min inactivity)
- ⚠️ TODO: Device fingerprinting

### 2. Tampering with Data

#### Threats:
- **T2.1**: SQL injection in database queries
- **T2.2**: Manipulation of API requests
- **T2.3**: Client-side data tampering
- **T2.4**: Man-in-the-middle attacks

#### Mitigations:
- ✅ Supabase RLS (Row Level Security)
- ✅ Parameterized queries (Supabase handles)
- ✅ Input validation in Edge Functions
- ✅ HTTPS enforced (Vercel/Supabase)
- ✅ CORS headers configured
- ✅ CSP headers prevent injection
- ⚠️ TODO: Request signing/HMAC
- ⚠️ TODO: Integrity checks on critical data

### 3. Repudiation

#### Threats:
- **T3.1**: User denies creating malicious content
- **T3.2**: No audit trail for actions
- **T3.3**: Disputed transactions/credit usage

#### Mitigations:
- ✅ Database timestamps (created_at, updated_at)
- ✅ User ID association on all records
- ✅ Security logging in Edge Functions
- ⚠️ TODO: Comprehensive audit log table
- ⚠️ TODO: IP logging for critical actions
- ⚠️ TODO: Action history in user dashboard

### 4. Information Disclosure

#### Threats:
- **T4.1**: Exposed API keys in frontend
- **T4.2**: Sensitive data in error messages
- **T4.3**: IDOR - accessing other users' data
- **T4.4**: Leaking user information
- **T4.5**: Verbose error messages

#### Mitigations:
- ✅ API keys moved to Edge Functions
- ✅ RLS prevents IDOR
- ✅ Sanitized error messages to client
- ✅ No sensitive data in logs
- ✅ Environment variables for secrets
- ⚠️ TODO: Generic error messages
- ⚠️ TODO: Data classification policy
- ⚠️ TODO: PII encryption at rest

### 5. Denial of Service (DoS)

#### Threats:
- **T5.1**: API flooding
- **T5.2**: Credit exhaustion attacks
- **T5.3**: Large payload attacks
- **T5.4**: Slowloris attacks
- **T5.5**: Resource exhaustion

#### Mitigations:
- ✅ Rate limiting (10 req/min)
- ✅ Input size validation (max 5000 chars)
- ✅ Credit system limits abuse
- ✅ Vercel/Supabase DDoS protection
- ⚠️ TODO: Progressive rate limiting
- ⚠️ TODO: IP-based blocking
- ⚠️ TODO: CAPTCHA on repeated failures
- ⚠️ TODO: Request size limits

### 6. Elevation of Privilege

#### Threats:
- **T6.1**: Unauthorized access to admin functions
- **T6.2**: Bypassing credit limits
- **T6.3**: Privilege escalation in RLS
- **T6.4**: API abuse to gain unlimited access

#### Mitigations:
- ✅ RLS enforces user-level access
- ✅ Database functions use SECURITY DEFINER
- ✅ No admin panel (no privilege levels)
- ✅ Credit deduction atomic operation
- ⚠️ TODO: Role-based access control (RBAC)
- ⚠️ TODO: Admin audit logging
- ⚠️ TODO: Separate admin authentication

## Attack Surface Analysis

### 1. Frontend (Browser)
**Attack Vectors:**
- XSS injection
- CSRF attacks
- Clickjacking
- Local storage tampering

**Risk Level:** MEDIUM
**Mitigations:**
- ✅ CSP headers
- ✅ XSS sanitization
- ✅ Honeypot fields
- ⚠️ TODO: CSRF tokens

### 2. Edge Functions (Deno)
**Attack Vectors:**
- API abuse
- Input injection
- Unauthorized access
- Code injection

**Risk Level:** HIGH
**Mitigations:**
- ✅ Rate limiting
- ✅ Input validation
- ✅ Authentication checks
- ✅ Logging

### 3. Database (Supabase/PostgreSQL)
**Attack Vectors:**
- SQL injection
- Unauthorized data access
- Data tampering
- Backup theft

**Risk Level:** HIGH
**Mitigations:**
- ✅ RLS enabled
- ✅ Parameterized queries
- ✅ Encrypted connections
- ⚠️ TODO: Column-level encryption

### 4. Third-Party APIs
**Attack Vectors:**
- API key theft
- Quota exhaustion
- Supply chain attacks

**Risk Level:** MEDIUM
**Mitigations:**
- ✅ Keys in backend only
- ✅ Rate limiting
- ✅ Fallback providers
- ⚠️ TODO: API key rotation

## Data Flow Diagram (DFD)

```
┌────────┐         ┌─────────┐         ┌──────────┐
│  User  │────1───▶│ Browser │────2───▶│  Vercel  │
└────────┘         └─────────┘         └──────────┘
                                              │
                                              │ 3
                                              ▼
                                        ┌──────────┐
                                        │ Supabase │
                                        │   Auth   │
                                        └──────────┘
                                              │
                                              │ 4
                                              ▼
                                        ┌──────────┐
                                        │   Edge   │
                                        │ Function │
                                        └──────────┘
                                              │
                                    ┌─────────┴─────────┐
                                    │                   │
                                  5 ▼                   ▼ 6
                            ┌──────────┐         ┌──────────┐
                            │ Database │         │ AI APIs  │
                            └──────────┘         └──────────┘
```

**Trust Boundaries:**
1. User → Browser: Untrusted input
2. Browser → Vercel: TLS encryption
3. Vercel → Supabase: API authentication
4. Supabase → Edge Functions: Internal auth
5. Edge Functions → Database: RLS enforced
6. Edge Functions → AI APIs: API keys

## Security Controls Matrix

| Control Type | Preventive | Detective | Corrective |
|-------------|-----------|-----------|------------|
| **Authentication** | ✅ JWT, Password policy | ✅ Failed login logs | ⚠️ Account lockout |
| **Authorization** | ✅ RLS, Input validation | ✅ Access logs | ⚠️ Revoke tokens |
| **Data Protection** | ✅ HTTPS, Hashing | ⚠️ Anomaly detection | ⚠️ Backup restore |
| **Availability** | ✅ Rate limiting | ✅ Health monitoring | ⚠️ Failover |
| **Audit** | ✅ Logging | ✅ Security events | ⚠️ Incident response |

## Risk Assessment

### Critical Risks (Immediate Action Required)
1. **No CSRF Protection** - Add tokens to forms
2. **No Session Timeout** - Implement 30-min inactivity timeout
3. **Verbose Error Messages** - Generic messages in production
4. **No 2FA** - High-value accounts vulnerable

### High Risks (Plan for Next Sprint)
1. **Limited Audit Logging** - Expand logging
2. **No Request Signing** - Add HMAC
3. **Single Point of Failure** - Add redundancy
4. **Dependency Vulnerabilities** - Update packages

### Medium Risks (Monitor)
1. **Third-party API dependencies** - Have fallbacks
2. **Local storage for anonymous users** - Clear on logout
3. **No CAPTCHA** - Bots may abuse free tier

## Compliance Considerations

### GDPR
- ⚠️ User data export feature needed
- ⚠️ Right to be forgotten implementation
- ⚠️ Data retention policy
- ✅ Clear privacy policy needed

### OWASP Top 10 Coverage

| Risk | Status | Notes |
|------|--------|-------|
| A01: Broken Access Control | ✅ | RLS implemented |
| A02: Cryptographic Failures | ✅ | HTTPS, password hashing |
| A03: Injection | ✅ | Input validation, parameterized queries |
| A04: Insecure Design | ⚠️ | Threat model in progress |
| A05: Security Misconfiguration | ✅ | Security headers, CSP |
| A06: Vulnerable Components | ⚠️ | npm audit issues |
| A07: Auth Failures | ⚠️ | No 2FA, no lockout |
| A08: Data Integrity | ✅ | RLS, validation |
| A09: Logging Failures | ⚠️ | Limited audit logging |
| A10: SSRF | ✅ | No user-controlled URLs |

## Incident Response Plan

### 1. Detection
- Monitor security logs
- Alert on anomalies
- User reports

### 2. Containment
- Disable affected accounts
- Rotate compromised keys
- Block malicious IPs

### 3. Eradication
- Patch vulnerabilities
- Remove backdoors
- Update dependencies

### 4. Recovery
- Restore from backups
- Reset passwords
- Notify users

### 5. Lessons Learned
- Document incident
- Update threat model
- Improve controls

## Security Metrics

### KPIs to Monitor:
- Failed authentication attempts
- Rate limit violations
- SQL injection attempts
- XSS attempts blocked
- API error rates
- Average response time
- Credit deduction failures

### Thresholds:
- Failed logins: >5/min per IP → Block
- Rate limit: >10 req/min → Temporary ban
- Invalid input: >3 in 1 min → CAPTCHA
- API errors: >50% → Alert admin

## Recommendations Priority

### Immediate (Week 1):
1. ✅ Implement rate limiting
2. ✅ Add security headers
3. ✅ Input validation
4. ⚠️ Add CSRF tokens
5. ⚠️ Fix npm vulnerabilities

### Short-term (Month 1):
1. Implement 2FA
2. Add comprehensive audit logging
3. Session management improvements
4. CAPTCHA integration
5. Automated security scanning

### Long-term (Quarter 1):
1. Penetration testing
2. Bug bounty program
3. SOC 2 compliance
4. Advanced threat detection
5. Security training

---

**Last Updated:** November 18, 2025
**Next Review:** December 18, 2025
**Owner:** Security Team
**Approver:** CTO
