/**
 * Xylethol Widget Library
 * Combined alert display and feature toggle functionality
 * Easily inject alerts and check feature flags with user targeting
 */
(function(window, document) {
  'use strict';

  // Default configuration
  const DEFAULT_CONFIG = {
    // Alert Widget Configuration
    alerts: {
      apiUrl: 'http://localhost:3000/api/alerts/widget',
      containerId: 'xylethol-alert-container',
      position: 'top', // 'top', 'bottom', 'fixed-top', 'fixed-bottom'
      theme: 'default', // 'default', 'minimal', 'modern'
      showCloseButton: true,
      autoRefresh: false,
      refreshInterval: 30000, // 30 seconds
      maxAlerts: null, // null for unlimited
      fadeInDuration: 300,
      fadeOutDuration: 300,
      onAlertShow: null,
      onAlertHide: null,
      onError: null,
      onNoAlerts: null
    },
    
    // Feature Toggle Configuration
    features: {
      apiUrl: 'http://localhost:3000/api/features/check',
      cacheTimeout: 300000, // 5 minutes
      environment: 'production',
      userId: null,
      onError: null,
      onFeatureChange: null,
      debug: false
    },
    
    // Shared Configuration
    userAttributes: null, // { userType, location, accountAge, activityLevel, planTier, currentPage }
    detectCurrentPage: true // Automatically detect current page path
  };

  // CSS styles for different alert themes
  const ALERT_THEMES = {
    default: `
      .xylethol-alert-widget {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        margin: 10px 0;
        z-index: 10000;
      }
      .xylethol-alert-widget.fixed-top, .xylethol-alert-widget.fixed-bottom {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        max-width: 600px;
        margin: 0;
        padding: 10px;
      }
      .xylethol-alert-widget.fixed-top { top: 0; }
      .xylethol-alert-widget.fixed-bottom { bottom: 0; }
      .xylethol-alert-item {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-left: 4px solid #007bff;
        border-radius: 4px;
        padding: 15px;
        margin-bottom: 10px;
        position: relative;
        opacity: 0;
        transition: opacity var(--fade-duration, 300ms) ease-in-out;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .xylethol-alert-item.show { opacity: 1; }
      .xylethol-alert-item.success { border-left-color: #28a745; background: #d4edda; }
      .xylethol-alert-item.warning { border-left-color: #ffc107; background: #fff3cd; }
      .xylethol-alert-item.error { border-left-color: #dc3545; background: #f8d7da; }
      .xylethol-alert-title {
        font-weight: 600;
        font-size: 16px;
        margin: 0 0 8px 0;
        color: #212529;
      }
      .xylethol-alert-body {
        font-size: 14px;
        margin: 0;
        line-height: 1.4;
        color: #495057;
      }
      .xylethol-alert-close {
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #6c757d;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .xylethol-alert-close:hover { color: #495057; }
    `,
    minimal: `
      .xylethol-alert-widget {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        margin: 5px 0;
        z-index: 10000;
      }
      .xylethol-alert-widget.fixed-top, .xylethol-alert-widget.fixed-bottom {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        max-width: 500px;
        margin: 0;
        padding: 10px;
      }
      .xylethol-alert-widget.fixed-top { top: 0; }
      .xylethol-alert-widget.fixed-bottom { bottom: 0; }
      .xylethol-alert-item {
        background: #ffffff;
        border: 1px solid #e9ecef;
        border-radius: 2px;
        padding: 12px;
        margin-bottom: 5px;
        position: relative;
        opacity: 0;
        transition: opacity var(--fade-duration, 300ms) ease-in-out;
      }
      .xylethol-alert-item.show { opacity: 1; }
      .xylethol-alert-title {
        font-weight: 500;
        font-size: 14px;
        margin: 0 0 4px 0;
        color: #212529;
      }
      .xylethol-alert-body {
        font-size: 13px;
        margin: 0;
        color: #6c757d;
      }
      .xylethol-alert-close {
        position: absolute;
        top: 8px;
        right: 10px;
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        color: #adb5bd;
        padding: 0;
      }
      .xylethol-alert-close:hover { color: #6c757d; }
    `,
    modern: `
      .xylethol-alert-widget {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        margin: 15px 0;
        z-index: 10000;
      }
      .xylethol-alert-widget.fixed-top, .xylethol-alert-widget.fixed-bottom {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        max-width: 600px;
        margin: 0;
        padding: 15px;
      }
      .xylethol-alert-widget.fixed-top { top: 0; }
      .xylethol-alert-widget.fixed-bottom { bottom: 0; }
      .xylethol-alert-item {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 15px;
        position: relative;
        opacity: 0;
        transition: all var(--fade-duration, 300ms) ease-in-out;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        backdrop-filter: blur(10px);
      }
      .xylethol-alert-item.show { opacity: 1; transform: translateY(0); }
      .xylethol-alert-item { transform: translateY(-10px); }
      .xylethol-alert-title {
        font-weight: 600;
        font-size: 18px;
        margin: 0 0 10px 0;
        color: white;
      }
      .xylethol-alert-body {
        font-size: 14px;
        margin: 0;
        line-height: 1.5;
        color: rgba(255,255,255,0.9);
      }
      .xylethol-alert-close {
        position: absolute;
        top: 15px;
        right: 20px;
        background: rgba(255,255,255,0.2);
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        font-size: 14px;
        cursor: pointer;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .xylethol-alert-close:hover { background: rgba(255,255,255,0.3); }
    `
  };

  // Feature Toggle Client
  class FeatureToggleClient {
    constructor(config) {
      this.config = config;
      this.cache = new Map();
      this.cacheTimestamps = new Map();
      this.isInitialized = false;
    }

    init() {
      if (this.isInitialized) return;
      this.log('FeatureToggle client initialized');
      this.isInitialized = true;
    }

    log(message, ...args) {
      if (this.config.features.debug) {
        console.log(`[Xylethol-Features] ${message}`, ...args);
      }
    }

    error(message, error) {
      console.error(`[Xylethol-Features] ${message}`, error);
      if (this.config.features.onError) {
        this.config.features.onError(message, error);
      }
    }

    getUserAttributes() {
      let attributes = { ...this.config.userAttributes };
      
      attributes.environment = this.config.features.environment;
      
      if (this.config.features.userId) {
        attributes.userId = this.config.features.userId;
      }
      
      if (this.config.detectCurrentPage && typeof window !== 'undefined') {
        attributes.currentPage = window.location.pathname;
      }
      
      return attributes;
    }

    isCacheValid(features) {
      const cacheKey = this.getCacheKey(features);
      const timestamp = this.cacheTimestamps.get(cacheKey);
      
      if (!timestamp) return false;
      
      const now = Date.now();
      return (now - timestamp) < this.config.features.cacheTimeout;
    }

    getCacheKey(features) {
      const userAttributes = this.getUserAttributes();
      return JSON.stringify({ features: features.sort(), userAttributes });
    }

    async checkFeatures(features) {
      if (!Array.isArray(features)) {
        features = [features];
      }

      const cacheKey = this.getCacheKey(features);
      
      if (this.isCacheValid(features) && this.cache.has(cacheKey)) {
        this.log('Returning cached result for features:', features);
        return this.cache.get(cacheKey);
      }

      try {
        const userAttributes = this.getUserAttributes();
        
        this.log('Checking features:', features, 'with attributes:', userAttributes);
        
        const response = await fetch(this.config.features.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            features,
            userAttributes
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const results = await response.json();
        
        this.cache.set(cacheKey, results);
        this.cacheTimestamps.set(cacheKey, Date.now());
        
        this.log('Feature check results:', results);
        
        if (this.config.features.onFeatureChange) {
          this.config.features.onFeatureChange(results);
        }
        
        return results;
      } catch (error) {
        this.error('Failed to check features', error);
        
        const fallbackResults = {};
        features.forEach(feature => {
          fallbackResults[feature] = false;
        });
        
        return fallbackResults;
      }
    }

    async check(featureName) {
      const results = await this.checkFeatures([featureName]);
      return results[featureName] || false;
    }

    async preload(features) {
      this.log('Preloading features:', features);
      await this.checkFeatures(features);
    }

    clearCache() {
      this.cache.clear();
      this.cacheTimestamps.clear();
      this.log('Cache cleared');
    }

    updateConfig(newConfig) {
      const oldAttributes = this.getUserAttributes();
      
      Object.assign(this.config.features, newConfig.features || {});
      if (newConfig.userAttributes !== undefined) {
        this.config.userAttributes = newConfig.userAttributes;
      }
      
      const newAttributes = this.getUserAttributes();
      
      if (JSON.stringify(oldAttributes) !== JSON.stringify(newAttributes)) {
        this.clearCache();
        this.log('User attributes changed, cache cleared');
      }
    }

    async refresh(features) {
      if (features) {
        const cacheKey = this.getCacheKey(Array.isArray(features) ? features : [features]);
        this.cache.delete(cacheKey);
        this.cacheTimestamps.delete(cacheKey);
      } else {
        this.clearCache();
      }
      
      if (features) {
        return await this.checkFeatures(features);
      }
    }

    getCacheStats() {
      return {
        size: this.cache.size,
        keys: Array.from(this.cache.keys())
      };
    }
  }

  // Alert Widget Client
  class AlertWidget {
    constructor(config) {
      this.config = config;
      this.container = null;
      this.alerts = [];
      this.refreshTimer = null;
      this.isInitialized = false;
    }

    init() {
      if (this.isInitialized) return;
      
      this.createContainer();
      this.injectStyles();
      this.fetchAlerts();
      
      if (this.config.alerts.autoRefresh) {
        this.startAutoRefresh();
      }
      
      this.isInitialized = true;
    }

    createContainer() {
      let container = document.getElementById(this.config.alerts.containerId);
      
      if (!container) {
        container = document.createElement('div');
        container.id = this.config.alerts.containerId;
        
        if (this.config.alerts.position === 'top') {
          document.body.insertBefore(container, document.body.firstChild);
        } else {
          document.body.appendChild(container);
        }
      }
      
      container.className = `xylethol-alert-widget ${this.config.alerts.position}`;
      this.container = container;
    }

    injectStyles() {
      const styleId = 'xylethol-alert-styles';
      if (document.getElementById(styleId)) return;
      
      const style = document.createElement('style');
      style.id = styleId;
      
      let allStyles = ALERT_THEMES[this.config.alerts.theme] || ALERT_THEMES.default;
      
      Object.keys(ALERT_THEMES).forEach(themeName => {
        const themeStyles = ALERT_THEMES[themeName]
          .replace(/\.xylethol-alert-item/g, `.xylethol-alert-item.theme-${themeName}`)
          .replace(/\.xylethol-alert-title/g, `.xylethol-alert-item.theme-${themeName} .xylethol-alert-title`)
          .replace(/\.xylethol-alert-body/g, `.xylethol-alert-item.theme-${themeName} .xylethol-alert-body`)
          .replace(/\.xylethol-alert-close/g, `.xylethol-alert-item.theme-${themeName} .xylethol-alert-close`);
        allStyles += '\n' + themeStyles;
      });
      
      style.textContent = allStyles;
      document.head.appendChild(style);
    }

    async fetchAlerts() {
      try {
        let response;
        
        let requestAttributes = { ...this.config.userAttributes };
        if (this.config.detectCurrentPage) {
          requestAttributes.currentPage = window.location.pathname;
        }
        
        if (Object.keys(requestAttributes).length > 0) {
          response = await fetch(this.config.alerts.apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestAttributes)
          });
        } else {
          response = await fetch(this.config.alerts.apiUrl);
        }
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const alerts = await response.json();
        this.renderAlerts(alerts);
      } catch (error) {
        console.error('Xylethol Alerts: Failed to fetch alerts:', error);
        if (this.config.alerts.onError) {
          this.config.alerts.onError(error);
        }
      }
    }

    renderAlerts(alerts) {
      if (!this.container) return;
      
      this.container.innerHTML = '';
      
      if (!alerts || alerts.length === 0) {
        if (this.config.alerts.onNoAlerts) {
          this.config.alerts.onNoAlerts();
        }
        return;
      }
      
      const alertsToShow = this.config.alerts.maxAlerts 
        ? alerts.slice(0, this.config.alerts.maxAlerts)
        : alerts;
      
      alertsToShow.forEach((alert, index) => {
        setTimeout(() => {
          this.renderAlert(alert);
        }, index * 100);
      });
    }

    renderAlert(alert) {
      const alertElement = document.createElement('div');
      const alertTheme = alert.theme || this.config.alerts.theme || 'default';
      alertElement.className = `xylethol-alert-item theme-${alertTheme}`;
      alertElement.dataset.alertId = alert.id;
      
      const closeButton = this.config.alerts.showCloseButton 
        ? `<button class="xylethol-alert-close" onclick="window.Xylethol.hideAlert('${alert.id}')" aria-label="Close">&times;</button>`
        : '';
      
      alertElement.innerHTML = `
        <h4 class="xylethol-alert-title">${this.escapeHtml(alert.title)}</h4>
        <p class="xylethol-alert-body">${this.escapeHtml(alert.body)}</p>
        ${closeButton}
      `;
      
      this.container.appendChild(alertElement);
      
      setTimeout(() => {
        alertElement.classList.add('show');
        if (this.config.alerts.onAlertShow) {
          this.config.alerts.onAlertShow(alert, alertElement);
        }
      }, 50);
    }

    hideAlert(alertId) {
      const alertElement = this.container.querySelector(`[data-alert-id="${alertId}"]`);
      if (!alertElement) return;
      
      alertElement.style.setProperty('--fade-duration', this.config.alerts.fadeOutDuration + 'ms');
      alertElement.classList.remove('show');
      
      setTimeout(() => {
        if (alertElement.parentNode) {
          alertElement.parentNode.removeChild(alertElement);
        }
        if (this.config.alerts.onAlertHide) {
          this.config.alerts.onAlertHide(alertId);
        }
      }, this.config.alerts.fadeOutDuration);
    }

    refresh() {
      this.fetchAlerts();
    }

    startAutoRefresh() {
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer);
      }
      
      this.refreshTimer = setInterval(() => {
        this.fetchAlerts();
      }, this.config.alerts.refreshInterval);
    }

    stopAutoRefresh() {
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer);
        this.refreshTimer = null;
      }
    }

    destroy() {
      this.stopAutoRefresh();
      if (this.container) {
        this.container.innerHTML = '';
      }
      this.isInitialized = false;
    }

    updateConfig(newConfig) {
      if (newConfig.alerts) {
        Object.assign(this.config.alerts, newConfig.alerts);
      }
      
      if (newConfig.alerts && newConfig.alerts.autoRefresh !== undefined) {
        if (newConfig.alerts.autoRefresh) {
          this.startAutoRefresh();
        } else {
          this.stopAutoRefresh();
        }
      }
      
      if (newConfig.userAttributes !== undefined) {
        this.config.userAttributes = newConfig.userAttributes;
        this.fetchAlerts();
      }
    }

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }

  // Main Xylethol Widget Class
  class XyletholWidget {
    constructor(config = {}) {
      this.config = { ...DEFAULT_CONFIG };
      this.mergeConfig(config);
      
      this.alertWidget = new AlertWidget(this.config);
      this.featureClient = new FeatureToggleClient(this.config);
      
      this.init();
    }

    mergeConfig(config) {
      Object.keys(config).forEach(key => {
        if (typeof config[key] === 'object' && config[key] !== null && !Array.isArray(config[key])) {
          this.config[key] = { ...this.config[key], ...config[key] };
        } else {
          this.config[key] = config[key];
        }
      });
    }

    init() {
      this.alertWidget.init();
      this.featureClient.init();
    }

    // Alert Widget Methods
    refreshAlerts() {
      this.alertWidget.refresh();
    }

    hideAlert(alertId) {
      this.alertWidget.hideAlert(alertId);
    }

    // Feature Toggle Methods
    async checkFeature(featureName) {
      return await this.featureClient.check(featureName);
    }

    async checkFeatures(features) {
      return await this.featureClient.checkFeatures(features);
    }

    async preloadFeatures(features) {
      await this.featureClient.preload(features);
    }

    refreshFeatures(features) {
      return this.featureClient.refresh(features);
    }

    clearFeatureCache() {
      this.featureClient.clearCache();
    }

    getFeatureCacheStats() {
      return this.featureClient.getCacheStats();
    }

    // Shared Methods
    updateConfig(newConfig) {
      this.mergeConfig(newConfig);
      this.alertWidget.updateConfig(this.config);
      this.featureClient.updateConfig(this.config);
    }

    setUserAttributes(userAttributes) {
      this.updateConfig({ userAttributes });
    }

    setUserId(userId) {
      this.updateConfig({ features: { userId } });
    }

    onPageChange() {
      if (this.config.detectCurrentPage) {
        this.alertWidget.fetchAlerts();
        this.featureClient.clearCache();
      }
    }

    destroy() {
      this.alertWidget.destroy();
      this.featureClient.clearCache();
    }
  }

  // React Hook for feature toggles
  function createReactHook() {
    if (typeof window !== 'undefined' && window.React) {
      const { useState, useEffect } = window.React;
      
      return function useXyletholFeature(featureName, userAttributes = null) {
        const [isEnabled, setIsEnabled] = useState(false);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
          let mounted = true;
          
          async function checkFeature() {
            try {
              setLoading(true);
              setError(null);
              
              const client = window.Xylethol.instance || new XyletholWidget({
                userAttributes
              });
              
              const enabled = await client.checkFeature(featureName);
              
              if (mounted) {
                setIsEnabled(enabled);
              }
            } catch (err) {
              if (mounted) {
                setError(err.message);
                setIsEnabled(false);
              }
            } finally {
              if (mounted) {
                setLoading(false);
              }
            }
          }

          checkFeature();
          
          return () => {
            mounted = false;
          };
        }, [featureName, JSON.stringify(userAttributes)]);

        return { isEnabled, loading, error };
      };
    }
    
    return null;
  }

  // Global API
  window.Xylethol = {
    instance: null,
    
    init: function(config) {
      if (this.instance) {
        this.instance.destroy();
      }
      this.instance = new XyletholWidget(config);
      return this.instance;
    },
    
    // Alert Methods
    refreshAlerts: function() {
      if (this.instance) {
        this.instance.refreshAlerts();
      }
    },
    
    hideAlert: function(alertId) {
      if (this.instance) {
        this.instance.hideAlert(alertId);
      }
    },
    
    // Feature Methods
    checkFeature: async function(featureName) {
      if (!this.instance) {
        this.instance = new XyletholWidget();
      }
      return await this.instance.checkFeature(featureName);
    },
    
    checkFeatures: async function(features) {
      if (!this.instance) {
        this.instance = new XyletholWidget();
      }
      return await this.instance.checkFeatures(features);
    },
    
    preloadFeatures: async function(features) {
      if (!this.instance) {
        this.instance = new XyletholWidget();
      }
      await this.instance.preloadFeatures(features);
    },
    
    refreshFeatures: async function(features) {
      if (this.instance) {
        return await this.instance.refreshFeatures(features);
      }
    },
    
    clearFeatureCache: function() {
      if (this.instance) {
        this.instance.clearFeatureCache();
      }
    },
    
    getFeatureCacheStats: function() {
      if (this.instance) {
        return this.instance.getFeatureCacheStats();
      }
      return { size: 0, keys: [] };
    },
    
    // Shared Methods
    setUserAttributes: function(userAttributes) {
      if (!this.instance) {
        this.instance = new XyletholWidget();
      }
      this.instance.setUserAttributes(userAttributes);
    },
    
    setUserId: function(userId) {
      if (!this.instance) {
        this.instance = new XyletholWidget();
      }
      this.instance.setUserId(userId);
    },
    
    updateConfig: function(config) {
      if (!this.instance) {
        this.instance = new XyletholWidget(config);
      } else {
        this.instance.updateConfig(config);
      }
    },
    
    onPageChange: function() {
      if (this.instance) {
        this.instance.onPageChange();
      }
    },
    
    destroy: function() {
      if (this.instance) {
        this.instance.destroy();
        this.instance = null;
      }
    }
  };

  // Create React hook if React is available
  const useXyletholFeature = createReactHook();
  if (useXyletholFeature) {
    window.useXyletholFeature = useXyletholFeature;
  }

  // Auto-initialize if config is provided in script tag
  document.addEventListener('DOMContentLoaded', function() {
    const script = document.querySelector('script[data-xylethol-config]');
    if (script) {
      try {
        const config = JSON.parse(script.getAttribute('data-xylethol-config'));
        window.Xylethol.init(config);
      } catch (e) {
        console.error('Xylethol: Invalid configuration in script tag', e);
      }
    }
  });

})(window, document);