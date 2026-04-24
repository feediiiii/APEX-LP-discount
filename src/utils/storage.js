// src/utils/storage.js
const STORAGE_KEYS = {
  SESSIONS: 'sessions',
  SUBMISSIONS: 'submissions',
  DASHBOARD_AUTH: 'dashboard_auth'
};

// Helper functions for localStorage
export const loadFromStorage = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Session management
export const saveSession = (sessionData) => {
  const sessions = loadFromStorage(STORAGE_KEYS.SESSIONS);
  sessions.push(sessionData);
  saveToStorage(STORAGE_KEYS.SESSIONS, sessions);
  return sessionData.sessionId;
};

export const getSessions = () => loadFromStorage(STORAGE_KEYS.SESSIONS);

export const getSessionsByDateRange = (startDate, endDate) => {
  const sessions = getSessions();
  return sessions.filter(session => {
    const sessionDate = new Date(session.createdAt);
    return sessionDate >= startDate && sessionDate <= endDate;
  });
};

export const getSessionsLastNDays = (days) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  return getSessionsByDateRange(startDate, endDate);
};

// Submission management
export const saveSubmission = (submissionData) => {
  const submissions = loadFromStorage(STORAGE_KEYS.SUBMISSIONS);
  submissions.push(submissionData);
  saveToStorage(STORAGE_KEYS.SUBMISSIONS, submissions);
  return submissionData.submissionId;
};

export const getSubmissions = () => loadFromStorage(STORAGE_KEYS.SUBMISSIONS);

export const getSubmissionsByDateRange = (startDate, endDate) => {
  const submissions = getSubmissions();
  return submissions.filter(submission => {
    const submissionDate = new Date(submission.createdAt);
    return submissionDate >= startDate && submissionDate <= endDate;
  });
};

export const getSubmissionsLastNDays = (days) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  return getSubmissionsByDateRange(startDate, endDate);
};

// Dashboard auth
export const setDashboardAuth = (authenticated) => {
  saveToStorage(STORAGE_KEYS.DASHBOARD_AUTH, authenticated);
};

export const getDashboardAuth = () => loadFromStorage(STORAGE_KEYS.DASHBOARD_AUTH, false);

// Date utilities
export const getDateKey = (date = new Date()) => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

export const groupByDate = (items, dateField = 'dateKey') => {
  return items.reduce((acc, item) => {
    const date = item[dateField];
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});
};

export const getDateRange = (days) => {
  const dates = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(getDateKey(date));
  }
  return dates;
};