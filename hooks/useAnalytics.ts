import { useEffect, useCallback } from 'react'
import analyticsService from '../services/analytics'

interface UseAnalyticsOptions {
  userId?: string
  userAttributes?: Record<string, any>
  enabled?: boolean
}

export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const { userId, userAttributes, enabled = true } = options

  useEffect(() => {
    if (userId) {
      analyticsService.setUserId(userId)
    }
    analyticsService.setEnabled(enabled)
  }, [userId, enabled])

  // Alert tracking functions
  const trackAlertShow = useCallback((alertId: string, alertTitle: string, alertTheme: string = 'default') => {
    if (!enabled) return
    analyticsService.trackAlertShow(alertId, alertTitle, alertTheme, userAttributes)
  }, [enabled, userAttributes])

  const trackAlertHide = useCallback((alertId: string) => {
    if (!enabled) return
    analyticsService.trackAlertHide(alertId, userAttributes)
  }, [enabled, userAttributes])

  const trackAlertError = useCallback((error: string) => {
    if (!enabled) return
    analyticsService.trackAlertError(error, userAttributes)
  }, [enabled, userAttributes])

  // Feature toggle tracking functions
  const trackFeatureCheck = useCallback((featureName: string, featureEnabled: boolean) => {
    if (!enabled) return
    analyticsService.trackFeatureCheck(featureName, featureEnabled, userAttributes)
  }, [enabled, userAttributes])

  const trackFeatureChange = useCallback((features: Record<string, boolean>) => {
    if (!enabled) return
    analyticsService.trackFeatureChange(features, userAttributes)
  }, [enabled, userAttributes])

  const trackFeatureError = useCallback((error: string) => {
    if (!enabled) return
    analyticsService.trackFeatureError(error, userAttributes)
  }, [enabled, userAttributes])

  return {
    // Alert tracking
    trackAlertShow,
    trackAlertHide,
    trackAlertError,
    
    // Feature tracking
    trackFeatureCheck,
    trackFeatureChange,
    trackFeatureError,
    
    // Service access
    analyticsService
  }
}

// Type declarations for global widgets
declare global {
  interface Window {
    AlertWidget?: any;
    FeatureToggle?: any;
  }
}

// Enhanced alert widget integration
export function enhanceAlertWidget() {
  if (typeof window !== 'undefined' && window.AlertWidget) {
    const originalInit = window.AlertWidget.init

    window.AlertWidget.init = function(config: any) {
      const enhancedConfig = {
        ...config,
        onAlertShow: (alert: any, element: any) => {
          // Track the alert show event
          analyticsService.trackAlertShow(
            alert.id,
            alert.title,
            alert.theme || 'default',
            config.userAttributes
          )
          
          // Call original callback if provided
          if (config.onAlertShow) {
            config.onAlertShow(alert, element)
          }
        },
        onAlertHide: (alertId: string) => {
          // Track the alert hide event
          analyticsService.trackAlertHide(alertId, config.userAttributes)
          
          // Call original callback if provided
          if (config.onAlertHide) {
            config.onAlertHide(alertId)
          }
        },
        onError: (error: any) => {
          // Track the error
          const errorMessage = error instanceof Error ? error.message : String(error)
          analyticsService.trackAlertError(errorMessage, config.userAttributes)
          
          // Call original callback if provided
          if (config.onError) {
            config.onError(error)
          }
        }
      }

      return originalInit.call(this, enhancedConfig)
    }
  }
}

// Enhanced feature toggle integration
export function enhanceFeatureToggle() {
  if (typeof window !== 'undefined' && window.FeatureToggle) {
    const originalCheck = window.FeatureToggle.check
    const originalCheckFeatures = window.FeatureToggle.checkFeatures

    window.FeatureToggle.check = async function(featureName: string) {
      try {
        const result = await originalCheck.call(this, featureName)
        
        // Track the feature check
        const userAttributes = this.instance?.getUserAttributes?.() || {}
        analyticsService.trackFeatureCheck(featureName, result, userAttributes)
        
        return result
      } catch (error) {
        // Track the error
        const userAttributes = this.instance?.getUserAttributes?.() || {}
        const errorMessage = error instanceof Error ? error.message : String(error)
        analyticsService.trackFeatureError(errorMessage, userAttributes)
        throw error
      }
    }

    window.FeatureToggle.checkFeatures = async function(features: string[]) {
      try {
        const results = await originalCheckFeatures.call(this, features)
        
        // Track the feature changes
        const userAttributes = this.instance?.getUserAttributes?.() || {}
        analyticsService.trackFeatureChange(results, userAttributes)
        
        return results
      } catch (error) {
        // Track the error
        const userAttributes = this.instance?.getUserAttributes?.() || {}
        const errorMessage = error instanceof Error ? error.message : String(error)
        analyticsService.trackFeatureError(errorMessage, userAttributes)
        throw error
      }
    }
  }
}

// Auto-initialize enhancements when widgets are available
export function initializeAnalyticsEnhancements() {
  if (typeof window !== 'undefined') {
    // Wait for widgets to be available
    const checkAndEnhance = () => {
      enhanceAlertWidget()
      enhanceFeatureToggle()
    }

    // Try immediately
    checkAndEnhance()

    // Also try after DOM is loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkAndEnhance)
    }

    // And try periodically in case widgets are loaded asynchronously
    const interval = setInterval(() => {
      if (window.AlertWidget && window.FeatureToggle) {
        checkAndEnhance()
        clearInterval(interval)
      }
    }, 1000)

    // Clean up after 10 seconds
    setTimeout(() => clearInterval(interval), 10000)
  }
}