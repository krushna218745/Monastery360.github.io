// Monastery360 - Digital Heritage Platform
// Interactive functionality for Sikkim's monasteries

// Typewriter Effect
class TypewriterEffect {
  constructor(element, words, typeSpeed = 100, deleteSpeed = 50, delayBetweenWords = 2000) {
    this.element = element;
    this.words = words;
    this.typeSpeed = typeSpeed;
    this.deleteSpeed = deleteSpeed;
    this.delayBetweenWords = delayBetweenWords;
    this.currentWordIndex = 0;
    this.currentText = '';
    this.isDeleting = false;
    this.start();
  }

  start() {
    this.type();
  }

  type() {
    const currentWord = this.words[this.currentWordIndex];
    
    if (this.isDeleting) {
      this.currentText = currentWord.substring(0, this.currentText.length - 1);
    } else {
      this.currentText = currentWord.substring(0, this.currentText.length + 1);
    }

    this.element.textContent = this.currentText;

    let typeSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

    if (!this.isDeleting && this.currentText === currentWord) {
      typeSpeed = this.delayBetweenWords;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentText === '') {
      this.isDeleting = false;
      this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Global variables
let map;
let panoramaViewer;
let currentLanguage = 'en';
let isAudioPlaying = false;
let currentTrack = 0;
let isMobile = false;
let isTablet = false;

// Monastery data
const monasteries = {
  dubdi: {
    name: 'Dubdi Monastery',
    coordinates: [27.2833, 88.2167],
    sect: 'Nyingma',
    founded: '1701',
    altitude: '2,100m',
    description: 'Dubdi Monastery, established in 1701, is the oldest monastery in Sikkim and a vital center of Nyingma Buddhism. Nestled near Yuksom, it stands as a serene spiritual retreat with beautifully preserved traditional architecture. Recognized as a national monument, Dubdi offers visitors a glimpse into Sikkim\'s rich religious heritage and monastic traditions. Its tranquil surroundings and historical significance make it a must-visit for those interested in culture, spirituality, and history.',
    panorama: 'assets/Dubdi.webp',
    audioGuide: 'assets/Dubdi/Dubdi_Introduction.mp3',
    panoramic360: 'https://www.google.com/maps/embed?pb=!4v1757773596089!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ0VfNWJDZlE.!2m2!1d27.36641022759916!2d88.22990891649984!3f27.63949162718211!4f11.41781632099162!5f0.7820865974627469',
    category: 'nyingma'
  },
  enchey: {
    name: 'Enchey Monastery',
    coordinates: [27.3314, 88.6138],
    sect: 'Nyingma',
    founded: '1840',
    altitude: '1,575m',
    description: 'Enchey Monastery, perched northeast of Gangtok, is a revered spiritual center of the Nyingma sect of Vajrayana Buddhism. Founded in 1840 by Lama Drupthob Karpo, the monastery offers a peaceful retreat surrounded by lush forests and stunning mountain views.',
    panorama: 'assets/Enchey.webp',
    audioGuide: 'assets/Enchey/Enchey_Introduction.mp3',
    panoramic360: 'https://www.google.com/maps/embed?pb=!4v1757780784142!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ0pzTXEzOWdF!2m2!1d27.33593677395685!2d88.61916587167339!3f75.00290885330486!4f8.289505924548877!5f0.7820865974627469',
    category: 'nyingma'
  },
  rumtek: {
    name: 'Rumtek Monastery',
    coordinates: [27.3389, 88.6065],
    sect: 'Kagyu',
    founded: '1966',
    altitude: '1,550m',
    description: 'Rumtek Monastery, located 23 km from Gangtok, is the principal seat of the 16th Gyalwa Karmapa of the Karma Kagyu lineage. Modeled as a replica of Tibet\'s Tsurpu Monastery, it showcases exquisite murals, intricate thankas, and a revered statue of Sakyamuni Buddha. The monastery serves as an important center for Buddhist practice and culture in Sikkim. Nearby, the old Rumtek Monastery lies a 15-minute walk downhill, adding historical depth to the visit.',
    panorama: 'assets/Rumtek.webp',
    audioGuide: 'assets/Rumtek/Rumtek_Introduction.mp3',
    panoramic360: 'https://www.google.com/maps/embed?pb=!4v1757780882207!6m8!1m7!1sCAoSF0NJSE0wb2dMRUlDQWdJRDJnWVdjb2dF!2m2!1d27.2885258949387!2d88.56180959787903!3f281.61343009982346!4f-1.6305831096637462!5f0.7820865974627469',
    category: 'kagyu'
  },
  pemayangtse: {
    name: 'Pemayangtse Monastery',
    coordinates: [27.2051, 88.2468],
    sect: 'Nyingma',
    founded: '1705',
    altitude: '2,085m',
    description: 'Pemayangtse Monastery, founded in 1705 near Pelling in West Sikkim, is one of the state\'s oldest and most revered monasteries of the Nyingma sect of Tibetan Buddhism. Perched at 2,085 meters with stunning views of Kanchenjunga, it is renowned for its intricate murals, ancient scriptures, and the remarkable wooden model of Guru Padmasambhava\'s celestial palace, Zangdok Palri. A center of spiritual practice and the famous Cham mask dance festival, Pemayangtse remains a vital symbol of Sikkim\'s rich Buddhist heritage.',
    panorama: 'assets/Pemayangtse.jpeg',
    audioGuide: 'assets/Pemayangtse/Pemayangtse_Introduction.mp3',
    panoramic360: 'https://www.google.com/maps/embed?pb=!4v1757780966373!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJREVoSlhucEFF!2m2!1d27.30518919282202!2d88.25156580066201!3f183.22402648883244!4f20.07143951183467!5f0.4000000000000002',
    category: 'nyingma'
  },
  phodong: {
    name: 'Phodong Monastery',
    coordinates: [27.4167, 88.5833],
    sect: 'Kagyu',
    founded: '1721',
    altitude: '1,300m',
    description: 'Phodong Monastery, located in North Sikkim about 28 km from Gangtok, is an important center of the Kagyu sect of Tibetan Buddhism. Built in the early 18th century by Chogyal Gyurmed Namgyal, it is known for its vibrant murals, ornate architecture, and serene surroundings. The monastery plays host to the annual Chaam festival, where monks perform sacred mask dances symbolizing the victory of good over evil. Overlooking the lush valleys and mountains, Phodong is not only a place of deep spiritual significance but also a cultural treasure that reflects Sikkim\'s Buddhist traditions.',
    panorama: 'assets/Phondong.jpg',
    audioGuide: 'assets/Phodong/Phodong_Introduction.mp3',
    panoramic360: 'https://www.google.com/maps/embed?pb=!4v1757781026313!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJREUtSTJBbXdF!2m2!1d27.41250043052966!2d88.58361050014649!3f347.6646480951512!4f-2.2862451613903403!5f0.7820865974627469',
    category: 'kagyu'
  }
};

// Audio tracks data with chapter timing (like YouTube chapters)
const audioTracks = [
  {
    id: 'intro',
    title: 'Introduction & History',
    description: 'Learn about the monastery\'s founding and historical significance',
    duration: '5:23',
    startTime: 0,
    endTime: 323, // 5:23 in seconds
    chapterTime: '0:00'
  },
  {
    id: 'architecture',
    title: 'Architecture & Design',
    description: 'Explore the unique architectural features and artistic elements',
    duration: '4:15',
    startTime: 323,
    endTime: 578, // 323 + 255 (4:15) seconds
    chapterTime: '5:23'
  },
  {
    id: 'rituals',
    title: 'Daily Rituals & Practices',
    description: 'Discover the daily life and spiritual practices of the monks',
    duration: '6:42',
    startTime: 578,
    endTime: 980, // 578 + 402 (6:42) seconds
    chapterTime: '9:38'
  }
];

// Festival data with dates
const festivals = [
  { name: 'Losar Festival', month: 11, day: 15, description: 'Tibetan New Year celebration' },
  { name: 'Winter Solstice Prayers', month: 11, day: 22, description: 'Special prayers and rituals' },
  { name: 'Saga Dawa', month: 4, day: 15, description: 'Buddha\'s birth, enlightenment, and parinirvana' },
  { name: 'Monlam Chenmo', month: 0, day: 15, description: 'Great Prayer Festival' },
  { name: 'Chotrul Duchen', month: 1, day: 15, description: 'Miracles of Buddha Festival' },
  { name: 'Saka Dawa', month: 3, day: 15, description: 'Buddha\'s birth and enlightenment' },
  { name: 'Drukpa Tsezhi', month: 5, day: 10, description: 'Buddha\'s first teaching' },
  { name: 'Chokhor Duchen', month: 6, day: 4, description: 'Buddha\'s first teaching anniversary' },
  { name: 'Lhabab Duchen', month: 8, day: 22, description: 'Buddha\'s descent from heaven' },
  { name: 'Ganden Ngamchoe', month: 9, day: 25, description: 'Tsongkhapa\'s passing' },
  { name: 'Lha Bab Duchen', month: 10, day: 9, description: 'Buddha\'s descent from Tushita' },
  { name: 'Guru Rinpoche Day', month: 5, day: 10, description: 'Padmasambhava\'s birthday' },
  { name: 'Medicine Buddha Day', month: 7, day: 8, description: 'Healing and medicine practices' },
  { name: 'Avalokiteshvara Day', month: 2, day: 15, description: 'Compassion and loving-kindness' },
  { name: 'Manjushri Day', month: 11, day: 10, description: 'Wisdom and learning celebration' }
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
  detectDevice();
  initializeNavigation();
  initializeHamburgerMenu();
  initializePanoramaViewer();
  initializeMap();
  initializeAudioGuide();
  initializeCalendar();
  initializeLanguageSelector();
  initializeArchiveSearch();
  initializeScrollToTop();
  initializeScrollReveal();
  initialize360PanoramicModal();
  handleResize();
});

// Device Detection
function detectDevice() {
  const userAgent = navigator.userAgent;
  const screenWidth = window.innerWidth;
  
  // Detect mobile devices
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || screenWidth <= 768;
  
  // Detect tablets
  isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent) || (screenWidth > 768 && screenWidth <= 1024);
  
  // Add device class to body
  document.body.classList.add(isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop');
  
  console.log('Device detected:', { isMobile, isTablet, screenWidth });
}

// Handle window resize
function handleResize() {
  window.addEventListener('resize', () => {
    const newScreenWidth = window.innerWidth;
    const wasMobile = isMobile;
    
    detectDevice();
    
    // Close mobile menu if switching from mobile to desktop
    if (wasMobile && !isMobile) {
      closeMobileMenu();
    }
    
    // Reinitialize map if needed
    if (map && newScreenWidth > 768) {
      setTimeout(() => map.invalidateSize(), 100);
    }
  });
}

// Hamburger Menu functionality
function initializeHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      toggleMobileMenu();
    });
    
    // Close menu when clicking on nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (isMobile) {
          closeMobileMenu();
        }
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (isMobile && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }
}

function toggleMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}

function closeMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Navigation functionality
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.content-section');
  const dots = document.querySelectorAll('.dot');

  // Handle navigation link clicks
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const sectionId = link.getAttribute('data-section') + '-section';
      const targetSection = document.getElementById(sectionId);
      
      if (targetSection) {
        targetSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        
        // Initialize section-specific functionality
        if (sectionId === 'map-section') {
          setTimeout(() => map.invalidateSize(), 100);
        }
      }
    });
  });

  // Handle dot clicks
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const sectionId = dot.getAttribute('data-section') + '-section';
      const targetSection = document.getElementById(sectionId);
      
      if (targetSection) {
        targetSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Handle scroll-based active section detection
  window.addEventListener('scroll', () => {
    updateActiveSection();
    updateProgressBar();
  });
}

// Update active section based on scroll position
function updateActiveSection() {
  const sections = document.querySelectorAll('.content-section');
  const navLinks = document.querySelectorAll('.nav-link');
  const dots = document.querySelectorAll('.dot');
  
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;
    const scrollTop = window.pageYOffset;
    
    if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
      currentSection = section.id;
    }
  });
  
  // Update active states
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-section') + '-section' === currentSection) {
      link.classList.add('active');
    }
  });
  
  dots.forEach(dot => {
    dot.classList.remove('active');
    if (dot.getAttribute('data-section') + '-section' === currentSection) {
      dot.classList.add('active');
    }
  });
}

// Update progress bar based on scroll position
function updateProgressBar() {
  const progressBar = document.getElementById('progressBar');
  if (!progressBar) return;
  
  const scrollTop = window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  
  progressBar.style.height = scrollPercent + '%';
}

