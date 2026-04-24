// src/utils/session.js
import { saveSession, getDateKey } from './storage.js';

// Generate a unique session ID
export const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Generate a unique submission ID
export const generateSubmissionId = () => {
  return `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get URL parameters
export const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_campaign: urlParams.get('utm_campaign'),
    utm_source: urlParams.get('utm_source'),
    utm_medium: urlParams.get('utm_medium'),
    campaign: urlParams.get('campaign'),
    sid: urlParams.get('sid')
  };
};

// Detect device type
export const getDeviceType = () => {
  const width = window.innerWidth;
  return width <= 768 ? 'mobile' : 'desktop';
};

// Detect browser (simple implementation)
export const getBrowser = () => {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Opera')) return 'Opera';
  return 'Unknown';
};

// Initialize session tracking
export const initializeSession = () => {
  const params = getUrlParams();
  const sessionData = {
    sessionId: params.sid || generateSessionId(),
    createdAt: new Date().toISOString(),
    dateKey: getDateKey(),
    utm_campaign: params.utm_campaign,
    utm_source: params.utm_source,
    utm_medium: params.utm_medium,
    campaign: params.campaign,
    referrer: document.referrer || null,
    deviceType: getDeviceType(),
    browser: getBrowser()
  };

  saveSession(sessionData);
  return sessionData;
};

// Get current session data (without creating a new session)
export const getCurrentSession = () => {
  const params = getUrlParams();
  const sessionData = {
    sessionId: params.sid || generateSessionId(),
    createdAt: new Date().toISOString(),
    dateKey: getDateKey(),
    utm_campaign: params.utm_campaign,
    utm_source: params.utm_source,
    utm_medium: params.utm_medium,
    campaign: params.campaign,
    referrer: document.referrer || null,
    deviceType: getDeviceType(),
    browser: getBrowser()
  };

  return sessionData;
};