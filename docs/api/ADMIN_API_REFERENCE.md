# Admin API Reference

## Overview
The Admin API provides comprehensive access to admin, venue, and facility data with flexible search capabilities. All endpoints return admin-centric data, making it easy to build frontend applications that need to display information about sports venue administrators.

**Base URL:** `https://claygrounds-6d703322b3bc.herokuapp.com/api/hudle/admins`

---

## 🔍 Search Endpoints

### Search Admin by Criteria
**`GET /search`**

Search for admins using flexible criteria including phone, email, name, venue details, city, address, or sports.

#### Query Parameters
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `phone` | string | Admin phone number (exact match) | `9999099867` |
| `email` | string | Admin email (partial match) | `info@goaltech.in` |
| `name` | string | Admin name (partial match) | `Goaltech` |
| `venue_name` | string | Venue name (partial match) | `ClayGrounds` |
| `city` | string | City name (partial match) | `Delhi` |
| `address` | string | Venue address (partial match) | `Vasant` |
| `sport` | string | Sport name (partial match) | `Football` |

#### Example Requests
```bash
# Search by phone
GET /search?phone=9999099867

# Search by sport
GET /search?sport=Football

# Search by city
GET /search?city=Delhi

# Search by venue name
GET /search?venue_name=ClayGrounds
```

#### Response Structure
```json
{
  "success": true,
  "data": {
    "admin": {
      "id": "5a9744ae-a420-4de9-b15a-3e1d8d7f0fed",
      "name": "Goaltech Innovation India",
      "email": "info@goaltech.in",
      "phone": "9999099867",
      "company": {
        "name": "Goaltech Innovation India",
        "address": "123 Business Park, Delhi",
        "gstin": "07AABCU9603R1ZX",
        "pan": "AABCU9603R"
      },
      "total_venues": 21,
      "total_facilities": 32,
      "sports": ["Box Cricket", "Football", "Volleyball", "Pickleball"],
      "cities": ["Delhi", "Faridabad", "Gurgaon", "Noida", "Kolkata"],
      "regions": ["city_1", "city_11", "city_43"],
      "venues": [
        {
          "id": "venue_123",
          "name": "ClayGrounds Delhi",
          "address": "Vasant Kunj, New Delhi",
          "coordinates": {
            "latitude": 28.5355,
            "longitude": 77.1539
          },
          "image_url": "https://example.com/venue.jpg",
          "rating": 4.5,
          "rating_count": 150,
          "closest_metro": "Vasant Vihar",
          "web_url": "https://hudle.in/venues/claygrounds-delhi/123",
          "offer_text": "20% off on weekend bookings",
          "city_id": "city_1",
          "city_name": "Delhi",
          "region": "city_1",
          "facilities_count": 2,
          "sports": ["Football", "Box Cricket"],
          "facilities": [
            {
              "id": "facility_456",
              "name": "Football Ground",
              "type": "Football",
              "enabled": true,
              "pricing": {
                "per_hour": 2000,
                "currency": "INR"
              },
              "capacity": 22,
              "dimensions": "105m x 68m",
              "surface": "Natural Grass"
            }
          ]
        }
      ]
    }
  },
  "timestamp": "2025-09-11T20:16:30.203Z"
}
```

---

## 👤 Admin Details

### Get Admin by ID or Phone
**`GET /:adminId`**

Retrieve complete admin data using either UUID or phone number.

#### Path Parameters
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `adminId` | string | Admin UUID or phone number | `9999099867` or `5a9744ae-a420-4de9-b15a-3e1d8d7f0fed` |

#### Example Requests
```bash
# Using phone number
GET /9999099867

# Using UUID
GET /5a9744ae-a420-4de9-b15a-3e1d8d7f0fed
```

#### Response Structure
Same as search endpoint response structure.

---

## 🏢 Multi-Admin Data

### Get Multiple Admins
**`GET /multiple`**