// Panorama viewer initialization
function initializePanoramaViewer() {
  const viewerElement = document.getElementById('viewer');
  if (viewerElement) {
    // Adjust panorama settings based on device
    const panoramaConfig = {
      type: 'equirectangular',
      panorama: 'assets/monastery1.jpg',
      autoLoad: true,
      showControls: !isMobile, // Hide controls on mobile for cleaner look
      showFullscreenCtrl: true,
      showZoomCtrl: !isMobile,
      mouseZoom: !isMobile, // Disable mouse zoom on mobile
      keyboardZoom: !isMobile,
      touchPanSpeed: isMobile ? 2 : 1, // Faster touch pan on mobile
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
    };
    
    panoramaViewer = pannellum.viewer('viewer', panoramaConfig);
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
      
      // Synchronize with audio guide section
      const audioMonasterySelect = document.getElementById('audioMonasterySelect');
      if (audioMonasterySelect) {
        audioMonasterySelect.value = this.value;
        updateAudioGuideInfo(selectedMonastery);
      }
    });
  }
  
  // Audio monastery selector
  const audioMonasterySelect = document.getElementById('audioMonasterySelect');
  if (audioMonasterySelect) {
    audioMonasterySelect.addEventListener('change', function() {
      const selectedMonastery = monasteries[this.value];
      if (selectedMonastery) {
        updateAudioGuideInfo(selectedMonastery);
      }
      
      // Synchronize with virtual tour section
      const monasterySelect = document.getElementById('monasterySelect');
      if (monasterySelect) {
        monasterySelect.value = this.value;
        updateMonasteryInfo(selectedMonastery);
        if (panoramaViewer) {
          panoramaViewer.loadScene(selectedMonastery.panorama);
        }
      }
    });
  }

  // Audio toggle - navigate to audio section
  const audioToggle = document.getElementById('audioToggle');
  if (audioToggle) {
    audioToggle.addEventListener('click', function() {
      // Navigate to audio guide section
      const audioSection = document.getElementById('audio-section');
      if (audioSection) {
        audioSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }
  
  // 360° Panoramic toggle - show modal
  const panoramicToggle = document.getElementById('panoramicToggle');
  if (panoramicToggle) {
    panoramicToggle.addEventListener('click', function() {
      const monasterySelect = document.getElementById('monasterySelect');
      const selectedMonasteryKey = monasterySelect ? monasterySelect.value : 'dubdi';
      const selectedMonastery = monasteries[selectedMonasteryKey];
      
      if (selectedMonastery) {
        show360PanoramicView(selectedMonastery);
      }
    });
  }
}

// Update monastery information display
function updateMonasteryInfo(monastery) {
  const infoElement = document.getElementById('monasteryInfo');
  const photoElement = document.getElementById('monasteryPhoto');
  
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
  
  if (photoElement) {
    photoElement.src = monastery.panorama;
    photoElement.alt = monastery.name;
  }
}

// Update audio guide information display
function updateAudioGuideInfo(monastery) {
  const trackTitleElement = document.getElementById('trackTitle');
  
  if (trackTitleElement) {
    trackTitleElement.textContent = `Welcome to ${monastery.name}`;
  }
}

// Show 360° panoramic view modal
function show360PanoramicView(monastery) {
  const modal = document.getElementById('panoramicModal');
  const modalTitle = document.getElementById('modalTitle');
  const panoramicFrame = document.getElementById('panoramicFrame');
  
  if (modal && modalTitle && panoramicFrame && monastery.panoramic360) {
    // Update modal title
    modalTitle.textContent = `360° Panoramic View - ${monastery.name}`;
    
    // Create and insert iframe
    panoramicFrame.innerHTML = `
      <iframe 
        src="${monastery.panoramic360}" 
        width="100%" 
        height="100%" 
        style="border:0;" 
        allowfullscreen="" 
        loading="lazy" 
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>
    `;
    
    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }
}

// Hide 360° panoramic view modal
function hide360PanoramicView() {
  const modal = document.getElementById('panoramicModal');
  const panoramicFrame = document.getElementById('panoramicFrame');
  
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = ''; // Restore background scrolling
    
    // Clear iframe to stop loading
    if (panoramicFrame) {
      panoramicFrame.innerHTML = '';
    }
  }
}

// Initialize 360° panoramic modal event listeners
function initialize360PanoramicModal() {
  const closeBtn = document.getElementById('closeModal');
  const modal = document.getElementById('panoramicModal');
  
  // Close button click
  if (closeBtn) {
    closeBtn.addEventListener('click', hide360PanoramicView);
  }
  
  // Click outside modal to close
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        hide360PanoramicView();
      }
    });
  }
  
  // Escape key to close
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      hide360PanoramicView();
    }
  });
}

