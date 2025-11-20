/**
 * Location Autocomplete for Ride Pooling - Via Style
 * Provides pickup zones and waypoints for dynamic route matching
 */

// Pickup Zones - Pre-defined areas for Via-style ride pooling
export const PICKUP_ZONES = [
  // Campus Zones
  {
    id: 'spu-main-gate',
    name: 'SPU Main Gate',
    category: 'Campus',
    address: '2641 Kennedy Blvd, Jersey City, NJ',
    zone: 'SPU Campus',
    coordinates: { lat: 40.7180, lng: -74.0464 },
    isPopular: true
  },
  {
    id: 'spu-library',
    name: 'SPU Library',
    category: 'Campus',
    address: 'Saint Peter\'s University Library',
    zone: 'SPU Campus',
    coordinates: { lat: 40.7182, lng: -74.0468 },
    isPopular: true
  },
  {
    id: 'spu-parking',
    name: 'SPU Parking Lot',
    category: 'Campus',
    address: 'SPU Student Parking',
    zone: 'SPU Campus',
    coordinates: { lat: 40.7175, lng: -74.0460 },
    isPopular: true
  },
  {
    id: 'spu-dorms',
    name: 'SPU Residence Halls',
    category: 'Campus',
    address: 'SPU Dorms',
    zone: 'SPU Campus',
    coordinates: { lat: 40.7185, lng: -74.0472 },
    isPopular: true
  },

  // Jersey City Transit Zones
  {
    id: 'journal-square',
    name: 'Journal Square',
    category: 'Transit',
    address: 'Journal Square, Jersey City, NJ',
    zone: 'Journal Square',
    coordinates: { lat: 40.7324, lng: -74.0624 },
    isPopular: true
  },
  {
    id: 'grove-street',
    name: 'Grove Street PATH',
    category: 'Transit',
    address: 'Grove Street Station, Jersey City, NJ',
    zone: 'Downtown JC',
    coordinates: { lat: 40.7197, lng: -74.0431 },
    isPopular: true
  },
  {
    id: 'newport-mall',
    name: 'Newport Centre Mall',
    category: 'Shopping',
    address: 'Newport Centre, Jersey City, NJ',
    zone: 'Newport',
    coordinates: { lat: 40.7267, lng: -74.0343 },
    isPopular: false
  },
  {
    id: 'liberty-park',
    name: 'Liberty State Park',
    category: 'Park',
    address: 'Liberty State Park, Jersey City, NJ',
    zone: 'Liberty Park',
    coordinates: { lat: 40.7067, lng: -74.0493 },
    isPopular: false
  },

  // NYC - Manhattan Zones
  {
    id: 'times-square',
    name: 'Times Square',
    category: 'NYC',
    address: 'Times Square, New York, NY',
    zone: 'Midtown Manhattan',
    coordinates: { lat: 40.7580, lng: -73.9855 },
    isPopular: true
  },
  {
    id: 'penn-station',
    name: 'Penn Station',
    category: 'Transit',
    address: 'Penn Station, New York, NY',
    zone: 'Midtown Manhattan',
    coordinates: { lat: 40.7505, lng: -73.9934 },
    isPopular: true
  },
  {
    id: 'grand-central',
    name: 'Grand Central',
    category: 'Transit',
    address: 'Grand Central Terminal, New York, NY',
    zone: 'Midtown Manhattan',
    coordinates: { lat: 40.7527, lng: -73.9772 },
    isPopular: true
  },
  {
    id: 'port-authority',
    name: 'Port Authority',
    category: 'Transit',
    address: 'Port Authority Bus Terminal, New York, NY',
    zone: 'Midtown Manhattan',
    coordinates: { lat: 40.7570, lng: -73.9900 },
    isPopular: true
  },
  {
    id: 'union-square',
    name: 'Union Square',
    category: 'NYC',
    address: 'Union Square, New York, NY',
    zone: 'Lower Manhattan',
    coordinates: { lat: 40.7359, lng: -73.9911 },
    isPopular: false
  },
  {
    id: 'wall-street',
    name: 'Wall Street',
    category: 'NYC',
    address: 'Wall Street, New York, NY',
    zone: 'Financial District',
    coordinates: { lat: 40.7074, lng: -74.0113 },
    isPopular: false
  },

  // Airport Zones
  {
    id: 'newark-airport',
    name: 'Newark Airport (EWR)',
    category: 'Airport',
    address: 'Newark Liberty International Airport',
    zone: 'Newark Airport',
    coordinates: { lat: 40.6895, lng: -74.1745 },
    isPopular: true
  },
  {
    id: 'jfk-airport',
    name: 'JFK Airport',
    category: 'Airport',
    address: 'John F. Kennedy International Airport',
    zone: 'JFK Airport',
    coordinates: { lat: 40.6413, lng: -73.7781 },
    isPopular: true
  },
  {
    id: 'lga-airport',
    name: 'LaGuardia Airport (LGA)',
    category: 'Airport',
    address: 'LaGuardia Airport, Queens, NY',
    zone: 'LaGuardia Airport',
    coordinates: { lat: 40.7769, lng: -73.8740 },
    isPopular: true
  },

  // New Jersey Zones
  {
    id: 'hoboken',
    name: 'Hoboken Terminal',
    category: 'Transit',
    address: 'Hoboken, NJ',
    zone: 'Hoboken',
    coordinates: { lat: 40.7357, lng: -74.0290 },
    isPopular: true
  },
  {
    id: 'newark-penn',
    name: 'Newark Penn Station',
    category: 'Transit',
    address: 'Newark Penn Station, Newark, NJ',
    zone: 'Newark',
    coordinates: { lat: 40.7347, lng: -74.1643 },
    isPopular: true
  },
  {
    id: 'secaucus',
    name: 'Secaucus Junction',
    category: 'Transit',
    address: 'Secaucus Junction Station, NJ',
    zone: 'Secaucus',
    coordinates: { lat: 40.7606, lng: -74.0747 },
    isPopular: false
  },
  {
    id: 'rutgers-newark',
    name: 'Rutgers Newark',
    category: 'University',
    address: 'Rutgers University-Newark',
    zone: 'Newark',
    coordinates: { lat: 40.7424, lng: -74.1740 },
    isPopular: false
  },
  {
    id: 'njit',
    name: 'NJIT',
    category: 'University',
    address: 'New Jersey Institute of Technology',
    zone: 'Newark',
    coordinates: { lat: 40.7444, lng: -74.1782 },
    isPopular: false
  },

  // Shopping & Entertainment Zones
  {
    id: 'american-dream',
    name: 'American Dream Mall',
    category: 'Shopping',
    address: 'American Dream, East Rutherford, NJ',
    zone: 'East Rutherford',
    coordinates: { lat: 40.8127, lng: -74.0644 },
    isPopular: false
  },
  {
    id: 'jersey-gardens',
    name: 'Jersey Gardens Mall',
    category: 'Shopping',
    address: 'Jersey Gardens Outlet Mall, Elizabeth, NJ',
    zone: 'Elizabeth',
    coordinates: { lat: 40.6631, lng: -74.1890 },
    isPopular: false
  },
  {
    id: 'metlife-stadium',
    name: 'MetLife Stadium',
    category: 'Stadium',
    address: 'MetLife Stadium, East Rutherford, NJ',
    zone: 'East Rutherford',
    coordinates: { lat: 40.8128, lng: -74.0742 },
    isPopular: false
  },

  // Common NJ Town Centers
  {
    id: 'weehawken',
    name: 'Weehawken',
    category: 'NJ',
    address: 'Weehawken, NJ',
    zone: 'Weehawken',
    coordinates: { lat: 40.7696, lng: -74.0204 },
    isPopular: false
  },
  {
    id: 'union-city',
    name: 'Union City',
    category: 'NJ',
    address: 'Union City, NJ',
    zone: 'Union City',
    coordinates: { lat: 40.6976, lng: -74.0243 },
    isPopular: false
  },
  {
    id: 'north-bergen',
    name: 'North Bergen',
    category: 'NJ',
    address: 'North Bergen, NJ',
    zone: 'North Bergen',
    coordinates: { lat: 40.8043, lng: -74.0121 },
    isPopular: false
  },
  {
    id: 'bayonne',
    name: 'Bayonne',
    category: 'NJ',
    address: 'Bayonne, NJ',
    zone: 'Bayonne',
    coordinates: { lat: 40.6687, lng: -74.1143 },
    isPopular: false
  },
  {
    id: 'elizabeth',
    name: 'Elizabeth',
    category: 'NJ',
    address: 'Elizabeth, NJ',
    zone: 'Elizabeth',
    coordinates: { lat: 40.6640, lng: -74.2107 },
    isPopular: false
  },
  {
    id: 'paterson',
    name: 'Paterson',
    category: 'NJ',
    address: 'Paterson, NJ',
    zone: 'Paterson',
    coordinates: { lat: 40.9168, lng: -74.1718 },
    isPopular: false
  },
];

