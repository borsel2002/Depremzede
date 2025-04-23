// Map handling functionality
let map;
let markers = [];
let userMarker = null;

// Initialize the main map
function initMap() {
  // Create map instance
  map = L.map('map').setView(config.defaultMapCenter, config.defaultZoom);
  
  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: config.maxZoom
  }).addTo(map);
  
  // Add scale control
  L.control.scale().addTo(map);
}

// Locate the user
function locateUser(callback) {
  if (!navigator.geolocation) {
    alert(getTranslation('geolocation-not-supported'));
    return;
  }
  
  showLoading();
  
  navigator.geolocation.getCurrentPosition(
    function(position) {
      currentPosition = position.coords;
      
      // Center the map on the user's location
      map.setView([position.coords.latitude, position.coords.longitude], 15);
      
      // Remove previous user marker if exists
      if (userMarker) {
        map.removeLayer(userMarker);
      }
      
      // Add a marker at the user's location
      userMarker = L.marker([position.coords.latitude, position.coords.longitude], {
        icon: L.divIcon({
          className: 'user-location-marker',
          html: '<div class="user-location-marker"></div>',
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        })
      }).addTo(map);
      
      userMarker.bindPopup(getTranslation('your-location')).openPopup();
      
      hideLoading();
      
      // Call the callback function if provided
      if (typeof callback === 'function') {
        callback();
      }
    },
    function(error) {
      console.error('Error getting location:', error);
      alert(getTranslation('geolocation-error'));
      hideLoading();
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

// Load reports from local storage
function loadReports() {
  // Clear existing markers
  clearMarkers();
  
  // Get reports from localStorage
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  
  // Add markers for each report
  reports.forEach(report => {
    addMarkerToMap(report);
  });
  
  // Apply filters
  applyFilters();
}

// Add a marker to the map
function addMarkerToMap(report) {
  // Skip if no coordinates
  if (!report.latitude || !report.longitude) return;
  
  // Create marker
  const marker = L.marker([report.latitude, report.longitude], {
    icon: L.divIcon({
      className: `${report.status}-marker`,
      html: `<div class="${report.status}-marker"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    })
  });
  
  // Create popup content
  let timestamp;
  if (report.timestamp) {
    if (typeof report.timestamp === 'string') {
      timestamp = new Date(report.timestamp);
    } else {
      timestamp = new Date();
    }
  } else {
    timestamp = new Date();
  }
  
  const timeString = timestamp.toLocaleString();
  
  const popupContent = `
    <div class="report-popup">
      <h3>${report.locationDescription}</h3>
      <p><strong>${getTranslation('people')}:</strong> ${report.numPeople}</p>
      <p><strong>${getTranslation('situation')}:</strong> ${report.situation}</p>
      <p><strong>${getTranslation('status')}:</strong> ${getTranslation(report.status)}</p>
      <p><strong>${getTranslation('reported')}:</strong> ${timeString}</p>
      ${report.contactInfo ? `<p><strong>${getTranslation('contact')}:</strong> ${report.contactInfo}</p>` : ''}
      <div class="popup-actions">
        <button class="btn btn-primary" onclick="navigateToLocation(${report.latitude}, ${report.longitude})">
          ${getTranslation('navigate')}
        </button>
        ${isRescueTeam() ? `
          <button class="btn" onclick="verifyReport('${report.id}')">
            ${getTranslation('verify')}
          </button>
          <button class="btn" onclick="resolveReport('${report.id}')">
            ${getTranslation('resolve')}
          </button>
        ` : ''}
      </div>
    </div>
  `;
  
  marker.bindPopup(popupContent);
  
  // Store the marker with its status
  markers.push({
    marker: marker,
    status: report.status
  });
  
  // Add to map
  marker.addTo(map);
}

// Clear all markers from the map
function clearMarkers() {
  markers.forEach(m => {
    map.removeLayer(m.marker);
  });
  markers = [];
}

// Update marker visibility based on filters
function updateMarkerVisibility(showVerified, showUnverified, showResolved) {
  markers.forEach(m => {
    if (
      (m.status === 'verified' && showVerified) ||
      (m.status === 'unverified' && showUnverified) ||
      (m.status === 'resolved' && showResolved)
    ) {
      if (!map.hasLayer(m.marker)) {
        map.addLayer(m.marker);
      }
    } else {
      if (map.hasLayer(m.marker)) {
        map.removeLayer(m.marker);
      }
    }
  });
}

// Navigate to location (open in maps app)
function navigateToLocation(lat, lng) {
  // Check if on mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    // Use appropriate maps URL scheme
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.open(`maps://maps.apple.com/?q=${lat},${lng}`);
    } else {
      window.open(`geo:${lat},${lng}`);
    }
  } else {
    // Use Google Maps on desktop
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
  }
}

// Check if user is part of rescue team (placeholder)
function isRescueTeam() {
  // This is a placeholder. In a real app, you would check user roles
  // For demo purposes, we'll return true to allow status updates
  return true;
}

// Verify report
function verifyReport(reportId) {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  const reportIndex = reports.findIndex(report => report.id === reportId);
  
  if (reportIndex !== -1) {
    reports[reportIndex].status = 'verified';
    localStorage.setItem('reports', JSON.stringify(reports));
    loadReports();
  }
}

// Resolve report
function resolveReport(reportId) {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  const reportIndex = reports.findIndex(report => report.id === reportId);
  
  if (reportIndex !== -1) {
    reports[reportIndex].status = 'resolved';
    localStorage.setItem('reports', JSON.stringify(reports));
    loadReports();
  }
}

// Apply filters
function applyFilters() {
  const showVerified = document.getElementById('show-verified').checked;
  const showUnverified = document.getElementById('show-unverified').checked;
  const showResolved = document.getElementById('show-resolved').checked;
  
  updateMarkerVisibility(showVerified, showUnverified, showResolved);
}
