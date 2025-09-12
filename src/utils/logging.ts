/**
 * Centralized logging utility for the ClayGrounds app
 * Provides structured logging for different types of events
 */

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn', 
  INFO = 'info',
  DEBUG = 'debug',
  USER_ACTION = 'user_action'
}

export enum LogCategory {
  API = 'api',
  CACHE = 'cache',
  USER_INTERACTION = 'user_interaction',
  NAVIGATION = 'navigation',
  BOOKING = 'booking',
  SYSTEM = 'system'
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: any;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private isDevelopment = __DEV__;
  private sessionId = `session_${Date.now()}`;
  private userId?: string;

  /**
   * Set user ID for tracking user-specific actions
   */
  setUserId(userId: string) {
    this.userId = userId;
  }

  /**
   * Log user actions (venue selection, facility selection, etc.)
   */
  logUserAction(action: string, data: any) {
    this.log(LogLevel.USER_ACTION, LogCategory.USER_INTERACTION, action, data);
  }

  /**
   * Log API-related events (requests, responses, errors)
   */
  logApi(level: LogLevel, message: string, data?: any) {
    this.log(level, LogCategory.API, message, data);
  }

  /**
   * Log cache-related events
   */
  logCache(level: LogLevel, message: string, data?: any) {
    this.log(level, LogCategory.CACHE, message, data);
  }

  /**
   * Log navigation events
   */
  logNavigation(level: LogLevel, message: string, data?: any) {
    this.log(level, LogCategory.NAVIGATION, message, data);
  }

  /**
   * Log booking-related events
   */
  logBooking(level: LogLevel, message: string, data?: any) {
    this.log(level, LogCategory.BOOKING, message, data);
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, category: LogCategory, message: string, data?: any) {
    if (!this.isDevelopment) return;

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      sessionId: this.sessionId,
      userId: this.userId
    };

    // Use appropriate console method based on level
    switch (level) {
      case LogLevel.ERROR:
        console.error(`[${category.toUpperCase()}] ${message}`, data);
        break;
      case LogLevel.WARN:
        console.warn(`[${category.toUpperCase()}] ${message}`, data);
        break;
      case LogLevel.USER_ACTION:
        console.log(`🎯 [USER_ACTION] ${message}`, data);
        break;
      case LogLevel.INFO:
        console.log(`ℹ️ [${category.toUpperCase()}] ${message}`, data);
        break;
      case LogLevel.DEBUG:
        console.log(`🐛 [${category.toUpperCase()}] ${message}`, data);
        break;
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Convenience functions for common logging scenarios
export const logUserAction = (action: string, data: any) => logger.logUserAction(action, data);
export const logApi = (level: LogLevel, message: string, data?: any) => logger.logApi(level, message, data);
export const logCache = (level: LogLevel, message: string, data?: any) => logger.logCache(level, message, data);
export const logNavigation = (level: LogLevel, message: string, data?: any) => logger.logNavigation(level, message, data);
export const logBooking = (level: LogLevel, message: string, data?: any) => logger.logBooking(level, message, data);