// Legacy support - map PICKUP_ZONES to POPULAR_LOCATIONS
export const POPULAR_LOCATIONS = PICKUP_ZONES;

/**
 * Search locations based on user input
 * @param {String} query - User's search query
 * @param {Number} limit - Maximum number of results
 * @returns {Array} - Matching locations
 */
export const searchLocations = (query, limit = 8) => {
  if (!query || query.trim().length < 2) {
    // Return popular locations if query is too short
    return POPULAR_LOCATIONS.slice(0, limit);
  }

  const normalizedQuery = query.toLowerCase().trim();

  // Score and filter locations
  const scoredLocations = POPULAR_LOCATIONS.map(location => {
    const nameLower = location.name.toLowerCase();
    const addressLower = location.address.toLowerCase();

    let score = 0;

    // Exact match at start (highest priority)
    if (nameLower.startsWith(normalizedQuery)) {
      score = 100;
    }
    // Contains query in name
    else if (nameLower.includes(normalizedQuery)) {
      score = 80;
    }
    // Matches address
    else if (addressLower.includes(normalizedQuery)) {
      score = 60;
    }
    // Matches category
    else if (location.category.toLowerCase().includes(normalizedQuery)) {
      score = 40;
    }

    // Boost campus locations
    if (location.category === 'Campus') {
      score += 10;
    }

    // Boost transit hubs for common travel
    if (location.category === 'Transit' || location.category === 'Airport') {
      score += 5;
    }

    return { ...location, score };
  });

  // Filter and sort
  return scoredLocations
    .filter(loc => loc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

/**
 * Get popular destinations from a specific location
 * @param {String} from - Starting location
 * @returns {Array} - Popular destinations
 */
export const getPopularDestinationsFrom = (from) => {
  const fromLower = from?.toLowerCase() || '';

  // If from campus, suggest airports, NYC, malls
  if (fromLower.includes('spu') || fromLower.includes('campus') || fromLower.includes('peter')) {
    return POPULAR_LOCATIONS.filter(loc =>
      loc.category === 'Airport' ||
      loc.category === 'NYC' ||
      loc.category === 'Shopping' ||
      loc.category === 'Transit'
    ).slice(0, 6);
  }

  // If from airport, suggest campus and nearby areas
  if (fromLower.includes('airport') || fromLower.includes('ewr') || fromLower.includes('jfk')) {
    return POPULAR_LOCATIONS.filter(loc =>
      loc.category === 'Campus' ||
      loc.category === 'NJ' ||
      loc.name.includes('Jersey City')
    ).slice(0, 6);
  }

  // If from NYC, suggest NJ locations
  if (fromLower.includes('new york') || fromLower.includes('manhattan') || fromLower.includes('nyc')) {
    return POPULAR_LOCATIONS.filter(loc =>
      loc.category === 'Campus' ||
      loc.category === 'NJ'
    ).slice(0, 6);
  }

  // Default: return mixed popular locations
  return POPULAR_LOCATIONS.filter(loc =>
    loc.category === 'Campus' ||
    loc.category === 'Airport' ||
    loc.category === 'NYC'
  ).slice(0, 6);
};

/**
 * Format location for display
 */
export const formatLocation = (location) => {
  if (typeof location === 'string') return location;
  return location.name;
};

/**
 * Get category icon
 */
export const getCategoryIcon = (category) => {
  const icons = {
    'Campus': '🎓',
    'Transit': '🚉',
    'Airport': '✈️',
    'NYC': '🗽',
    'Shopping': '🛍️',
    'University': '🏫',
    'Stadium': '🏟️',
    'Park': '🌳',
    'NJ': '📍'
  };
  return icons[category] || '📍';
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param {Object} coord1 - {lat, lng}
 * @param {Object} coord2 - {lat, lng}
 * @returns {Number} - Distance in kilometers
 */
export const calculateDistance = (coord1, coord2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Find pickup zones along a route (Via-style waypoint matching)
 * @param {Object} from - Starting location with coordinates
 * @param {Object} to - Destination location with coordinates
 * @param {Number} maxDetour - Maximum detour distance in km (default 2km)
 * @returns {Array} - Pickup zones that are along the way
 */
export const findWaypointsAlongRoute = (from, to, maxDetour = 2) => {
  if (!from?.coordinates || !to?.coordinates) return [];

  const directDistance = calculateDistance(from.coordinates, to.coordinates);

  return PICKUP_ZONES.filter(zone => {
    if (!zone.coordinates) return false;

    // Skip start and end points
    if (zone.id === from.id || zone.id === to.id) return false;

    // Calculate if this zone is "on the way"
    const distFromStart = calculateDistance(from.coordinates, zone.coordinates);
    const distToEnd = calculateDistance(zone.coordinates, to.coordinates);
    const totalWithWaypoint = distFromStart + distToEnd;

    // If adding this waypoint doesn't add more than maxDetour km, it's on the way
    const detour = totalWithWaypoint - directDistance;
    return detour <= maxDetour;
  });
};

/**
 * Get nearby pickup zones within a radius
 * @param {Object} location - Location with coordinates
 * @param {Number} radiusKm - Search radius in km (default 1km)
 * @returns {Array} - Nearby pickup zones sorted by distance
 */
export const getNearbyZones = (location, radiusKm = 1) => {
  if (!location?.coordinates) return [];

  return PICKUP_ZONES
    .filter(zone => zone.coordinates && zone.id !== location.id)
    .map(zone => ({
      ...zone,
      distance: calculateDistance(location.coordinates, zone.coordinates)
    }))
    .filter(zone => zone.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Calculate route match score (0-100) for Via-style matching
 * @param {Object} rideRoute - The driver's route {from, to, waypoints}
 * @param {Object} requestRoute - The rider's desired route {from, to}
 * @returns {Number} - Match score (0-100)
 */
export const calculateRouteMatch = (rideRoute, requestRoute) => {
  if (!rideRoute?.from?.coordinates || !rideRoute?.to?.coordinates ||
      !requestRoute?.from?.coordinates || !requestRoute?.to?.coordinates) {
    return 0;
  }

  let score = 0;

  // Check if rider's pickup is near driver's route
  const pickupNearStart = calculateDistance(
    rideRoute.from.coordinates,
    requestRoute.from.coordinates
  );
  if (pickupNearStart < 0.5) score += 40; // Within 500m
  else if (pickupNearStart < 1) score += 30; // Within 1km
  else if (pickupNearStart < 2) score += 20; // Within 2km

  // Check if rider's dropoff is near driver's route
  const dropoffNearEnd = calculateDistance(
    rideRoute.to.coordinates,
    requestRoute.to.coordinates
  );
  if (dropoffNearEnd < 0.5) score += 40; // Within 500m
  else if (dropoffNearEnd < 1) score += 30; // Within 1km
  else if (dropoffNearEnd < 2) score += 20; // Within 2km

  // Check if rider's points are along the driver's route
  const waypoints = findWaypointsAlongRoute(rideRoute.from, rideRoute.to, 3);
  const pickupOnRoute = waypoints.some(w =>
    calculateDistance(w.coordinates, requestRoute.from.coordinates) < 0.5
  );
  const dropoffOnRoute = waypoints.some(w =>
    calculateDistance(w.coordinates, requestRoute.to.coordinates) < 0.5
  );

  if (pickupOnRoute) score += 10;
  if (dropoffOnRoute) score += 10;

  return Math.min(score, 100);
};

/**
 * Get popular pickup zones (for quick selection)
 * @returns {Array} - Most popular pickup zones
 */
export const getPopularZones = () => {
  return PICKUP_ZONES.filter(zone => zone.isPopular);
};

/**
 * Find location by ID
 * @param {String} id - Location ID
 * @returns {Object|null} - Location object or null
 */
export const findLocationById = (id) => {
  return PICKUP_ZONES.find(zone => zone.id === id) || null;
};