// Map initialization
function initializeMap() {
  const mapElement = document.getElementById('map');
  if (mapElement) {
    // Adjust zoom level based on device
    const initialZoom = isMobile ? 8 : isTablet ? 9 : 10;
    
    map = L.map('map').setView([27.3389, 88.6065], initialZoom);
    
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
  // Scroll to tours section
  const toursSection = document.getElementById('tours-section');
  if (toursSection) {
    toursSection.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
  
  // Update monastery selector
  const monasterySelect = document.getElementById('monasterySelect');
  if (monasterySelect) {
    monasterySelect.value = monasteryKey;
    monasterySelect.dispatchEvent(new Event('change'));
  }
}

// Audio guide initialization with chapter navigation
function initializeAudioGuide() {
  const audioPlayer = document.getElementById('audioPlayer');
  const playPauseBtn = document.getElementById('playPause');
  const prevChapterBtn = document.getElementById('prevChapter');
  const nextChapterBtn = document.getElementById('nextChapter');
  const volumeToggleBtn = document.getElementById('volumeToggle');
  const audioSeek = document.getElementById('audioSeek');
  const progressBar = document.getElementById('audioProgress');
  const currentTimeSpan = document.getElementById('currentTime');
  const totalTimeSpan = document.getElementById('totalTime');
  const monasterySelect = document.getElementById('audioMonasterySelect');
  const currentChapterSpan = document.getElementById('currentChapter');
  
  let currentChapterIndex = 0;
  let isPlaying = false;
  let isMuted = false;
  let currentMonasteryKey = 'dubdi';
  let currentLanguage = 'en'; // Default language

  // Chapter definitions with individual audio files that play seamlessly
  const getChapters = (monasteryKey, language = 'en') => {
    // Map monastery keys to exact file names
    const monasteryNames = {
      'dubdi': 'Dubdi',
      'enchey': 'Enchey', 
      'rumtek': 'Rumtek',
      'pemayangtse': 'Pemayangtse',
      'phodong': 'Phodong'
    };
    
    // Language codes for file naming
    const languageCodes = {
      'en': '', // Default English, no suffix
      'hi': '_Hindi',
      'ne': '_Nepali'
    };
    
    const baseFileName = monasteryNames[monasteryKey] || 'Dubdi';
    const languageSuffix = languageCodes[language] || '';
    
    console.log(`Getting chapters for ${monasteryKey} in ${language} language`);
    console.log(`Base filename: ${baseFileName}, Language suffix: ${languageSuffix}`);
    
    // Check if monastery has audio files (all monasteries now have audio)
    const hasAudioFiles = ['dubdi', 'enchey', 'rumtek', 'pemayangtse', 'phodong'].includes(monasteryKey);
    
    if (!hasAudioFiles) {
      console.warn(`No audio files available for ${monasteryKey} monastery`);
      return [];
    }
    
    return [
      {
        id: 'intro',
        title: 'Introduction & History',
        audioFile: `assets/${baseFileName}/${baseFileName}_Introduction${languageSuffix}.mp3`,
        description: 'Learn about the monastery\'s founding and historical significance',
        duration: 0, // Will be fetched from actual audio file metadata
        startTime: 0 // Will be calculated based on previous chapters
      },
      {
        id: 'architecture',
        title: 'Architecture & Design', 
        audioFile: `assets/${baseFileName}/${baseFileName}_Architecture${languageSuffix}.mp3`,
        description: 'Explore the unique architectural features and artistic elements',
        duration: 0, // Will be fetched from actual audio file metadata
        startTime: 0
      },
      {
        id: 'rituals',
        title: 'Daily Rituals & Practices',
        audioFile: `assets/${baseFileName}/${baseFileName}_Rituals${languageSuffix}.mp3`,
        description: 'Discover the daily life and spiritual practices of the monks',
        duration: 0, // Will be fetched from actual audio file metadata
        startTime: 0
      }
    ];
  };

  let currentChapters = getChapters(currentMonasteryKey, currentLanguage);
  let totalDuration = 0;
  let virtualCurrentTime = 0; // Virtual time across all chapters
  let chapterStartTimes = []; // Cumulative start times for each chapter

  // Initialize seamless audio player
  function initializePlayer() {
    if (!audioPlayer) return;
    
    audioPlayer.addEventListener('loadedmetadata', () => {
      console.log('Chapter audio loaded:', currentChapters[currentChapterIndex].title, audioPlayer.duration + ' seconds');
      updateChapterDurations();
    });
    
    audioPlayer.addEventListener('timeupdate', () => {
      updateVirtualProgress();
    });
    
    audioPlayer.addEventListener('ended', () => {
      handleChapterEnd();
    });
    
    audioPlayer.addEventListener('error', (e) => {
      console.error('Audio error:', e);
    });
    
    // Load all chapter durations initially
    loadAllChapterDurations();
  }

  // Load durations of all chapters to calculate total duration
  async function loadAllChapterDurations() {
    console.log('Loading chapter durations for:', currentChapters.map(c => c.audioFile));
    
    const promises = currentChapters.map((chapter, index) => {
      return new Promise((resolve) => {
        const tempAudio = new Audio();
        
        tempAudio.addEventListener('loadedmetadata', () => {
          const duration = tempAudio.duration;
          currentChapters[index].duration = duration;
          console.log(`${chapter.title}: ${Math.floor(duration/60)}:${Math.floor(duration%60).toString().padStart(2, '0')} (${duration.toFixed(2)}s)`);
          resolve();
        });
        
        tempAudio.addEventListener('error', (e) => {
          console.error(`Error loading ${chapter.title} from ${chapter.audioFile}:`, e);
          currentChapters[index].duration = 60; // Default to 1 minute if failed
          resolve();
        });
        
        // Set timeout for loading
        setTimeout(() => {
          if (currentChapters[index].duration === 0) {
            console.warn(`Timeout loading ${chapter.title}, using default duration`);
            currentChapters[index].duration = 60; // Default to 1 minute
            resolve();
          }
        }, 5000); // 5 second timeout
        
        tempAudio.src = chapter.audioFile;
        tempAudio.load(); // Explicitly load the audio
      });
    });

    await Promise.all(promises);
    calculateChapterStartTimes();
    updateTotalTime();
    updateChapterTimesInUI();
    console.log('All chapter durations loaded:', currentChapters.map(c => `${c.title}: ${c.duration.toFixed(2)}s`));
  }

  // Calculate cumulative start times for each chapter
  function calculateChapterStartTimes() {
    let cumulativeTime = 0;
    chapterStartTimes = [];
    
    currentChapters.forEach((chapter, index) => {
      chapter.startTime = cumulativeTime;
      chapterStartTimes.push(cumulativeTime);
      cumulativeTime += chapter.duration;
    });
    
    totalDuration = cumulativeTime;
    console.log('Chapter start times:', chapterStartTimes);
    console.log('Total duration:', totalDuration);
  }

  // Update chapter durations after loading
  function updateChapterDurations() {
    if (audioPlayer && audioPlayer.duration) {
      currentChapters[currentChapterIndex].duration = audioPlayer.duration;
      calculateChapterStartTimes();
      updateTotalTime();
    }
  }

  // Play/pause functionality
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      } else {
        audioPlayer.play().then(() => {
          isPlaying = true;
          playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }).catch(error => {
          console.error('Error playing audio:', error);
        });
      }
    });
  }

  // Chapter navigation buttons
  if (prevChapterBtn) {
    prevChapterBtn.addEventListener('click', () => {
      const newIndex = Math.max(0, currentChapterIndex - 1);
      jumpToChapter(newIndex);
    });
  }
  
  if (nextChapterBtn) {
    nextChapterBtn.addEventListener('click', () => {
      const newIndex = Math.min(currentChapters.length - 1, currentChapterIndex + 1);
      jumpToChapter(newIndex);
    });
  }

  // Volume toggle
  if (volumeToggleBtn) {
    volumeToggleBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      audioPlayer.muted = isMuted;
      const icon = volumeToggleBtn.querySelector('i');
      icon.className = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    });
  }

  // Seek bar functionality (virtual timeline across all chapters)
  if (audioSeek) {
    audioSeek.addEventListener('input', function() {
      if (totalDuration > 0) {
        const seekVirtualTime = (this.value / 100) * totalDuration;
        seekToVirtualTime(seekVirtualTime);
      }
    });
    
    // Also listen for change event for better responsiveness
    audioSeek.addEventListener('change', function() {
      if (totalDuration > 0) {
        const seekVirtualTime = (this.value / 100) * totalDuration;
        seekToVirtualTime(seekVirtualTime);
      }
    });
  }

  // Seek to a virtual time across all chapters
  function seekToVirtualTime(targetTime) {
    console.log('Seeking to virtual time:', targetTime);
    
    // Find which chapter this time belongs to
    let targetChapterIndex = 0;
    for (let i = currentChapters.length - 1; i >= 0; i--) {
      if (targetTime >= currentChapters[i].startTime) {
        targetChapterIndex = i;
        break;
      }
    }
    
    const targetChapter = currentChapters[targetChapterIndex];
    const chapterTime = targetTime - targetChapter.startTime;
    
    console.log('Target chapter:', targetChapter.title, 'at time:', chapterTime);
    
    // If we need to switch to a different chapter
    if (targetChapterIndex !== currentChapterIndex) {
      currentChapterIndex = targetChapterIndex;
      loadChapterAudio(targetChapterIndex);
      
      // Update UI to reflect the new chapter
      updateActiveChapter();
      updateChapterDisplay();
      
      // Set the time after the audio loads
      audioPlayer.addEventListener('canplay', function setTimeAfterLoad() {
        if (chapterTime <= audioPlayer.duration) {
          audioPlayer.currentTime = chapterTime;
        }
        audioPlayer.removeEventListener('canplay', setTimeAfterLoad);
      });
    } else {
      // Same chapter, just seek within it
      if (chapterTime <= audioPlayer.duration) {
        audioPlayer.currentTime = chapterTime;
      }
      
      // Update UI even for same chapter to ensure highlighting is correct
      updateActiveChapter();
      updateChapterDisplay();
    }
  }

  // Monastery selection change
  if (monasterySelect) {
    monasterySelect.addEventListener('change', function() {
      currentMonasteryKey = this.value;
      loadMonasteryAudio();
    });
  }

  // Language selection change
  const languageSelect = document.getElementById('audioLanguageSelect');
  if (languageSelect) {
    languageSelect.addEventListener('change', function() {
      const newLanguage = this.value;
      console.log(`🌍 Language changed from ${currentLanguage} to ${newLanguage}`);
      
      currentLanguage = newLanguage;
      
      // Show the new chapter file paths for debugging
      const newChapters = getChapters(currentMonasteryKey, newLanguage);
      console.log('📁 New chapter files to load:');
      newChapters.forEach((chapter, index) => {
        console.log(`  ${index + 1}. ${chapter.title}: ${chapter.audioFile}`);
      });
      
      // Reload chapters with new language
      loadMonasteryAudio();
      
      // Update UI feedback
      const selectedOption = this.options[this.selectedIndex];
      console.log(`✅ Switched to: ${selectedOption.text}`);
    });
  }

  // Chapter item click handlers
  function initializeChapterItems() {
    const chapterItems = document.querySelectorAll('.chapter-item');
    console.log('Found chapter items:', chapterItems.length);
    
    chapterItems.forEach((item, index) => {
      // Remove any existing listeners
      item.replaceWith(item.cloneNode(true));
    });
    
    // Re-get the elements after cloning
    const newChapterItems = document.querySelectorAll('.chapter-item');
    newChapterItems.forEach((item, index) => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Chapter clicked:', index, currentChapters[index]?.title);
        jumpToChapter(index);
      });
      
      // Add hover effect
      item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(5px)';
      });
      
      item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
      });
      
      // Add cursor pointer
      item.style.cursor = 'pointer';
      
      console.log(`Chapter ${index} click handler added for:`, currentChapters[index]?.title);
    });
  }

  // Jump to specific chapter (load different audio file)
  function jumpToChapter(chapterIndex) {
    console.log('jumpToChapter called with index:', chapterIndex);
    console.log('Current chapters length:', currentChapters.length);
    console.log('Available chapters:', currentChapters.map(c => c.title));
    
    if (chapterIndex >= 0 && chapterIndex < currentChapters.length) {
      const chapter = currentChapters[chapterIndex];
      
      console.log('✅ Jumping to chapter:', chapter.title, 'File:', chapter.audioFile);
      
      // Update current chapter index
      currentChapterIndex = chapterIndex;
      
      // Load the new chapter audio file
      loadChapterAudio(chapterIndex);
      
      // Update UI
      updateActiveChapter();
      updateChapterDisplay();
      
      // Update progress bar to reflect new chapter position
      updateProgressForChapterJump();
      
      console.log('✅ Chapter UI updated and progress bar set to chapter start');
    } else {
      console.error('❌ Invalid chapter index:', chapterIndex, 'Available:', currentChapters.length);
    }
  }

  // Load specific chapter audio file
  function loadChapterAudio(chapterIndex) {
    console.log('loadChapterAudio called with index:', chapterIndex);
    
    const chapter = currentChapters[chapterIndex];
    const audioSource = document.getElementById('audioSource');
    
    console.log('Chapter to load:', chapter);
    console.log('Audio source element:', audioSource);
    console.log('Audio player element:', audioPlayer);
    
    if (audioSource && audioPlayer) {
      const wasPlaying = isPlaying;
      console.log('Was playing:', wasPlaying);
      
      // Stop current playback
      audioPlayer.pause();
      
      // Load new audio file
      console.log('Setting audio source to:', chapter.audioFile);
      audioSource.src = chapter.audioFile;
      audioPlayer.load();
      
      console.log('✅ Loading chapter audio:', chapter.audioFile);
      
      // Update progress bar when audio is ready
      audioPlayer.addEventListener('loadedmetadata', function updateProgressAfterLoad() {
        console.log('Chapter audio metadata loaded, updating progress bar');
        updateProgressForChapterJump();
        audioPlayer.removeEventListener('loadedmetadata', updateProgressAfterLoad);
      });
      
      // If audio was playing, resume after loading
      if (wasPlaying) {
        audioPlayer.addEventListener('canplay', function playAfterLoad() {
          console.log('Auto-resuming playback after chapter change');
          audioPlayer.play();
          isPlaying = true;
          if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
          audioPlayer.removeEventListener('canplay', playAfterLoad);
        });
      } else {
        isPlaying = false;
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      }
    } else {
      console.error('❌ Missing audio elements:', { audioSource, audioPlayer });
    }
  }

  // Handle when a chapter ends - auto-play next chapter
  function handleChapterEnd() {
    console.log('Chapter ended:', currentChapters[currentChapterIndex].title);
    
    if (currentChapterIndex < currentChapters.length - 1) {
      // Move to next chapter
      jumpToChapter(currentChapterIndex + 1);
      
      // Continue playing if was playing
      if (isPlaying) {
        audioPlayer.addEventListener('canplay', function autoPlayNext() {
          audioPlayer.play();
          audioPlayer.removeEventListener('canplay', autoPlayNext);
        });
      }
    } else {
      // End of all chapters
      isPlaying = false;
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      // Reset to first chapter
      jumpToChapter(0);
    }
  }

  // Update virtual progress across all chapters
  function updateVirtualProgress() {
    if (!audioPlayer || !audioPlayer.duration) return;
    
    // Calculate virtual current time (cumulative across all chapters)
    virtualCurrentTime = currentChapters[currentChapterIndex].startTime + audioPlayer.currentTime;
    
    // Calculate progress as percentage of total duration
    const virtualProgress = totalDuration > 0 ? (virtualCurrentTime / totalDuration) * 100 : 0;
    
    // Update progress bar and seek slider
    if (audioSeek) audioSeek.value = virtualProgress;
    if (progressBar) progressBar.style.width = virtualProgress + '%';
    
    // Update time displays
    updateCurrentTime();
    updateCurrentChapterDisplay();
  }

  // Update progress bar when jumping to a chapter (before audio starts playing)
  function updateProgressForChapterJump() {
    if (!currentChapters[currentChapterIndex] || totalDuration === 0) return;
    
    // Set virtual current time to the start of the selected chapter
    virtualCurrentTime = currentChapters[currentChapterIndex].startTime;
    
    // Calculate progress as percentage of total duration
    const virtualProgress = (virtualCurrentTime / totalDuration) * 100;
    
    // Update progress bar and seek slider immediately
    if (audioSeek) {
      audioSeek.value = virtualProgress;
      console.log('Progress slider updated to:', virtualProgress.toFixed(2) + '%');
    }
    if (progressBar) {
      progressBar.style.width = virtualProgress + '%';
      console.log('Progress bar updated to:', virtualProgress.toFixed(2) + '%');
    }
    
    // Update time displays
    updateCurrentTime();
    
    console.log('Virtual time set to chapter start:', virtualCurrentTime.toFixed(2) + 's');
  }

  // Update current time display (virtual time across all chapters)
  function updateCurrentTime() {
    if (!currentTimeSpan) return;
    
    const minutes = Math.floor(virtualCurrentTime / 60);
    const seconds = Math.floor(virtualCurrentTime % 60);
    currentTimeSpan.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Update total time display (total of all chapters)
  function updateTotalTime() {
    if (!totalTimeSpan) return;
    
    const minutes = Math.floor(totalDuration / 60);
    const seconds = Math.floor(totalDuration % 60);
    totalTimeSpan.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Update current chapter display in real-time
  function updateCurrentChapterDisplay() {
    // This function is called during playback to show which chapter is playing
    updateChapterDisplay();
    updateActiveChapter();
  }

  // Update current chapter based on playback time
  function updateCurrentChapter() {
    if (!audioPlayer) return;
    
    const currentTime = audioPlayer.currentTime;
    
    // Find which chapter we're currently in
    for (let i = currentChapters.length - 1; i >= 0; i--) {
      if (currentTime >= currentChapters[i].startTime) {
        if (currentChapterIndex !== i) {
          currentChapterIndex = i;
          updateChapterDisplay();
          updateActiveChapter();
        }
        break;
      }
    }
  }

  // Update chapter display in player info
  function updateChapterDisplay() {
    const currentChapter = currentChapters[currentChapterIndex];
    if (currentChapterSpan) {
      currentChapterSpan.textContent = currentChapter.title;
    }
  }

  // Update active chapter in chapter list
  function updateActiveChapter() {
    const chapterItems = document.querySelectorAll('.chapter-item');
    chapterItems.forEach((item, index) => {
      if (index === currentChapterIndex) {
        item.classList.add('active');
        item.querySelector('.chapter-status i').className = 'fas fa-pause-circle';
      } else {
        item.classList.remove('active');
        item.querySelector('.chapter-status i').className = 'fas fa-play-circle';
      }
    });
  }

  // Load monastery audio chapters
  function loadMonasteryAudio() {
    const monastery = monasteries[currentMonasteryKey];
    if (monastery) {
      console.log('Loading monastery chapters for:', monastery.name);
      
      // Stop current playback
      if (audioPlayer) {
        audioPlayer.pause();
      }
      isPlaying = false;
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      
      // Update chapters for new monastery with current language
      currentChapters = getChapters(currentMonasteryKey, currentLanguage);
      
      // Reset to first chapter
      currentChapterIndex = 0;
      virtualCurrentTime = 0;
      
      // Load all chapter durations and then load first chapter
      loadAllChapterDurations().then(() => {
        loadChapterAudio(0);
        updateMonasteryInfo(monastery);
        updateChapterDisplay();
        updateActiveChapter();
        // Update progress bar for initial chapter
        updateProgressForChapterJump();
        // Reinitialize chapter item click handlers after loading
        initializeChapterItems();
        console.log('✅ Monastery loaded and progress bar initialized');
      });
    }
  }

  // Update monastery info in player
  function updateMonasteryInfo(monastery) {
    const playerImage = document.getElementById('playerImage');
    const trackTitle = document.getElementById('trackTitle');
    
    if (playerImage) {
      playerImage.src = monastery.panorama;
      playerImage.alt = monastery.name;
    }
    
    if (trackTitle) {
      trackTitle.textContent = monastery.name + ' Audio Guide';
    }
  }

  // Download functionality - Create combined audio file
  const offlineBtn = document.getElementById('offlineMode');
  if (offlineBtn) {
    offlineBtn.addEventListener('click', function() {
      const button = this;
      
      console.log('🔄 Download button clicked');
      
      // Check if chapters are loaded
      if (!currentChapters || currentChapters.length === 0) {
        console.error('❌ No chapters available for download');
        button.innerHTML = '<i class="fas fa-times"></i> No Audio Available';
        button.style.background = '#dc3545';
        
        setTimeout(() => {
          button.innerHTML = '<i class="fas fa-download"></i> Download Offline Content';
          button.style.background = '';
        }, 2000);
        return;
      }
      
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Combined Audio...';
      button.disabled = true;
      
      // Set a timeout to prevent hanging
      const timeoutId = setTimeout(() => {
        console.error('❌ Download timeout after 30 seconds');
        button.innerHTML = '<i class="fas fa-times"></i> Download Timeout';
        button.style.background = '#dc3545';
        
        setTimeout(() => {
          button.innerHTML = '<i class="fas fa-download"></i> Download Offline Content';
          button.style.background = '';
          button.disabled = false;
        }, 3000);
      }, 30000); // 30 second timeout
      
      createCombinedAudioFile().then((blob) => {
        clearTimeout(timeoutId);
        
        if (blob && blob.size > 0) {
          console.log('✅ Combined audio blob created successfully');
          
          // Create download link for combined audio
          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(blob);
          const languageNames = { 'en': 'English', 'hi': 'Hindi', 'ne': 'Nepali' };
          const languageName = languageNames[currentLanguage] || 'English';
          downloadLink.download = `${currentMonasteryKey}-complete-audio-guide-${languageName}.wav`;
          downloadLink.style.display = 'none';
          
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          
          console.log('✅ Download initiated');
          
          // Clean up object URL
          setTimeout(() => URL.revokeObjectURL(downloadLink.href), 1000);
          
          // Update button appearance
          button.innerHTML = '<i class="fas fa-check"></i> Combined Audio Downloaded!';
          button.style.background = '#28a745';
        } else {
          console.error('❌ Invalid or empty blob received');
          button.innerHTML = '<i class="fas fa-times"></i> Download Failed';
          button.style.background = '#dc3545';
        }
        
        // Reset button after 3 seconds
        setTimeout(() => {
          button.innerHTML = '<i class="fas fa-download"></i> Download Offline Content';
          button.style.background = '';
          button.disabled = false;
        }, 3000);
      }).catch((error) => {
        clearTimeout(timeoutId);
        console.error('❌ Error creating combined audio:', error);
        button.innerHTML = '<i class="fas fa-times"></i> Download Failed';
        button.style.background = '#dc3545';
        
        setTimeout(() => {
          button.innerHTML = '<i class="fas fa-download"></i> Download Offline Content';
          button.style.background = '';
          button.disabled = false;
        }, 3000);
      });
    });
  }

  // Download all languages functionality
  const downloadAllBtn = document.getElementById('downloadAll');
  if (downloadAllBtn) {
    downloadAllBtn.addEventListener('click', function() {
      const button = this;
      const languages = ['en', 'hi', 'ne'];
      const languageNames = { 'en': 'English', 'hi': 'Hindi', 'ne': 'Nepali' };
      let downloadCount = 0;
      const totalDownloads = languages.length;
      
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating All Languages...';
      button.disabled = true;
      
      console.log(`📦 Starting download of all ${totalDownloads} languages for ${currentMonasteryKey}`);
      
      // Download each language sequentially
      languages.forEach((lang, index) => {
        setTimeout(async () => {
          console.log(`🌍 Processing ${languageNames[lang]} (${lang})...`);
          
          // Temporarily switch to this language
          const originalLanguage = currentLanguage;
          currentLanguage = lang;
          
          try {
            // Get chapters for this language
            const tempChapters = getChapters(currentMonasteryKey, lang);
            
            // Create combined audio for this language
            const blob = await createCombinedAudioFileForLanguage(tempChapters);
            
            if (blob && blob.size > 0) {
              const downloadLink = document.createElement('a');
              downloadLink.href = URL.createObjectURL(blob);
              downloadLink.download = `${currentMonasteryKey}-complete-audio-guide-${languageNames[lang]}.wav`;
              downloadLink.style.display = 'none';
              
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
              
              console.log(`✅ ${languageNames[lang]} downloaded successfully`);
              
              // Clean up
              setTimeout(() => URL.revokeObjectURL(downloadLink.href), 1000);
            }
          } catch (error) {
            console.error(`❌ Error downloading ${languageNames[lang]}:`, error);
          }
          
          // Restore original language
          currentLanguage = originalLanguage;
          
          downloadCount++;
          if (downloadCount === totalDownloads) {
            button.innerHTML = '<i class="fas fa-check"></i> All Languages Downloaded!';
            button.style.background = '#28a745';
            
            setTimeout(() => {
              button.innerHTML = '<i class="fas fa-download"></i> Download All Languages';
              button.style.background = '';
              button.disabled = false;
            }, 3000);
          }
        }, index * 2000); // 2 second delay between downloads
      });
    });
  }
  
  // Helper function for downloading specific language
  async function createCombinedAudioFileForLanguage(chapters) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      
      const audioBuffers = [];
      let totalSamples = 0;
      
      for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i];
        const response = await fetch(chapter.audioFile);
        if (!response.ok) throw new Error(`Failed to load ${chapter.audioFile}`);
        
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        audioBuffers.push(audioBuffer);
        totalSamples += audioBuffer.length;
      }
      
      const combinedBuffer = audioContext.createBuffer(
        audioBuffers[0].numberOfChannels,
        totalSamples,
        audioBuffers[0].sampleRate
      );
      
      let offset = 0;
      for (const buffer of audioBuffers) {
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
          combinedBuffer.getChannelData(channel).set(buffer.getChannelData(channel), offset);
        }
        offset += buffer.length;
      }
      
      const wavBlob = audioBufferToWav(combinedBuffer);
      await audioContext.close();
      
      return wavBlob;
    } catch (error) {
      console.error('Error creating language-specific audio:', error);
      return null;
    }
  }

  // Update chapter times in UI after loading durations
  function updateChapterTimesInUI() {
    currentChapters.forEach((chapter, index) => {
      // Update chapter start time
      const chapterTimeSpan = document.getElementById(`chapter-time-${index}`);
      if (chapterTimeSpan && chapter.startTime !== undefined) {
        const minutes = Math.floor(chapter.startTime / 60);
        const seconds = Math.floor(chapter.startTime % 60);
        chapterTimeSpan.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
      
      // Update chapter duration display
      const chapterItems = document.querySelectorAll('.chapter-item');
      if (chapterItems[index] && chapter.duration > 0) {
        const durationSpan = chapterItems[index].querySelector('.chapter-duration');
        if (durationSpan) {
          const durationMinutes = Math.floor(chapter.duration / 60);
          const durationSeconds = Math.floor(chapter.duration % 60);
          durationSpan.textContent = `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
        }
      }
    });
    
    console.log('UI updated with chapter times and durations');
  }

  // Create combined audio file from all chapters
  async function createCombinedAudioFile() {
    try {
      console.log('🎵 Starting combined audio creation...');
      console.log('Current chapters:', currentChapters.map(c => c.audioFile));
      
      // Check if we have chapters
      if (!currentChapters || currentChapters.length === 0) {
        throw new Error('No chapters available');
      }
      
      // Create audio context
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        throw new Error('Web Audio API not supported');
      }
      
      const audioContext = new AudioContext();
      console.log('✅ Audio context created');
      
      // Load all chapter audio buffers
      const audioBuffers = [];
      let totalSamples = 0;
      
      for (let i = 0; i < currentChapters.length; i++) {
        const chapter = currentChapters[i];
        console.log(`📁 Loading chapter ${i + 1}/${currentChapters.length}: ${chapter.title}`);
        console.log(`📍 File path: ${chapter.audioFile}`);
        
        try {
          // Check if file exists by trying to fetch it
          const response = await fetch(chapter.audioFile);
          console.log(`📡 Fetch response status: ${response.status}`);
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const arrayBuffer = await response.arrayBuffer();
          console.log(`📦 Array buffer size: ${arrayBuffer.byteLength} bytes`);
          
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          console.log(`🎵 Audio buffer decoded: ${audioBuffer.duration.toFixed(2)}s, ${audioBuffer.sampleRate}Hz, ${audioBuffer.numberOfChannels} channels`);
          
          audioBuffers.push(audioBuffer);
          totalSamples += audioBuffer.length;
          
          console.log(`✅ Chapter ${i + 1} loaded successfully`);
        } catch (error) {
          console.error(`❌ Error loading chapter ${i + 1}:`, error);
          console.error('Error details:', {
            file: chapter.audioFile,
            title: chapter.title,
            error: error.message
          });
          throw new Error(`Failed to load chapter: ${chapter.title} - ${error.message}`);
        }
      }
      
      console.log(`🔗 All chapters loaded, combining ${audioBuffers.length} audio files...`);
      console.log(`📊 Total samples: ${totalSamples}`);
      
      // Get audio properties from first buffer
      const sampleRate = audioBuffers[0].sampleRate;
      const numberOfChannels = audioBuffers[0].numberOfChannels;
      
      console.log(`🎛️ Audio properties: ${sampleRate}Hz, ${numberOfChannels} channels`);
      
      // Create combined buffer
      const combinedBuffer = audioContext.createBuffer(
        numberOfChannels,
        totalSamples,
        sampleRate
      );
      
      console.log(`🧩 Combined buffer created: ${combinedBuffer.duration.toFixed(2)}s`);
      
      // Copy all audio data into combined buffer
      let offset = 0;
      for (let bufferIndex = 0; bufferIndex < audioBuffers.length; bufferIndex++) {
        const buffer = audioBuffers[bufferIndex];
        console.log(`🔄 Combining chapter ${bufferIndex + 1}...`);
        
        for (let channel = 0; channel < numberOfChannels; channel++) {
          const channelData = buffer.getChannelData(channel);
          combinedBuffer.getChannelData(channel).set(channelData, offset);
        }
        
        offset += buffer.length;
        console.log(`✅ Chapter ${bufferIndex + 1} combined (offset now: ${offset})`);
      }
      
      console.log(`🎉 Combined audio created: ${combinedBuffer.duration.toFixed(2)}s total`);
      
      // Convert to WAV blob
      console.log('🔄 Converting to WAV format...');
      const wavBlob = audioBufferToWav(combinedBuffer);
      console.log(`📦 WAV blob created: ${wavBlob.size} bytes`);
      
      // Close audio context
      await audioContext.close();
      console.log('✅ Audio context closed');
      
      return wavBlob;
      
    } catch (error) {
      console.error('❌ Error creating combined audio file:', error);
      console.error('Error stack:', error.stack);
      return null;
    }
  }
  
  // Convert AudioBuffer to WAV Blob
  function audioBufferToWav(buffer) {
    const numOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numOfChannels * bytesPerSample;
    
    const arrayBuffer = new ArrayBuffer(44 + buffer.length * numOfChannels * bytesPerSample);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + buffer.length * numOfChannels * bytesPerSample, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // PCM chunk size
    view.setUint16(20, format, true);
    view.setUint16(22, numOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, buffer.length * numOfChannels * bytesPerSample, true);
    
    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  // Test function for debugging chapter clicks
  window.testChapterClick = function(index) {
    console.log('Testing chapter click for index:', index);
    jumpToChapter(index);
  };
  
  // Test function for debugging combined audio creation
  window.testCombinedDownload = function() {
    console.log('Testing combined audio download...');
    createCombinedAudioFile().then((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentMonasteryKey}-test-combined.wav`;
        a.click();
        URL.revokeObjectURL(url);
        console.log('✅ Test download initiated');
      } else {
        console.error('❌ Failed to create combined audio');
      }
    });
  };

  // Initialize everything
  initializePlayer();
  initializeChapterItems();
  loadMonasteryAudio();
  
  console.log('Audio guide initialized with seamless chapter playback');
  console.log('You can test chapter clicks manually with: testChapterClick(0), testChapterClick(1), testChapterClick(2)');
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
    
    // Get today's date for comparison
    const today = new Date();
    
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
      
      // Check if this is today's date
      if (currentDay.toDateString() === today.toDateString()) {
        dayElement.classList.add('today');
      }
      
      // Add festival indicators
      const festival = festivals.find(f => 
        f.day === currentDay.getDate() && f.month === currentDay.getMonth()
      );
      
      if (festival) {
        dayElement.classList.add('event');
        dayElement.title = festival.name + ' - ' + festival.description;
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

// Scroll to top functionality
function initializeScrollToTop() {
  const scrollToTopBtn = document.getElementById('scrollToTop');
  
  if (scrollToTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = 'block';
      } else {
        scrollToTopBtn.style.display = 'none';
      }
    });
    
    // Scroll to top when clicked
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Scroll Reveal functionality
function initializeScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade');
  
  const revealOnScroll = () => {
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  };
  
  // Initial check
  revealOnScroll();
  
  // Listen for scroll events
  window.addEventListener('scroll', revealOnScroll);
  
  // Re-check on resize
  window.addEventListener('resize', revealOnScroll);
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

// Monastery Carousel Functionality with Explore Buttons
class MonasteryCarousel {
  constructor() {
    this.carousel = document.getElementById('monasteryCarousel');
    this.track = document.querySelector('.monastery-carousel-track');
    this.exploreButtons = document.querySelectorAll('.explore-btn');
    
    this.init();
  }

  init() {
    if (!this.carousel || !this.track) return;
    
    // Add click listeners to explore buttons
    this.exploreButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click
        const monasteryId = button.dataset.monastery;
        this.exploreMonastery(monasteryId);
      });
    });
    
    // Pause animation on hover
    this.track.addEventListener('mouseenter', () => {
      this.track.style.animationPlayState = 'paused';
    });
    
    this.track.addEventListener('mouseleave', () => {
      this.track.style.animationPlayState = 'running';
    });
  }

  exploreMonastery(monasteryId) {
    // Find the clicked card and add zoom out animation
    const clickedCard = event.target.closest('.monastery-card');
    if (clickedCard) {
      clickedCard.classList.add('exploring');
      
      // Remove animation class after animation completes
      setTimeout(() => {
        clickedCard.classList.remove('exploring');
      }, 600);
    }
    
    // Show monastery details modal with slight delay for animation
    setTimeout(() => {
      this.showMonasteryDetails(monasteryId);
    }, 200);
    
    console.log(`Exploring monastery: ${monasteryId}`);
  }

  showMonasteryDetails(monasteryId) {
    // Create and show monastery details modal
    const modal = this.createMonasteryModal(monasteryId);
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
  }

  createMonasteryModal(monasteryId) {
    const monasteryData = this.getMonasteryData(monasteryId);
    
    const modal = document.createElement('div');
    modal.className = 'monastery-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <div class="modal-header">
          <img src="${monasteryData.image}" alt="${monasteryData.name}">
          <div class="modal-title">
            <h2>${monasteryData.name}</h2>
            <span class="sect-badge ${monasteryData.sect.toLowerCase()}">${monasteryData.sect}</span>
          </div>
        </div>
        <div class="modal-body">
          <div class="monastery-details">
            <div class="detail-item">
              <i class="fas fa-calendar"></i>
              <span>Founded: ${monasteryData.founded}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-mountain"></i>
              <span>Altitude: ${monasteryData.altitude}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>Location: ${monasteryData.location}</span>
            </div>
          </div>
          <p class="monastery-description">${monasteryData.description}</p>
          <div class="modal-actions">
            <button class="btn-primary" onclick="this.closest('.monastery-modal').remove()">
              <i class="fas fa-vr-cardboard"></i> Start Virtual Tour
            </button>
            <button class="btn-secondary" onclick="this.closest('.monastery-modal').remove()">
              <i class="fas fa-headphones"></i> Audio Guide
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Add close functionality
    modal.querySelector('.modal-close').addEventListener('click', () => {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    });
    
    modal.querySelector('.modal-overlay').addEventListener('click', () => {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    });
    
    return modal;
  }

  getMonasteryData(monasteryId) {
    const monasteries = {
      dubdi: {
        name: 'Dubdi Monastery',
        sect: 'Nyingma',
        founded: '1701',
        altitude: '2,100m',
        location: 'Near Yuksom, West Sikkim',
        image: 'assets/Dubdi.webp',
        description: 'Dubdi Monastery, established in 1701, is the oldest monastery in Sikkim and a vital center of Nyingma Buddhism. Nestled near Yuksom, it stands as a serene spiritual retreat with beautifully preserved traditional architecture.'
      },
      enchey: {
        name: 'Enchey Monastery',
        sect: 'Nyingma',
        founded: '1840',
        altitude: '1,575m',
        location: 'Northeast of Gangtok',
        image: 'assets/Enchey.webp',
        description: 'Enchey Monastery, perched northeast of Gangtok, is a revered spiritual center of the Nyingma sect of Vajrayana Buddhism. Founded in 1840 by Lama Drupthob Karpo, the monastery offers a peaceful retreat surrounded by lush forests.'
      },
      rumtek: {
        name: 'Rumtek Monastery',
        sect: 'Kagyu',
        founded: '1966',
        altitude: '1,550m',
        location: '23 km from Gangtok',
        image: 'assets/Rumtek.webp',
        description: 'Rumtek Monastery is the principal seat of the 16th Gyalwa Karmapa of the Karma Kagyu lineage. Modeled as a replica of Tibet\'s Tsurpu Monastery, it showcases exquisite murals, intricate thankas, and a revered statue of Sakyamuni Buddha.'
      },
      pemayangtse: {
        name: 'Pemayangtse Monastery',
        sect: 'Nyingma',
        founded: '1705',
        altitude: '2,085m',
        location: 'Pelling, West Sikkim',
        image: 'assets/Pemayangtse.webp',
        description: 'Pemayangtse Monastery, meaning "Perfect Sublime Lotus," is one of the oldest and most important monasteries in Sikkim. Built in 1705, it offers stunning views of the Kanchenjunga range and houses ancient Buddhist artifacts.'
      },
      phodong: {
        name: 'Phodong Monastery',
        sect: 'Kagyu',
        founded: '1721',
        altitude: '1,500m',
        location: 'North Sikkim',
        image: 'assets/Phodong.webp',
        description: 'Phodong Monastery, established in 1721, is a beautiful hilltop monastery offering panoramic views of the surrounding valleys. It serves as an important center for Kagyu Buddhist practices and meditation retreats.'
      }
    };
    
    return monasteries[monasteryId] || monasteries.dubdi;
  }
}

// Initialize Typewriter Effect and Carousel
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Typewriter Effect
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    const monasteryNames = [
      'Monastery360',
      'Rumtek Monastery',
      'Pemayangtse Monastery', 
      'Tashiding Monastery',
      'Enchey Monastery',
      'Dubdi Monastery',
      'Sacred Heritage'
    ];
    
    new TypewriterEffect(typewriterElement, monasteryNames, 120, 80, 2500);
  }
  
  // Initialize Monastery Carousel
  new MonasteryCarousel();
});