Retrieve combined data from multiple admins (useful for organizations with multiple admin accounts).

#### Query Parameters
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `admin_ids` | string | Comma-separated list of admin IDs or phone numbers | `9999099867,9910545678` |

#### Example Request
```bash
GET /multiple?admin_ids=9999099867,9910545678
```

#### Response Structure
```json
{
  "success": true,
  "data": {
    "admins": [
      {
        "id": "5a9744ae-a420-4de9-b15a-3e1d8d7f0fed",
        "name": "Goaltech Innovation India",
        "email": "info@goaltech.in",
        "phone": "9999099867",
        "company": { /* company details */ },
        "total_venues": 21,
        "total_facilities": 32,
        "sports": ["Box Cricket", "Football", "Volleyball", "Pickleball"],
        "cities": ["Delhi", "Faridabad", "Gurgaon"],
        "regions": ["city_1", "city_11", "city_43"]
      }
    ],
    "venues": [ /* all venues from all admins */ ],
    "summary": {
      "total_admins": 2,
      "total_venues": 23,
      "total_facilities": 36,
      "cities_covered": 9,
      "regions_covered": 6,
      "sports_offered": 5,
      "unique_sports": ["Box Cricket", "Football", "Volleyball", "Pickleball", "Badminton"],
      "unique_cities": ["Delhi", "Faridabad", "Gurgaon", "Noida", "Kolkata"],
      "unique_regions": ["city_1", "city_11", "city_43", "city_66", "city_68"]
    }
  },
  "timestamp": "2025-09-11T20:16:30.203Z"
}
```

---

## 📋 List All Admins

### Get All Admins
**`GET /`**

Retrieve a list of all admins with summary information.

#### Example Request
```bash
GET /
```

#### Response Structure
```json
{
  "success": true,
  "data": {
    "admins": [
      {
        "id": "5a9744ae-a420-4de9-b15a-3e1d8d7f0fed",
        "name": "Goaltech Innovation India",
        "email": "info@goaltech.in",
        "phone": "9999099867",
        "company": {
          "name": "Goaltech Innovation India",
          "address": "123 Business Park, Delhi"
        },
        "total_venues": 21,
        "total_facilities": 32,
        "sports": ["Box Cricket", "Football", "Volleyball", "Pickleball"],
        "cities": ["Delhi", "Faridabad", "Gurgaon"],
        "regions": ["city_1", "city_11", "city_43"]
      }
    ],
    "summary": {
      "total_admins": 846,
      "total_venues": 1193,
      "total_facilities": 3893,
      "cities_covered": 97,
      "regions_covered": 23
    }
  },
  "timestamp": "2025-09-11T20:16:30.203Z"
}
```

---

## 🛠️ Data Management

### Clear Cache
**`POST /cache/clear`**

Clear the admin service cache to force fresh data loading.

#### Example Request
```bash
POST /cache/clear
```

#### Response Structure
```json
{
  "success": true,
  "message": "Admin service cache cleared successfully",
  "timestamp": "2025-09-11T20:16:30.203Z"
}
```

---

## 📊 Data Types Reference

### Admin Object
```typescript
interface Admin {
  id: string;                    // UUID
  name: string;                  // Admin/company name
  email: string;                 // Admin email
  phone: string;                 // Admin phone number
  company: {
    name: string;                // Company name
    address: string;             // Company address
    gstin: string;               // GST registration number
    pan: string;                 // PAN number
  } | null;
  total_venues: number;          // Total venues managed
  total_facilities: number;      // Total facilities across all venues
  sports: string[];              // All sports offered across venues
  cities: string[];              // All cities where venues are located
  regions: string[];             // All regions where venues are located
  venues: Venue[];               // Array of venue objects
}
```

