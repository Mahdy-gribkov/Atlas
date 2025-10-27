import { z } from 'zod';

/**
 * AI Security Manager - Protects against prompt injection and AI-specific attacks
 * Based on OWASP AI Security Guidelines
 */
export class AISecurityManager {
  private static readonly DANGEROUS_PATTERNS = [
    // Prompt injection patterns
    /ignore previous instructions/i,
    /ignore all previous instructions/i,
    /forget everything/i,
    /system prompt/i,
    /admin access/i,
    /root access/i,
    /sudo/i,
    /elevate privileges/i,
    
    // Code injection patterns
    /<script/i,
    /javascript:/i,
    /onload=/i,
    /onerror=/i,
    /eval\(/i,
    /function\(/i,
    
    // SQL injection patterns
    /union select/i,
    /drop table/i,
    /delete from/i,
    /insert into/i,
    /update set/i,
    
    // Command injection patterns
    /; rm -rf/i,
    /&& rm -rf/i,
    /| rm -rf/i,
    /cat \/etc\/passwd/i,
    /whoami/i,
    /id/i,
    
    // Data exfiltration patterns
    /show me all users/i,
    /list all data/i,
    /dump database/i,
    /export data/i,
    
    // Social engineering patterns
    /pretend to be/i,
    /act as if/i,
    /roleplay as/i,
    /you are now/i,
  ];

  private static readonly MAX_PROMPT_LENGTH = 4000;
  private static readonly MAX_RESPONSE_LENGTH = 8000;
  private static readonly SUSPICIOUS_KEYWORDS = [
    'password', 'secret', 'key', 'token', 'credential',
    'admin', 'root', 'sudo', 'privilege', 'access',
    'database', 'sql', 'query', 'table', 'user',
    'system', 'config', 'environment', 'variable'
  ];

  /**
   * Sanitize user input before sending to AI
   */
  static sanitizePrompt(userInput: string): {
    sanitized: string;
    warnings: string[];
    blocked: boolean;
  } {
    const warnings: string[] = [];
    let sanitized = userInput;
    let blocked = false;

    // Check for dangerous patterns
    for (const pattern of this.DANGEROUS_PATTERNS) {
      if (pattern.test(sanitized)) {
        warnings.push(`Blocked potentially dangerous pattern: ${pattern.source}`);
        sanitized = sanitized.replace(pattern, '[REDACTED]');
        blocked = true;
      }
    }

    // Check for suspicious keywords in context
    const suspiciousCount = this.SUSPICIOUS_KEYWORDS.filter(keyword => 
      sanitized.toLowerCase().includes(keyword)
    ).length;

    if (suspiciousCount > 3) {
      warnings.push('High number of suspicious keywords detected');
    }

    // Limit length to prevent DoS
    if (sanitized.length > this.MAX_PROMPT_LENGTH) {
      warnings.push('Input truncated due to length limit');
      sanitized = sanitized.substring(0, this.MAX_PROMPT_LENGTH);
    }

    // Remove excessive whitespace and normalize
    sanitized = sanitized.replace(/\s+/g, ' ').trim();

    return {
      sanitized,
      warnings,
      blocked
    };
  }

  /**
   * Validate AI response for security issues
   */
  static validateAIResponse(response: string): {
    valid: boolean;
    warnings: string[];
    sanitized: string;
  } {
    const warnings: string[] = [];
    let sanitized = response;
    let valid = true;

    // Check for dangerous patterns in response
    for (const pattern of this.DANGEROUS_PATTERNS) {
      if (pattern.test(sanitized)) {
        warnings.push(`AI response contains dangerous pattern: ${pattern.source}`);
        sanitized = sanitized.replace(pattern, '[FILTERED]');
        valid = false;
      }
    }

    // Check for potential XSS
    if (/<script|javascript:|on\w+=/i.test(sanitized)) {
      warnings.push('AI response contains potential XSS');
      sanitized = sanitized.replace(/<script[\s\S]*?<\/script>/gi, '[SCRIPT_REMOVED]');
      valid = false;
    }

    // Check for SQL injection attempts
    if (/union|select|drop|delete|insert|update/i.test(sanitized)) {
      warnings.push('AI response contains potential SQL injection');
      valid = false;
    }

    // Limit response length
    if (sanitized.length > this.MAX_RESPONSE_LENGTH) {
      warnings.push('AI response truncated due to length limit');
      sanitized = sanitized.substring(0, this.MAX_RESPONSE_LENGTH);
    }

    return {
      valid,
      warnings,
      sanitized
    };
  }

  /**
   * Rate limiting for AI requests per user
   */
  static async checkRateLimit(userId: string, requestCount: number = 1): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }> {
    // This would integrate with your rate limiting system
    // For now, return a basic implementation
    const maxRequests = 100; // per hour
    const windowMs = 60 * 60 * 1000; // 1 hour
    
    // In a real implementation, you'd check Redis or database
    return {
      allowed: requestCount <= maxRequests,
      remaining: Math.max(0, maxRequests - requestCount),
      resetTime: Date.now() + windowMs
    };
  }

  /**
   * Validate AI-generated itinerary for security
   */
  static validateItinerary(itinerary: any): {
    valid: boolean;
    warnings: string[];
    sanitized: any;
  } {
    const warnings: string[] = [];
    let sanitized = { ...itinerary };
    let valid = true;

    // Validate itinerary structure
    const itinerarySchema = z.object({
      title: z.string().max(200),
      destination: z.string().max(100),
      days: z.array(z.object({
        activities: z.array(z.object({
          name: z.string().max(200),
          description: z.string().max(1000),
          location: z.object({
            name: z.string().max(200),
            address: z.string().max(500),
            coordinates: z.object({
              lat: z.number().min(-90).max(90),
              lng: z.number().min(-180).max(180),
            }),
          }),
        })),
      })),
    });

    try {
      sanitized = itinerarySchema.parse(itinerary);
    } catch (error) {
      warnings.push('Invalid itinerary structure');
      valid = false;
    }

    // Check for suspicious content in descriptions
    if (itinerary.description) {
      const descriptionCheck = this.sanitizePrompt(itinerary.description);
      if (descriptionCheck.blocked) {
        warnings.push('Itinerary description contains suspicious content');
        valid = false;
      }
    }

    return {
      valid,
      warnings,
      sanitized
    };
  }

  /**
   * Log security events for monitoring
   */
  static async logSecurityEvent(event: {
    type: 'prompt_injection' | 'response_validation' | 'rate_limit_exceeded' | 'suspicious_content';
    userId?: string;
    details: any;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }): Promise<void> {
    // This would integrate with your logging system
    console.log('AI Security Event:', {
      timestamp: new Date().toISOString(),
      ...event
    });
  }

  /**
   * Get security recommendations for AI usage
   */
  static getSecurityRecommendations(): string[] {
    return [
      'Always validate and sanitize user inputs before sending to AI',
      'Implement rate limiting to prevent AI DoS attacks',
      'Monitor AI responses for suspicious content',
      'Use content filtering for AI-generated itineraries',
      'Log all AI security events for analysis',
      'Regularly update dangerous pattern detection',
      'Implement user behavior analysis for anomaly detection',
      'Use AI model versioning and rollback capabilities',
      'Implement content moderation for user-generated content',
      'Regularly audit AI training data for bias and security issues'
    ];
  }
}

// Export security schemas
export const aiSecuritySchemas = {
  promptInput: z.object({
    message: z.string().min(1).max(4000),
    context: z.object({
      userId: z.string(),
      sessionId: z.string(),
      timestamp: z.date(),
    }),
  }),
  
  aiResponse: z.object({
    content: z.string().min(1).max(8000),
    metadata: z.object({
      model: z.string(),
      tokens: z.number(),
      timestamp: z.date(),
    }),
  }),
  
  securityEvent: z.object({
    type: z.enum(['prompt_injection', 'response_validation', 'rate_limit_exceeded', 'suspicious_content']),
    userId: z.string().optional(),
    details: z.any(),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
    timestamp: z.date(),
  }),
};
