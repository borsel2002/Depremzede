// Main application logic
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the app
  initApp();
});

// Global variables
let currentPosition = null;
let isOnline = navigator.onLine;
let reportsData = [];
let peerConnections = {};
let nodeId = generateNodeId();

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
  
  // Set up peer-to-peer communication if enabled
  if (config.enableP2P) {
    initP2PCommunication();
  }
  
  console.log('Application initialized with node ID:', nodeId);
}

// Generate a unique node ID for this instance
function generateNodeId() {
  return 'node-' + Math.random().toString(36).substr(2, 9);
}

// Initialize peer-to-peer communication
function initP2PCommunication() {
  // This is a simplified implementation
  // In a real application, you would use WebRTC or a similar technology
  
  // Listen for broadcast channel messages
  const channel = new BroadcastChannel('earthquake-rescue-p2p');
  
  channel.onmessage = function(event) {
    const message = event.data;
    
    // Handle different message types
    switch(message.type) {
      case 'SYNC_REQUEST':
        // Another node is requesting our data
        sendReportsToNode(message.nodeId);
        break;
      case 'SYNC_DATA':
        // We received data from another node
        if (message.nodeId !== nodeId) {
          mergeReports(message.reports);
        }
        break;
      case 'NEW_REPORT':
        // A new report was created by another node
        if (message.nodeId !== nodeId) {
          addRemoteReport(message.report);
        }
        break;
    }
  };
  
  // Broadcast our presence and request data
  channel.postMessage({
    type: 'SYNC_REQUEST',
    nodeId: nodeId
  });
  
  // Store the channel for later use
  window.p2pChannel = channel;
}

// Send our reports to another node
function sendReportsToNode(targetNodeId) {
  if (window.p2pChannel) {
    window.p2pChannel.postMessage({
      type: 'SYNC_DATA',
      nodeId: nodeId,
      reports: reportsData
    });
  }
}

// Merge reports from another node
function mergeReports(remoteReports) {
  if (!remoteReports || !Array.isArray(remoteReports)) return;
  
  let updated = false;
  
  remoteReports.forEach(remoteReport => {
    // Check if we already have this report
    const existingIndex = reportsData.findIndex(r => r.id === remoteReport.id);
    
    if (existingIndex === -1) {
      // This is a new report
      reportsData.push(remoteReport);
      updated = true;
    } else {
      // We have this report, check if the remote one is newer
      const existingReport = reportsData[existingIndex];
      const existingTime = new Date(existingReport.timestamp).getTime();
      const remoteTime = new Date(remoteReport.timestamp).getTime();
      
      if (remoteTime > existingTime) {
        // Remote report is newer, update ours
        reportsData[existingIndex] = remoteReport;
        updated = true;
      }
    }
  });
  
  if (updated) {
    // Save the updated reports
    localStorage.setItem('reports', JSON.stringify(reportsData));
    
    // Refresh the map
    loadReports();
  }
}

// Add a report received from another node
function addRemoteReport(report) {
  if (!report || !report.id) return;
  
  // Check if we already have this report
  const existingIndex = reportsData.findIndex(r => r.id === report.id);
  
  if (existingIndex === -1) {
    // This is a new report
    reportsData.push(report);
    
    // Save to localStorage
    localStorage.setItem('reports', JSON.stringify(reportsData));
    
    // Refresh the map
    loadReports();
  }
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
    id: 'report-' + Date.now() + '-' + nodeId,
    locationDescription: document.getElementById('location-description').value,
    numPeople: parseInt(document.getElementById('num-people').value),
    situation: document.getElementById('situation').value,
    contactInfo: document.getElementById('contact-info').value,
    timestamp: new Date().toISOString(),
    status: 'unverified',
    latitude: currentPosition.latitude,
    longitude: currentPosition.longitude,
    nodeId: nodeId
  };
  
  // Store the report in local storage
  storeReportLocally(reportData);
  
  // Broadcast the new report to other nodes
  if (config.enableP2P && window.p2pChannel) {
    window.p2pChannel.postMessage({
      type: 'NEW_REPORT',
      nodeId: nodeId,
      report: reportData
    });
  }
  
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

// Verify a report
function verifyReport(reportId) {
  // Get reports from localStorage
  let reports = JSON.parse(localStorage.getItem('reports') || '[]');
  
  // Find and update the report
  const reportIndex = reports.findIndex(r => r.id === reportId);
  if (reportIndex !== -1) {
    reports[reportIndex].status = 'verified';
    reports[reportIndex].verifiedAt = new Date().toISOString();
    reports[reportIndex].verifiedBy = nodeId;
    
    // Update localStorage
    localStorage.setItem('reports', JSON.stringify(reports));
    
    // Update reportsData
    reportsData = reports;
    
    // Broadcast the update to other nodes
    if (config.enableP2P && window.p2pChannel) {
      window.p2pChannel.postMessage({
        type: 'NEW_REPORT',
        nodeId: nodeId,
        report: reports[reportIndex]
      });
    }
    
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
    reports[reportIndex].resolvedAt = new Date().toISOString();
    reports[reportIndex].resolvedBy = nodeId;
    
    // Update localStorage
    localStorage.setItem('reports', JSON.stringify(reports));
    
    // Update reportsData
    reportsData = reports;
    
    // Broadcast the update to other nodes
    if (config.enableP2P && window.p2pChannel) {
      window.p2pChannel.postMessage({
        type: 'NEW_REPORT',
        nodeId: nodeId,
        report: reports[reportIndex]
      });
    }
    
    // Refresh the map
    loadReports();
  }
}
