// Map related functionality
let map;
let markers = [];
let markerLayer;
let currentLocationMarker;
let tileLayer;
let activeTileSourceIndex = 0;

// Initialize the map
function initMap() {
  // Create the map
  map = L.map('map').setView(config.defaultMapCenter, config.defaultZoom);
  
  // Add the tile layer with fallback support
  addTileLayer();
  
  // Add marker layer
  markerLayer = L.layerGroup().addTo(map);
  
  // Try to locate the user
  locateUser();
  
  // Add event listeners
  map.on('click', onMapClick);
}

// Add tile layer with support for multiple sources
function addTileLayer() {
  // Remove existing tile layer if it exists
  if (tileLayer) {
    map.removeLayer(tileLayer);
  }
  
  // Get the current tile source
  const tileSource = config.mapTileSources[activeTileSourceIndex];
  
  // Add the tile layer
  tileLayer = L.tileLayer(tileSource.url, {
    maxZoom: config.maxZoom,
    attribution: tileSource.attribution
  }).addTo(map);
  
  // Set up error handling to switch to alternate source if tiles fail to load
  tileLayer.on('tileerror', function(error) {
    console.warn('Tile error, switching to alternate source', error);
    switchToAlternateTileSource();
  });
}

// Switch to an alternate tile source
function switchToAlternateTileSource() {
  // Increment the index and wrap around if needed
  activeTileSourceIndex = (activeTileSourceIndex + 1) % config.mapTileSources.length;
  
  // Add the new tile layer
  addTileLayer();
}

// Locate the user
function locateUser(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        // Store the position
        currentPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        
        // Set the map view
        map.setView([currentPosition.latitude, currentPosition.longitude], 15);
        
        // Add a marker for the user's location
        addUserLocationMarker();
        
        // Call the callback if provided
        if (callback && typeof callback === 'function') {
          callback();
        }
      },
      function(error) {
        console.error('Error getting location:', error);
        alert(getTranslation('location-error'));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  } else {
    alert(getTranslation('geolocation-not-supported'));
  }
}

// Add a marker for the user's location
function addUserLocationMarker() {
  // Remove existing marker if any
  if (currentLocationMarker) {
    map.removeLayer(currentLocationMarker);
  }
  
  // Create a new marker
  currentLocationMarker = L.marker([currentPosition.latitude, currentPosition.longitude], {
    icon: L.divIcon({
      className: 'user-location-marker',
      html: '<div class="pulse"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    })
  }).addTo(map);
  
  // Add a popup
  currentLocationMarker.bindPopup(getTranslation('your-location')).openPopup();
}

// Handle map click
function onMapClick(e) {
  // Store the position
  currentPosition = {
    latitude: e.latlng.lat,
    longitude: e.latlng.lng
  };
  
  // Update the user location marker
  addUserLocationMarker();
}

// Add a marker to the map for a report
function addMarkerToMap(report) {
  // Create marker
  const marker = L.marker([report.latitude, report.longitude], {
    icon: getMarkerIcon(report.status)
  });
  
  // Add popup
  marker.bindPopup(createPopupContent(report));
  
  // Add to marker layer
  marker.addTo(markerLayer);
  
  // Store the marker with the report ID
  markers.push({
    id: report.id,
    marker: marker,
    status: report.status
  });
  
  return marker;
}

// Get marker icon based on status
function getMarkerIcon(status) {
  let className = 'report-marker';
  
  switch (status) {
    case 'verified':
      className += ' verified';
      break;
    case 'resolved':
      className += ' resolved';
      break;
    default:
      className += ' unverified';
  }
  
  return L.divIcon({
    className: className,
    html: '<div class="marker-inner"></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
}

// Create popup content for a report
function createPopupContent(report) {
  // Format the date
  const date = new Date(report.timestamp);
  const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  
  // Create the content
  let content = `
    <div class="report-popup">
      <h3>${getTranslation('report')}</h3>
      <p><strong>${getTranslation('location')}:</strong> ${report.locationDescription}</p>
      <p><strong>${getTranslation('people')}:</strong> ${report.numPeople}</p>
      <p><strong>${getTranslation('situation')}:</strong> ${report.situation}</p>
      <p><strong>${getTranslation('contact')}:</strong> ${report.contactInfo}</p>
      <p><strong>${getTranslation('time')}:</strong> ${formattedDate}</p>
      <p><strong>${getTranslation('status')}:</strong> <span class="status-${report.status}">${getTranslation(report.status)}</span></p>
  `;
  
  // Add action buttons based on status
  if (report.status === 'unverified') {
    content += `<button class="verify-button" onclick="verifyReport('${report.id}')">${getTranslation('verify')}</button>`;
  }
  
  if (report.status !== 'resolved') {
    content += `<button class="resolve-button" onclick="resolveReport('${report.id}')">${getTranslation('resolve')}</button>`;
  }
  
  content += '</div>';
  
  return content;
}

// Clear all markers from the map
function clearMarkers() {
  // Clear the marker layer
  markerLayer.clearLayers();
  
  // Clear the markers array
  markers = [];
}

// Update marker visibility based on filters
function updateMarkerVisibility(showVerified, showUnverified, showResolved) {
  // Clear the marker layer
  markerLayer.clearLayers();
  
  // Add markers based on filters
  markers.forEach(markerObj => {
    const shouldShow = 
      (markerObj.status === 'verified' && showVerified) ||
      (markerObj.status === 'unverified' && showUnverified) ||
      (markerObj.status === 'resolved' && showResolved);
    
    if (shouldShow) {
      markerObj.marker.addTo(markerLayer);
    }
  });
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
