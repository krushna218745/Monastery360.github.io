// Monastery360 - Digital Heritage Platform
// Interactive functionality for Sikkim's monasteries

// Global variables
let map;
let panoramaViewer;
let currentLanguage = 'en';
let isAudioPlaying = false;
let currentTrack = 0;

// Monastery data
const monasteries = {
  rumtek: {
    name: 'Rumtek Monastery',
    coordinates: [27.3389, 88.6065],
    sect: 'Kagyu',
    founded: '1966',
    altitude: '1,550m',
    description: 'Built in the 1960s, Rumtek is the largest monastery in Sikkim and serves as the seat of the Karmapa.',
    panorama: 'assets/monastery1.jpg',
    category: 'kagyu'
  },
  pemayangtse: {
    name: 'Pemayangtse Monastery',
    coordinates: [27.2051, 88.2468],
    sect: 'Nyingma',
    founded: '1705',
    altitude: '2,085m',
    description: 'One of the oldest and most important monasteries in Sikkim, meaning "Perfect Sublime Lotus".',
    panorama: 'assets/monastery2.jpg',
    category: 'nyingma'
  },
  tashiding: {
    name: 'Tashiding Monastery',
    coordinates: [27.1833, 88.2667],
    sect: 'Nyingma',
    founded: '1717',
    altitude: '1,465m',
    description: 'Located on a hilltop, this monastery is considered one of the most sacred in Sikkim.',
    panorama: 'assets/monastery1.jpg',
    category: 'nyingma'
  },
  enchey: {
    name: 'Enchey Monastery',
    coordinates: [27.3314, 88.6138],
    sect: 'Gelug',
    founded: '1909',
    altitude: '1,575m',
    description: 'A small but significant monastery located on a hilltop above Gangtok.',
    panorama: 'assets/monastery2.jpg',
    category: 'gelug'
  }
};

// Audio tracks data
const audioTracks = [
  {
    id: 'intro',
    title: 'Introduction & History',
    description: 'Learn about the monastery\'s founding and historical significance',
    duration: '5:23'
  },
  {
    id: 'architecture',
    title: 'Architecture & Design',
    description: 'Explore the unique architectural features and artistic elements',
    duration: '4:15'
  },
  {
    id: 'rituals',
    title: 'Daily Rituals & Practices',
    description: 'Discover the daily life and spiritual practices of the monks',
    duration: '6:42'
  }
];

// Translations
const translations = {
  en: {
    welcome: 'Discover Sikkim\'s Sacred Heritage',
    subtitle: 'Explore over 200 monasteries through immersive virtual tours, interactive maps, and rich digital archives'
  },
  hi: {
    welcome: 'सिक्किम की पवित्र विरासत की खोज करें',
    subtitle: 'इमर्सिव वर्चुअल टूर, इंटरैक्टिव मैप्स और समृद्ध डिजिटल अभिलेखागार के माध्यम से 200+ मठों का अन्वेषण करें'
  },
  ne: {
    welcome: 'सिक्किमको पवित्र सम्पदाको खोज गर्नुहोस्',
    subtitle: 'इमर्सिभ भर्चुअल टुर, अन्तरक्रियात्मक नक्सा र समृद्ध डिजिटल अभिलेखहरू मार्फत २००+ गुम्बाहरूको अन्वेषण गर्नुहोस्'
  },
  bh: {
    welcome: 'འབྲས་ལྗོངས་ཀྱི་དམ་པའི་རིག་གཞུང་རྙེད་པ།',
    subtitle: 'དགོན་པ་ ༢༠༠ ལྷག་ཙམ་ལ་ ཐད་ཀར་ལྟ་སྐོར་དང་། ཕན་ཚུན་འབྲེལ་བའི་ས་ཁྲ། ཕྱུག་པོའི་གློག་རིག་དེབ་མཛོད་བརྒྱུད་ནས་ཞིབ་འཇུག་གནང་།'
  }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  initializePanoramaViewer();
  initializeMap();
  initializeAudioGuide();
  initializeCalendar();
  initializeLanguageSelector();
  initializeArchiveSearch();
});

// Navigation functionality
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.content-section');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all links and sections
      navLinks.forEach(l => l.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      
      // Add active class to clicked link
      link.classList.add('active');
      
      // Show corresponding section
      const sectionId = link.getAttribute('data-section') + '-section';
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.classList.add('active');
        
        // Initialize section-specific functionality
        if (sectionId === 'map-section') {
          setTimeout(() => map.invalidateSize(), 100);
        }
      }
    });
  });
}

