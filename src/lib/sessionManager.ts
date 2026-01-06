/**
 * Session Management Utilities
 * Handles session timeouts, activity tracking, and token rotation
 */

import { supabase } from './supabase'

const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes
const ACTIVITY_CHECK_INTERVAL_MS = 60 * 1000 // Check every minute

class SessionManager {
  private lastActivityTime: number = Date.now()
  private activityCheckInterval: NodeJS.Timeout | null = null
  private activityListeners: (() => void)[] = []

  constructor() {
    this.setupActivityTracking()
  }

  /**
   * Track user activity (mouse moves, clicks, key presses)
   */
  private setupActivityTracking(): void {
    const updateActivity = () => {
      this.lastActivityTime = Date.now()
      this.notifyActivity()
    }

    // Track various user activities
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      window.addEventListener(event, updateActivity, { passive: true })
    })
  }

  /**
   * Start monitoring session timeout
   */
  startMonitoring(onTimeout: () => void): void {
    // Clear any existing interval
    if (this.activityCheckInterval) {
      clearInterval(this.activityCheckInterval)
    }

    this.lastActivityTime = Date.now()

    // Check session timeout periodically
    this.activityCheckInterval = setInterval(() => {
      const inactiveTime = Date.now() - this.lastActivityTime

      if (inactiveTime >= SESSION_TIMEOUT_MS) {
        this.handleTimeout(onTimeout)
      }
    }, ACTIVITY_CHECK_INTERVAL_MS)
  }

  /**
   * Stop monitoring session
   */
  stopMonitoring(): void {
    if (this.activityCheckInterval) {
      clearInterval(this.activityCheckInterval)
      this.activityCheckInterval = null
    }
  }

  /**
   * Handle session timeout
   */
  private async handleTimeout(callback: () => void): Promise<void> {
    this.stopMonitoring()
    
    // Sign out the user
    await supabase.auth.signOut()
    
    // Notify callback
    callback()
  }

  /**
   * Get time until session timeout (in seconds)
   */
  getTimeUntilTimeout(): number {
    const elapsed = Date.now() - this.lastActivityTime
    const remaining = SESSION_TIMEOUT_MS - elapsed
    return Math.max(0, Math.floor(remaining / 1000))
  }

  /**
   * Check if session is about to expire (within 5 minutes)
   */
  isSessionExpiringSoon(): boolean {
    return this.getTimeUntilTimeout() <= 5 * 60
  }

  /**
   * Manually refresh session
   */
  async refreshSession(): Promise<void> {
    this.lastActivityTime = Date.now()
    
    // Refresh Supabase session
    const { error } = await supabase.auth.refreshSession()
    
    if (error) {
      console.error('Failed to refresh session:', error)
      throw error
    }
  }

  /**
   * Register activity listener
   */
  onActivity(callback: () => void): () => void {
    this.activityListeners.push(callback)
    
    // Return unsubscribe function
    return () => {
      const index = this.activityListeners.indexOf(callback)
      if (index > -1) {
        this.activityListeners.splice(index, 1)
      }
    }
  }

  /**
   * Notify all activity listeners
   */
  private notifyActivity(): void {
    this.activityListeners.forEach(listener => listener())
  }

  /**
   * Get session info
   */
  getSessionInfo(): {
    lastActivity: Date
    timeUntilTimeout: number
    isExpiringSoon: boolean
  } {
    return {
      lastActivity: new Date(this.lastActivityTime),
      timeUntilTimeout: this.getTimeUntilTimeout(),
      isExpiringSoon: this.isSessionExpiringSoon(),
    }
  }
}

// Singleton instance
export const sessionManager = new SessionManager()

/**
 * Hook for session timeout monitoring
 */
export function useSessionTimeout(onTimeout: () => void) {
  const startMonitoring = () => {
    sessionManager.startMonitoring(onTimeout)
  }

  const stopMonitoring = () => {
    sessionManager.stopMonitoring()
  }

  return {
    startMonitoring,
    stopMonitoring,
    refreshSession: () => sessionManager.refreshSession(),
    getSessionInfo: () => sessionManager.getSessionInfo(),
  }
}
