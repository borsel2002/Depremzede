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
let currentReportId = null;

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
  // This is a simplified implementation using BroadcastChannel API
  // In a real distributed environment, you would use WebRTC or similar technology
  
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
      case 'VERIFY_VOTE':
        // A verification vote from another node
        if (message.nodeId !== nodeId) {
          processVerificationVote(message.reportId, message.nodeId);
        }
        break;
      case 'RESOLVE_VOTE':
        // A resolution vote from another node
        if (message.nodeId !== nodeId) {
          processResolutionVote(message.reportId, message.nodeId);
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
    
    // Refresh the map and list
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
    
    // Refresh the map and list
    loadReports();
  }
}

// Process a verification vote from another node
function processVerificationVote(reportId, voterNodeId) {
  // Get reports from localStorage
  let reports = JSON.parse(localStorage.getItem('reports') || '[]');
  
  // Find the report
  const reportIndex = reports.findIndex(r => r.id === reportId);
  if (reportIndex === -1) return;
  
  // Get the report
  const report = reports[reportIndex];
  
  // Initialize verification votes array if it doesn't exist
  if (!report.verificationVotes) {
    report.verificationVotes = [];
  }
  
  // Check if this node has already voted
  if (report.verificationVotes.includes(voterNodeId)) {
    return; // Already voted
  }
  
  // Add the vote
  report.verificationVotes.push(voterNodeId);
  
  // Check if we have enough votes to verify the report
  if (report.verificationVotes.length >= config.requiredVerifications && report.status !== 'verified') {
    report.status = 'verified';
    report.verifiedAt = new Date().toISOString();
    report.verifiedBy = 'community'; // Multiple verifiers
  }
  
  // Update the report
  reports[reportIndex] = report;
  
  // Save to localStorage
  localStorage.setItem('reports', JSON.stringify(reports));
  
  // Update reportsData
  reportsData = reports;
  
  // Refresh the map and list
  loadReports();
}

