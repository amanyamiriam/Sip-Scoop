// Store locations data
const storeLocations = [
    {
        name: 'Downtown',
        address: '123 Main Street, City Center',
        phone: '(254) 555-0123',
        hours: '10:00 AM - 10:00 PM',
        position: { lat: -1.2921, lng: 36.8219 }, // Example coordinates for Nairobi
        image: 'images/location-downtown.jpg'
    },
    {
        name: 'City Mall',
        address: 'Shop 45, City Mall, Westlands',
        phone: '(254) 555-0124',
        hours: '9:00 AM - 9:00 PM',
        position: { lat: -1.2673, lng: 36.8065 }, // Example coordinates
        image: 'images/location-mall.jpg'
    },
    {
        name: 'Beach Road',
        address: '789 Beach Road, Coastline',
        phone: '(254) 555-0125',
        hours: '8:00 AM - 11:00 PM',
        position: { lat: -1.2844, lng: 36.8232 }, // Example coordinates
        image: 'images/location-beach.jpg'
    }
];

// Initialize Google Map
let map;
let markers = [];
let infoWindows = [];

function initMap() {
    // Center map on Nairobi
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -1.2921, lng: 36.8219 },
        zoom: 12,
        styles: [
            // Custom map styles for better visibility
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });

    // Create markers for each location
    storeLocations.forEach((location, index) => {
        const marker = new google.maps.Marker({
            position: location.position,
            map: map,
            title: location.name,
            icon: {
                url: 'images/map-marker.png',
                scaledSize: new google.maps.Size(40, 40)
            }
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div class="map-info-window">
                    <h3>${location.name}</h3>
                    <p>${location.address}</p>
                    <p>${location.hours}</p>
                    <p>${location.phone}</p>
                    <button onclick="getDirections(${location.position.lat}, ${location.position.lng})">
                        Get Directions
                    </button>
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindows.forEach(iw => iw.close());
            infoWindow.open(map, marker);
        });

        markers.push(marker);
        infoWindows.push(infoWindow);
    });
}

function findNearestStore() {
    const input = document.getElementById('location-search').value;
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: input }, (results, status) => {
        if (status === 'OK') {
            const userLocation = results[0].geometry.location;
            let nearest = null;
            let nearestDistance = Infinity;

            storeLocations.forEach((store, index) => {
                const distance = google.maps.geometry.spherical.computeDistanceBetween(
                    userLocation,
                    new google.maps.LatLng(store.position)
                );

                if (distance < nearestDistance) {
                    nearest = index;
                    nearestDistance = distance;
                }
            });

            if (nearest !== null) {
                map.setCenter(storeLocations[nearest].position);
                map.setZoom(15);
                infoWindows[nearest].open(map, markers[nearest]);
            }
        }
    });
}

function getDirections(lat, lng) {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
}

// Initialize map when page loads
window.addEventListener('load', initMap);