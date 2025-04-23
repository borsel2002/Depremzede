// Main application logic
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the app
  initApp();
});

// Global variables
let currentPosition = null;
let isOnline = navigator.onLine;
let pendingReports = [];
let reportsData = [];

// Initialize the application
function initApp() {
  // Set up event listeners
  setupEventListeners();
  
  // Initialize the map
  initMap();
  
  // Set up language
  initLanguage();
  
  // Check online status
  updateOnlineStatus();
  
  // Load reports from local storage
  loadReports();
  
  // Set up periodic refresh
  setInterval(loadReports, config.refreshInterval);
}

// Set up event listeners
function setupEventListeners() {
  // Report button
  document.getElementById('report-button').addEventListener('click', showReportModal);
  
  // Form submission
  document.getElementById('report-form').addEventListener('submit', handleFormSubmit);
  
  // Clear form button
  document.getElementById('clear-form').addEventListener('click', clearForm);
  
  // Locate me button
  document.getElementById('locate-me').addEventListener('click', locateUser);
  
  // Filter checkboxes
  document.getElementById('show-verified').addEventListener('change', applyFilters);
  document.getElementById('show-unverified').addEventListener('change', applyFilters);
  document.getElementById('show-resolved').addEventListener('change', applyFilters);
  
  // Language selector
  document.getElementById('language-select').addEventListener('change', function(e) {
    changeLanguage(e.target.value);
  });
  
  // Modal close button
  document.querySelector('.close').addEventListener('click', closeModal);
  
  // Online/offline events
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
}

// Show the report modal
function showReportModal() {
  // Check if we have the user's location
  if (!currentPosition) {
    // Get the user's location first
    locateUser(function() {
      openReportModal();
    });
  } else {
    openReportModal();
  }
}

// Open the report modal
function openReportModal() {
  const modal = document.getElementById('report-modal');
  modal.style.display = 'block';
}

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();
  
  // Check if we have the user's location
  if (!currentPosition) {
    alert(getTranslation('location-required'));
    return;
  }
  
  // Show loading indicator
  showLoading();
  
  // Get form data
  const reportData = {
    id: 'report-' + Date.now(),
    locationDescription: document.getElementById('location-description').value,
    numPeople: parseInt(document.getElementById('num-people').value),
    situation: document.getElementById('situation').value,
    contactInfo: document.getElementById('contact-info').value,
    timestamp: new Date().toISOString(),
    status: 'unverified',
    latitude: currentPosition.latitude,
    longitude: currentPosition.longitude
  };
  
  // Store the report in local storage
  storeReportLocally(reportData);
  
  // Clear form and close modal
  clearForm();
  closeModal();
  hideLoading();
  alert(getTranslation('report-success'));
  
  // Refresh reports
  loadReports();
}

// Store report locally
function storeReportLocally(reportData) {
  // Get existing reports
  let reports = JSON.parse(localStorage.getItem('reports') || '[]');
  
  // Add new report
  reports.push(reportData);
  
  // Store back in localStorage
  localStorage.setItem('reports', JSON.stringify(reports));
  
  // Add to current reports data
  reportsData.push(reportData);
  
  // Add to map
  addMarkerToMap(reportData);
}

// Close the modal
function closeModal() {
  const modal = document.getElementById('report-modal');
  modal.style.display = 'none';
}

// Clear the form
function clearForm() {
  document.getElementById('report-form').reset();
}

// Update online status
function updateOnlineStatus() {
  isOnline = navigator.onLine;
  const offlineNotification = document.querySelector('.offline-notification') || 
    createOfflineNotification();
  
  if (!isOnline) {
    offlineNotification.style.display = 'block';
  } else {
    offlineNotification.style.display = 'none';
  }
}

// Create offline notification element
function createOfflineNotification() {
  const notification = document.createElement('div');
  notification.className = 'offline-notification';
  notification.textContent = getTranslation('offline-message');
  document.body.appendChild(notification);
  return notification;
}

// Load reports from localStorage
function loadReports() {
  // Clear existing markers
  clearMarkers();
  
  // Get reports from localStorage
  reportsData = JSON.parse(localStorage.getItem('reports') || '[]');
  
  // Add markers to map
  reportsData.forEach(report => {
    addMarkerToMap(report);
  });
  
  // Apply any active filters
  applyFilters();
}

// Apply filters to the reports
function applyFilters() {
  const showVerified = document.getElementById('show-verified').checked;
  const showUnverified = document.getElementById('show-unverified').checked;
  const showResolved = document.getElementById('show-resolved').checked;
  
  // Update marker visibility based on filters
  updateMarkerVisibility(showVerified, showUnverified, showResolved);
}

// Show loading indicator
function showLoading() {
  let loading = document.querySelector('.loading');
  if (!loading) {
    loading = document.createElement('div');
    loading.className = 'loading';
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    loading.appendChild(spinner);
    document.body.appendChild(loading);
  }
  loading.style.display = 'flex';
}

// Hide loading indicator
function hideLoading() {
  const loading = document.querySelector('.loading');
  if (loading) {
    loading.style.display = 'none';
  }
}

// Verify a report (for demonstration purposes)
function verifyReport(reportId) {
  // Get reports from localStorage
  let reports = JSON.parse(localStorage.getItem('reports') || '[]');
  
  // Find and update the report
  const reportIndex = reports.findIndex(r => r.id === reportId);
  if (reportIndex !== -1) {
    reports[reportIndex].status = 'verified';
    
    // Update localStorage
    localStorage.setItem('reports', JSON.stringify(reports));
    
    // Update reportsData
    reportsData = reports;
    
    // Refresh the map
    loadReports();
  }
}

// Mark a report as resolved
function resolveReport(reportId) {
  // Get reports from localStorage
  let reports = JSON.parse(localStorage.getItem('reports') || '[]');
  
  // Find and update the report
  const reportIndex = reports.findIndex(r => r.id === reportId);
  if (reportIndex !== -1) {
    reports[reportIndex].status = 'resolved';
    
    // Update localStorage
    localStorage.setItem('reports', JSON.stringify(reports));
    
    // Update reportsData
    reportsData = reports;
    
    // Refresh the map
    loadReports();
  }
}