// Panorama viewer initialization
function initializePanoramaViewer() {
  const viewerElement = document.getElementById('viewer');
  if (viewerElement) {
    panoramaViewer = pannellum.viewer('viewer', {
      type: 'equirectangular',
      panorama: 'assets/monastery1.jpg',
      autoLoad: true,
      showControls: true,
      showFullscreenCtrl: true,
      showZoomCtrl: true,
      mouseZoom: true,
      keyboardZoom: true,
      hotSpots: [
        {
          pitch: 14.1,
          yaw: 1.5,
          type: 'info',
          text: 'Main Prayer Hall - The heart of monastery activities where monks gather for daily prayers.',
          URL: '#'
        },
        {
          pitch: -9.4,
          yaw: 222.6,
          type: 'info',
          text: 'Ancient Murals - These 300-year-old paintings depict the life of Buddha.',
          URL: '#'
        }
      ]
    });
  }

  // Monastery selector
  const monasterySelect = document.getElementById('monasterySelect');
  if (monasterySelect) {
    monasterySelect.addEventListener('change', function() {
      const selectedMonastery = monasteries[this.value];
      if (selectedMonastery && panoramaViewer) {
        panoramaViewer.loadScene(selectedMonastery.panorama);
        updateMonasteryInfo(selectedMonastery);
      }
    });
  }

  // Audio toggle
  const audioToggle = document.getElementById('audioToggle');
  if (audioToggle) {
    audioToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      // Audio guide integration would go here
    });
  }

  // Info hotspots toggle
  const infoToggle = document.getElementById('infoToggle');
  if (infoToggle) {
    infoToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      // Toggle hotspot visibility
    });
  }
}

// Update monastery information display
function updateMonasteryInfo(monastery) {
  const infoElement = document.getElementById('monasteryInfo');
  if (infoElement) {
    infoElement.innerHTML = `
      <h3>${monastery.name}</h3>
      <p>${monastery.description}</p>
      <div class="monastery-meta">
        <span><i class="fas fa-calendar"></i> Founded: ${monastery.founded}</span>
        <span><i class="fas fa-users"></i> Sect: ${monastery.sect}</span>
        <span><i class="fas fa-mountain"></i> Altitude: ${monastery.altitude}</span>
      </div>
    `;
  }
}

// Map initialization
function initializeMap() {
  const mapElement = document.getElementById('map');
  if (mapElement) {
    map = L.map('map').setView([27.3389, 88.6065], 9);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add monastery markers
    Object.keys(monasteries).forEach(key => {
      const monastery = monasteries[key];
      const markerColor = getMarkerColor(monastery.category);
      
      const marker = L.circleMarker(monastery.coordinates, {
        color: markerColor,
        fillColor: markerColor,
        fillOpacity: 0.8,
        radius: 8
      }).addTo(map);

      marker.bindPopup(`
        <div class="popup-content">
          <h4>${monastery.name}</h4>
          <p><strong>Sect:</strong> ${monastery.sect}</p>
          <p><strong>Founded:</strong> ${monastery.founded}</p>
          <p>${monastery.description}</p>
          <button onclick="loadMonasteryTour('${key}')" class="popup-btn">
            <i class="fas fa-vr-cardboard"></i> Virtual Tour
          </button>
        </div>
      `);
    });

    // Filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        filterMonasteries(filter);
      });
    });
  }
}

// Get marker color based on monastery category
function getMarkerColor(category) {
  const colors = {
    kagyu: '#e74c3c',
    nyingma: '#3498db',
    gelug: '#f39c12'
  };
  return colors[category] || '#95a5a6';
}

// Filter monasteries on map
function filterMonasteries(filter) {
  // This would filter the visible markers based on the selected category
  console.log('Filtering monasteries by:', filter);
}

// Load monastery tour from map
function loadMonasteryTour(monasteryKey) {
  // Switch to tours section
  document.querySelector('[data-section="tours"]').click();
  
  // Update monastery selector
  const monasterySelect = document.getElementById('monasterySelect');
  if (monasterySelect) {
    monasterySelect.value = monasteryKey;
    monasterySelect.dispatchEvent(new Event('change'));
  }
}

// Audio guide initialization
function initializeAudioGuide() {
  // Simulate location detection
  setTimeout(() => {
    const locationElement = document.getElementById('currentLocation');
    if (locationElement) {
      locationElement.textContent = 'Rumtek Monastery - Main Entrance';
    }
  }, 2000);

  // Play/pause functionality
  const playPauseBtn = document.getElementById('playPause');
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', function() {
      isAudioPlaying = !isAudioPlaying;
      const icon = this.querySelector('i');
      
      if (isAudioPlaying) {
        icon.className = 'fas fa-pause';
        simulateAudioProgress();
      } else {
        icon.className = 'fas fa-play';
      }
    });
  }

  // Track selection
  const trackItems = document.querySelectorAll('.track-item');
  trackItems.forEach((item, index) => {
    item.addEventListener('click', function() {
      trackItems.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      currentTrack = index;
      updateTrackInfo(audioTracks[index]);
    });
  });

  // Offline mode
  const offlineBtn = document.getElementById('offlineMode');
  if (offlineBtn) {
    offlineBtn.addEventListener('click', function() {
      this.innerHTML = '<i class="fas fa-check"></i> Content Downloaded';
      this.style.background = '#28a745';
    });
  }
}