// Process a resolution vote from another node
function processResolutionVote(reportId, voterNodeId) {
  // Get reports from localStorage
  let reports = JSON.parse(localStorage.getItem('reports') || '[]');
  
  // Find the report
  const reportIndex = reports.findIndex(r => r.id === reportId);
  if (reportIndex === -1) return;
  
  // Get the report
  const report = reports[reportIndex];
  
  // Initialize resolution votes array if it doesn't exist
  if (!report.resolutionVotes) {
    report.resolutionVotes = [];
  }
  
  // Check if this node has already voted
  if (report.resolutionVotes.includes(voterNodeId)) {
    return; // Already voted
  }
  
  // Add the vote
  report.resolutionVotes.push(voterNodeId);
  
  // Check if we have enough votes to resolve the report
  if (report.resolutionVotes.length >= config.requiredResolutions && report.status !== 'resolved') {
    report.status = 'resolved';
    report.resolvedAt = new Date().toISOString();
    report.resolvedBy = 'community'; // Multiple resolvers
  }
  
  // Update the report
  reports[reportIndex] = report;
  
  // Save to localStorage
  localStorage.setItem('reports', JSON.stringify(reports));
  
  // Update reportsData
  reportsData = reports;
  
  // Refresh the map and list
  loadReports();
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
  
  // List view filter checkboxes
  document.getElementById('list-show-verified').addEventListener('change', applyListFilters);
  document.getElementById('list-show-unverified').addEventListener('change', applyListFilters);
  document.getElementById('list-show-resolved').addEventListener('change', applyListFilters);
  
  // Search box
  document.getElementById('search-reports').addEventListener('input', applyListFilters);
  
  // View toggle buttons
  document.getElementById('map-view-btn').addEventListener('click', function() {
    showView('map');
  });
  
  document.getElementById('list-view-btn').addEventListener('click', function() {
    showView('list');
  });
  
  // Report detail modal actions
  document.getElementById('detail-verify-btn').addEventListener('click', function() {
    if (currentReportId) {
      voteToVerifyReport(currentReportId);
      closeDetailModal();
    }
  });
  
  document.getElementById('detail-resolve-btn').addEventListener('click', function() {
    if (currentReportId) {
      voteToResolveReport(currentReportId);
      closeDetailModal();
    }
  });
  
  document.getElementById('detail-show-on-map-btn').addEventListener('click', function() {
    if (currentReportId) {
      const report = reportsData.find(r => r.id === currentReportId);
      if (report) {
        closeDetailModal();
        showView('map');
        map.setView([report.latitude, report.longitude], 15);
        // Find the marker and open its popup
        const markerObj = markers.find(m => m.id === report.id);
        if (markerObj) {
          markerObj.marker.openPopup();
        }
      }
    }
  });
  
  // Close detail modal
  document.querySelector('.close-detail').addEventListener('click', closeDetailModal);
  
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

// Show view (map or list)
function showView(viewType) {
  const mapView = document.getElementById('map-view');
  const listView = document.getElementById('list-view');
  const mapBtn = document.getElementById('map-view-btn');
  const listBtn = document.getElementById('list-view-btn');
  
  if (viewType === 'map') {
    mapView.style.display = 'flex';
    listView.style.display = 'none';
    mapBtn.classList.add('active');
    listBtn.classList.remove('active');
    // Refresh the map to ensure it's properly sized
    if (map) {
      map.invalidateSize();
    }
  } else {
    mapView.style.display = 'none';
    listView.style.display = 'block';
    mapBtn.classList.remove('active');
    listBtn.classList.add('active');
    // Refresh the list
    renderReportsList();
  }
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
    nodeId: nodeId,
    verificationVotes: [], // Initialize empty verification votes array
    resolutionVotes: []    // Initialize empty resolution votes array
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
  
  // Update list view if active
  if (document.getElementById('list-view').style.display !== 'none') {
    renderReportsList();
  }
}

// Close the modal
function closeModal() {
  const modal = document.getElementById('report-modal');
  modal.style.display = 'none';
}

// Close the detail modal
function closeDetailModal() {
  const modal = document.getElementById('report-detail-modal');
  modal.style.display = 'none';
  currentReportId = null;
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
  
  // Ensure all reports have verification and resolution votes arrays
  reportsData.forEach(report => {
    if (!report.verificationVotes) {
      report.verificationVotes = [];
    }
    if (!report.resolutionVotes) {
      report.resolutionVotes = [];
    }
  });
  
  // Add markers to map
  reportsData.forEach(report => {
    addMarkerToMap(report);
  });
  
  // Apply any active filters
  applyFilters();
  
  // Update list view if it's visible
  if (document.getElementById('list-view').style.display !== 'none') {
    renderReportsList();
  }
}

// Apply filters to the map
function applyFilters() {
  const showVerified = document.getElementById('show-verified').checked;
  const showUnverified = document.getElementById('show-unverified').checked;
  const showResolved = document.getElementById('show-resolved').checked;
  
  // Update marker visibility based on filters
  updateMarkerVisibility(showVerified, showUnverified, showResolved);
}

// Apply filters to the list view
function applyListFilters() {
  renderReportsList();
}

// Render the reports list
function renderReportsList() {
  const reportsList = document.getElementById('reports-list');
  const showVerified = document.getElementById('list-show-verified').checked;
  const showUnverified = document.getElementById('list-show-unverified').checked;
  const showResolved = document.getElementById('list-show-resolved').checked;
  const searchTerm = document.getElementById('search-reports').value.toLowerCase();
  
  // Clear the list
  reportsList.innerHTML = '';
  
  // Filter reports
  const filteredReports = reportsData.filter(report => {
    // Apply status filters
    if (report.status === 'verified' && !showVerified) return false;
    if (report.status === 'unverified' && !showUnverified) return false;
    if (report.status === 'resolved' && !showResolved) return false;
    
    // Apply search filter
    if (searchTerm) {
      const searchFields = [
        report.locationDescription,
        report.situation,
        report.contactInfo,
        report.id
      ].filter(Boolean).map(field => field.toLowerCase());
      
      return searchFields.some(field => field.includes(searchTerm));
    }
    
    return true;
  });
  
  // Sort reports by timestamp (newest first)
  filteredReports.sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
  
  // Show no reports message if no reports match filters
  if (filteredReports.length === 0) {
    const noReports = document.createElement('div');
    noReports.className = 'no-reports';
    noReports.textContent = getTranslation('no-reports');
    reportsList.appendChild(noReports);
    return;
  }
  
  // Create report cards
  filteredReports.forEach(report => {
    const reportCard = createReportCard(report);
    reportsList.appendChild(reportCard);
  });
}

// Create a report card element
function createReportCard(report) {
  const card = document.createElement('div');
  card.className = 'report-card';
  card.dataset.id = report.id;
  
  // Format date
  const date = new Date(report.timestamp);
  const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  
  // Create card content
  card.innerHTML = `
    <div class="report-card-header">
      <div class="report-card-title">${report.locationDescription}</div>
      <div class="report-card-status status-${report.status}">${getTranslation(report.status)}</div>
    </div>
    <div class="report-card-content">
      <p><strong>${getTranslation('people')}:</strong> ${report.numPeople}</p>
      <p>${report.situation.length > 100 ? report.situation.substring(0, 100) + '...' : report.situation}</p>
    </div>
    <div class="report-card-footer">
      <div>${getTranslation('time')}: ${formattedDate}</div>
      <div>${getTranslation('contact')}: ${report.contactInfo || '-'}</div>
    </div>
  `;
  
  // Add click event to show details
  card.addEventListener('click', function() {
    showReportDetails(report.id);
  });
  
  return card;
}

// Show report details
function showReportDetails(reportId) {
  const report = reportsData.find(r => r.id === reportId);
  if (!report) return;
  
  // Set current report ID
  currentReportId = reportId;
  
  // Format dates
  const createdDate = new Date(report.timestamp);
  const formattedCreatedDate = createdDate.toLocaleDateString() + ' ' + createdDate.toLocaleTimeString();
  
  let verifiedInfo = '';
  if (report.verifiedAt) {
    const verifiedDate = new Date(report.verifiedAt);
    const formattedVerifiedDate = verifiedDate.toLocaleDateString() + ' ' + verifiedDate.toLocaleTimeString();
    verifiedInfo = `
      <p><strong>${getTranslation('verified-at')}:</strong> ${formattedVerifiedDate}</p>
      <p><strong>${getTranslation('verified-by')}:</strong> ${report.verifiedBy || '-'}</p>
    `;
  }
  
  let resolvedInfo = '';
  if (report.resolvedAt) {
    const resolvedDate = new Date(report.resolvedAt);
    const formattedResolvedDate = resolvedDate.toLocaleDateString() + ' ' + resolvedDate.toLocaleTimeString();
    resolvedInfo = `
      <p><strong>${getTranslation('resolved-at')}:</strong> ${formattedResolvedDate}</p>
      <p><strong>${getTranslation('resolved-by')}:</strong> ${report.resolvedBy || '-'}</p>
    `;
  }
  
  // Create verification and resolution vote information
  const verificationVotes = report.verificationVotes ? report.verificationVotes.length : 0;
  const resolutionVotes = report.resolutionVotes ? report.resolutionVotes.length : 0;
  
  const votesInfo = `
    <div class="votes-info">
      <p><strong>${getTranslation('verification-votes')}:</strong> ${verificationVotes}/${config.requiredVerifications}</p>
      <p><strong>${getTranslation('resolution-votes')}:</strong> ${resolutionVotes}/${config.requiredResolutions}</p>
    </div>
  `;
  
  // Create detail content
  const detailContent = document.getElementById('report-detail-content');
  detailContent.innerHTML = `
    <div class="report-detail-header">
      <div class="report-detail-title">${report.locationDescription}</div>
      <div class="report-detail-status status-${report.status}">${getTranslation(report.status)}</div>
    </div>
    <div class="report-detail-info">
      <p><strong>${getTranslation('location')}:</strong> ${report.locationDescription}</p>
      <p><strong>${getTranslation('people')}:</strong> ${report.numPeople}</p>
      <p><strong>${getTranslation('situation')}:</strong> ${report.situation}</p>
      <p><strong>${getTranslation('contact')}:</strong> ${report.contactInfo || '-'}</p>
      <p><strong>${getTranslation('created-at')}:</strong> ${formattedCreatedDate}</p>
      <p><strong>${getTranslation('created-by')}:</strong> ${report.nodeId || '-'}</p>
      ${votesInfo}
      ${verifiedInfo}
      ${resolvedInfo}
    </div>
  `;
  
  // Show/hide action buttons based on status and whether this node has already voted
  const verifyBtn = document.getElementById('detail-verify-btn');
  const resolveBtn = document.getElementById('detail-resolve-btn');
  
  // Check if this node has already voted for verification
  const hasVotedForVerification = report.verificationVotes && report.verificationVotes.includes(nodeId);
  
  // Check if this node has already voted for resolution
  const hasVotedForResolution = report.resolutionVotes && report.resolutionVotes.includes(nodeId);
  
  // Show verify button if report is unverified and this node hasn't voted yet
  if (report.status === 'unverified' && !hasVotedForVerification) {
    verifyBtn.style.display = 'block';
    verifyBtn.textContent = getTranslation('vote-to-verify');
  } else if (report.status === 'unverified' && hasVotedForVerification) {
    verifyBtn.style.display = 'block';
    verifyBtn.textContent = getTranslation('voted-to-verify');
    verifyBtn.disabled = true;
  } else {
    verifyBtn.style.display = 'none';
  }
  
  // Show resolve button if report is not resolved and this node hasn't voted yet
  if (report.status !== 'resolved' && !hasVotedForResolution) {
    resolveBtn.style.display = 'block';
    resolveBtn.textContent = getTranslation('vote-to-resolve');
  } else if (report.status !== 'resolved' && hasVotedForResolution) {
    resolveBtn.style.display = 'block';
    resolveBtn.textContent = getTranslation('voted-to-resolve');
    resolveBtn.disabled = true;
  } else {
    resolveBtn.style.display = 'none';
  }
  
  // Show the modal
  const modal = document.getElementById('report-detail-modal');
  modal.style.display = 'block';
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

// Vote to verify a report
function voteToVerifyReport(reportId) {
  // Get reports from localStorage
  let reports = JSON.parse(localStorage.getItem('reports') || '[]');
  
  // Find the report
  const reportIndex = reports.findIndex(r => r.id === reportId);
  if (reportIndex === -1) return;
  
  // Get the report
  const report = reports[reportIndex];
  
  // Initialize verification votes array if it doesn't exist
  if (!report.verificationVotes) {
    report.verificationVotes = [];
  }
  
  // Check if this node has already voted
  if (report.verificationVotes.includes(nodeId)) {
    alert(getTranslation('already-voted'));
    return;
  }
  
  // Add the vote
  report.verificationVotes.push(nodeId);
  
  // Check if we have enough votes to verify the report
  if (report.verificationVotes.length >= config.requiredVerifications && report.status !== 'verified') {
    report.status = 'verified';
    report.verifiedAt = new Date().toISOString();
    report.verifiedBy = 'community'; // Multiple verifiers
    
    // Show notification
    alert(getTranslation('report-verified'));
  } else {
    // Show notification about the vote
    alert(getTranslation('verification-vote-recorded')
      .replace('{current}', report.verificationVotes.length)
      .replace('{required}', config.requiredVerifications));
  }
  
  // Update the report
  reports[reportIndex] = report;
  
  // Save to localStorage
  localStorage.setItem('reports', JSON.stringify(reports));
  
  // Update reportsData
  reportsData = reports;
  
  // Broadcast the vote to other nodes
  if (config.enableP2P && window.p2pChannel) {
    window.p2pChannel.postMessage({
      type: 'VERIFY_VOTE',
      nodeId: nodeId,
      reportId: reportId
    });
  }
  
  // Refresh the map and list
  loadReports();
}

// Vote to resolve a report
function voteToResolveReport(reportId) {
  // Get reports from localStorage
  let reports = JSON.parse(localStorage.getItem('reports') || '[]');
  
  // Find the report
  const reportIndex = reports.findIndex(r => r.id === reportId);
  if (reportIndex === -1) return;
  
  // Get the report
  const report = reports[reportIndex];
  
  // Initialize resolution votes array if it doesn't exist
  if (!report.resolutionVotes) {
    report.resolutionVotes = [];
  }
  
  // Check if this node has already voted
  if (report.resolutionVotes.includes(nodeId)) {
    alert(getTranslation('already-voted'));
    return;
  }
  
  // Add the vote
  report.resolutionVotes.push(nodeId);
  
  // Check if we have enough votes to resolve the report
  if (report.resolutionVotes.length >= config.requiredResolutions && report.status !== 'resolved') {
    report.status = 'resolved';
    report.resolvedAt = new Date().toISOString();
    report.resolvedBy = 'community'; // Multiple resolvers
    
    // Show notification
    alert(getTranslation('report-resolved'));
  } else {
    // Show notification about the vote
    alert(getTranslation('resolution-vote-recorded')
      .replace('{current}', report.resolutionVotes.length)
      .replace('{required}', config.requiredResolutions));
  }
  
  // Update the report
  reports[reportIndex] = report;
  
  // Save to localStorage
  localStorage.setItem('reports', JSON.stringify(reports));
  
  // Update reportsData
  reportsData = reports;
  
  // Broadcast the vote to other nodes
  if (config.enableP2P && window.p2pChannel) {
    window.p2pChannel.postMessage({
      type: 'RESOLVE_VOTE',
      nodeId: nodeId,
      reportId: reportId
    });
  }
  
  // Refresh the map and list
  loadReports();
}
