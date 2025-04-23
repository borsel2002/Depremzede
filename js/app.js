// Main application logic
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the app
  initApp();
});

// Global variables
let currentPosition = null;
let isOnline = navigator.onLine;
let pendingReports = [];

// Initialize the application
function initApp() {
  // Set up event listeners
  setupEventListeners();
  
  // Initialize the map
  initMap();
  
  // Load reports from Firestore
  loadReports();
  
  // Set up language
  initLanguage();
  
  // Initialize Firebase Auth
  initAuth();
  
  // Check online status
  updateOnlineStatus();
  
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
    locationDescription: document.getElementById('location-description').value,
    numPeople: parseInt(document.getElementById('num-people').value),
    situation: document.getElementById('situation').value,
    contactInfo: document.getElementById('contact-info').value,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    status: 'unverified',
    latitude: currentPosition.latitude,
    longitude: currentPosition.longitude
  };
  
  // Check if we're online
  if (isOnline) {
    // Submit to Firestore
    db.collection('reports').add(reportData)
      .then(function(docRef) {
        console.log('Document written with ID: ', docRef.id);
        clearForm();
        closeModal();
        hideLoading();
        alert(getTranslation('report-success'));
        
        // Refresh reports
        loadReports();
      })
      .catch(function(error) {
        console.error('Error adding document: ', error);
        hideLoading();
        alert(getTranslation('report-error'));
      });
  } else {
    // Store locally for later submission
    reportData.id = 'pending-' + Date.now();
    pendingReports.push(reportData);
    localStorage.setItem('pendingReports', JSON.stringify(pendingReports));
    
    clearForm();
    closeModal();
    hideLoading();
    alert(getTranslation('report-offline'));
    
    // Add to map
    addMarkerToMap(reportData);
  }
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

// Initialize Firebase Auth
function initAuth() {
  // We're using anonymous auth for simplicity
  firebase.auth().signInAnonymously()
    .catch(function(error) {
      console.error('Auth error:', error);
    });
}

// Update online status
function updateOnlineStatus() {
  isOnline = navigator.onLine;
  const offlineNotification = document.querySelector('.offline-notification') || 
    createOfflineNotification();
  
  if (!isOnline) {
    offlineNotification.style.display = 'block';
    
    // Load pending reports from localStorage
    const storedReports = localStorage.getItem('pendingReports');
    if (storedReports) {
      pendingReports = JSON.parse(storedReports);
    }
  } else {
    offlineNotification.style.display = 'none';
    
    // Try to submit pending reports
    submitPendingReports();
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

// Submit pending reports when back online
function submitPendingReports() {
  if (pendingReports.length === 0) return;
  
  const reportsToSubmit = [...pendingReports];
  pendingReports = [];
  
  Promise.all(reportsToSubmit.map(report => {
    // Remove the temporary ID
    const { id, ...reportData } = report;
    return db.collection('reports').add(reportData);
  }))
  .then(() => {
    localStorage.removeItem('pendingReports');
    alert(getTranslation('pending-submitted'));
    loadReports();
  })
  .catch(error => {
    console.error('Error submitting pending reports:', error);
    // Put the reports back in the pending list
    pendingReports = [...pendingReports, ...reportsToSubmit];
    localStorage.setItem('pendingReports', JSON.stringify(pendingReports));
  });
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