// Update track information
function updateTrackInfo(track) {
  const titleElement = document.getElementById('trackTitle');
  const descElement = document.getElementById('trackDescription');
  const totalTimeElement = document.getElementById('totalTime');
  
  if (titleElement) titleElement.textContent = track.title;
  if (descElement) descElement.textContent = track.description;
  if (totalTimeElement) totalTimeElement.textContent = track.duration;
}

// Simulate audio progress
function simulateAudioProgress() {
  const progressBar = document.getElementById('audioProgress');
  const currentTimeElement = document.getElementById('currentTime');
  
  let progress = 0;
  const interval = setInterval(() => {
    if (!isAudioPlaying) {
      clearInterval(interval);
      return;
    }
    
    progress += 1;
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
    
    if (currentTimeElement) {
      const minutes = Math.floor(progress * 5.23 / 100 / 60);
      const seconds = Math.floor((progress * 5.23 / 100) % 60);
      currentTimeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    if (progress >= 100) {
      clearInterval(interval);
      isAudioPlaying = false;
      document.getElementById('playPause').querySelector('i').className = 'fas fa-play';
    }
  }, 100);
}

// Calendar initialization
function initializeCalendar() {
  const currentDate = new Date();
  updateCalendarDisplay(currentDate);
  
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      updateCalendarDisplay(currentDate);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      updateCalendarDisplay(currentDate);
    });
  }
}

// Update calendar display
function updateCalendarDisplay(date) {
  const monthElement = document.getElementById('currentMonth');
  const calendarGrid = document.querySelector('.calendar-grid');
  
  if (monthElement) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    monthElement.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  }
  
  if (calendarGrid) {
    // Clear existing days (keep headers)
    const existingDays = calendarGrid.querySelectorAll('.calendar-day:not(.header)');
    existingDays.forEach(day => day.remove());
    
    // Generate calendar days
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    for (let i = 0; i < 42; i++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day';
      
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + i);
      
      dayElement.textContent = currentDay.getDate();
      
      if (currentDay.getMonth() !== date.getMonth()) {
        dayElement.style.opacity = '0.3';
      }
      
      // Add event indicators (sample events)
      if (currentDay.getDate() === 15 && currentDay.getMonth() === date.getMonth()) {
        dayElement.style.background = '#764ba2';
        dayElement.style.color = 'white';
        dayElement.title = 'Losar Festival';
      }
      
      calendarGrid.appendChild(dayElement);
    }
  }
}

// Language selector
function initializeLanguageSelector() {
  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.addEventListener('change', function() {
      currentLanguage = this.value;
      updateLanguage();
    });
  }
}

// Update language content
function updateLanguage() {
  const heroTitle = document.querySelector('.hero h1');
  const heroSubtitle = document.querySelector('.hero p');
  
  if (heroTitle && translations[currentLanguage]) {
    heroTitle.textContent = translations[currentLanguage].welcome;
  }
  
  if (heroSubtitle && translations[currentLanguage]) {
    heroSubtitle.textContent = translations[currentLanguage].subtitle;
  }
}

// Archive search functionality
function initializeArchiveSearch() {
  const searchInput = document.getElementById('archiveSearch');
  const searchBtn = document.querySelector('.search-btn');
  const categoryFilter = document.getElementById('categoryFilter');
  const monasteryFilter = document.getElementById('monasteryFilter');
  
  if (searchBtn) {
    searchBtn.addEventListener('click', performArchiveSearch);
  }
  
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performArchiveSearch();
      }
    });
  }
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', performArchiveSearch);
  }
  
  if (monasteryFilter) {
    monasteryFilter.addEventListener('change', performArchiveSearch);
  }
}

// Perform archive search
function performArchiveSearch() {
  const searchTerm = document.getElementById('archiveSearch').value;
  const category = document.getElementById('categoryFilter').value;
  const monastery = document.getElementById('monasteryFilter').value;
  
  console.log('Searching archives:', { searchTerm, category, monastery });
  
  // Here you would implement the actual search functionality
  // For now, we'll just log the search parameters
}

// Utility functions
function showNotification(message, type = 'info') {
  // Create and show notification
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Export functions for global access
window.loadMonasteryTour = loadMonasteryTour;

// Entry Emphasis Overlay logic
(function initEntryEmphasis() {
  const overlay = document.getElementById('entry-emphasis');
  if (!overlay) return;

  const hideOverlay = () => {
    if (!overlay || overlay.classList.contains('is-hidden')) return;
    overlay.classList.add('is-hidden');
    // Remove from DOM after transition to avoid intercepting clicks
    setTimeout(() => overlay.remove(), 600);
    window.removeEventListener('keydown', onKeyDown);
    overlay.removeEventListener('click', onClick);
  };

  const onClick = () => hideOverlay();
  const onKeyDown = (e) => {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') hideOverlay();
  };

  // Auto-dismiss after 2.2s
  const autoTimer = setTimeout(hideOverlay, 2200);

  overlay.addEventListener('click', onClick);
  window.addEventListener('keydown', onKeyDown);

  // In case the image takes time to load, ensure it's visible immediately
  requestAnimationFrame(() => overlay.classList.remove('is-hidden'));
})();