### Venue Object
```typescript
interface Venue {
  id: string;                    // Venue UUID
  name: string;                  // Venue name
  address: string;               // Full venue address
  coordinates: {
    latitude: number;            // GPS latitude
    longitude: number;           // GPS longitude
  };
  image_url: string;             // Venue image URL
  rating: number;                // Average rating (0-5)
  rating_count: number;          // Number of ratings
  closest_metro: string;         // Nearest metro station
  web_url: string;               // Hudle venue page URL
  offer_text: string;            // Current offers/promotions
  city_id: string;               // City identifier
  city_name: string;             // City name
  region: string;                // Region identifier
  facilities_count: number;      // Number of facilities
  sports: string[];              // Sports available at this venue
  facilities: Facility[];        // Array of facility objects
}
```

### Facility Object
```typescript
interface Facility {
  id: string;                    // Facility UUID
  name: string;                  // Facility name
  type: string;                  // Sport type
  enabled: boolean;              // Whether facility is active
  pricing: {
    per_hour: number;            // Price per hour
    currency: string;            // Currency code (INR)
  };
  capacity: number;              // Maximum players
  dimensions: string;            // Field dimensions
  surface: string;               // Playing surface type
}
```

---

## 🚨 Error Responses

### Common Error Codes
| Status | Description | Example |
|--------|-------------|---------|
| `400` | Bad Request - Missing required parameters | `{"success": false, "message": "At least one search criteria is required"}` |
| `404` | Not Found - Admin not found | `{"success": false, "message": "Admin with ID or phone not found"}` |
| `500` | Internal Server Error | `{"success": false, "error": "Failed to get admin data"}` |

### Error Response Structure
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message",
  "timestamp": "2025-09-11T20:16:30.203Z"
}
```

---

## 🎯 Frontend Integration Examples

### React/JavaScript Example
```javascript
// Search for admin by phone
const searchAdmin = async (phone) => {
  try {
    const response = await fetch(`/api/hudle/admins/search?phone=${phone}`);
    const data = await response.json();
    
    if (data.success) {
      const admin = data.data.admin;
      console.log(`Found admin: ${admin.name}`);
      console.log(`Venues: ${admin.total_venues}`);
      console.log(`Sports: ${admin.sports.join(', ')}`);
      console.log(`Cities: ${admin.cities.join(', ')}`);
    }
  } catch (error) {
    console.error('Error searching admin:', error);
  }
};

// Get multiple admins
const getMultipleAdmins = async (adminIds) => {
  try {
    const response = await fetch(`/api/hudle/admins/multiple?admin_ids=${adminIds.join(',')}`);
    const data = await response.json();
    
    if (data.success) {
      const summary = data.data.summary;
      console.log(`Total venues: ${summary.total_venues}`);
      console.log(`Cities covered: ${summary.cities_covered}`);
      console.log(`Sports offered: ${summary.unique_sports.join(', ')}`);
    }
  } catch (error) {
    console.error('Error getting multiple admins:', error);
  }
};
```

### Vue.js Example
```javascript
// Vue 3 Composition API
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const admin = ref(null);
    const loading = ref(false);
    
    const fetchAdmin = async (phone) => {
      loading.value = true;
      try {
        const response = await fetch(`/api/hudle/admins/search?phone=${phone}`);
        const data = await response.json();
        
        if (data.success) {
          admin.value = data.data.admin;
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        loading.value = false;
      }
    };
    
    return { admin, loading, fetchAdmin };
  }
};
```

---

## 📈 Performance Notes

- **Caching**: Admin data is cached for optimal performance
- **Response Size**: Typical admin response: ~25KB, Multi-admin response: ~30KB
- **Rate Limits**: No specific rate limits, but avoid excessive requests
- **Data Freshness**: Data is refreshed daily at 6:00 AM IST

---

## 🔗 Related Documentation

- [Venue Discovery API](../discovery-docs/VENUE_DISCOVERY_GUIDE.md)
- [Booking API Reference](BOOKING_API_REFERENCE.md)
- [Global Venue Data](GLOBAL_VENUE_DISCOVERY.md)

---

*Last updated: September 11, 2025*
*API Version: 1.0*
