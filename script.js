```javascript
/* =========================================================
   LIFELINK V2.4
   FILE 3 — CORRECTED JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("🚑 LIFELINK V2.4 starting...");


    /* =====================================================
       MAP
    ===================================================== */

    const mapCanvas = document.getElementById("mapCanvas");

    if (!mapCanvas) {
        console.error("❌ mapCanvas not found.");
        return;
    }

    if (typeof L === "undefined") {
        console.error("❌ Leaflet is not loaded.");

        const status = document.getElementById("mapStatus");

        if (status) {
            status.innerHTML = `
                <span>⚠️</span>
                <div>
                    <strong>Map unavailable</strong>
                    <small>
                        Leaflet could not be loaded. Check your internet connection.
                    </small>
                </div>
            `;
        }

        return;
    }


    /* =====================================================
       CREATE MAP
    ===================================================== */

    const map = L.map("mapCanvas").setView(
        [19.0760, 72.8777],
        12
    );


    /* =====================================================
       OPENSTREETMAP
    ===================================================== */

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
        }
    ).addTo(map);


    /* =====================================================
       LOCATION DATA
    ===================================================== */

    const locations = [

        {
            name: "Kokilaben Dhirubhai Ambani Hospital",
            category: "hospital",
            icon: "🏥",
            lat: 19.1400,
            lng: 72.8347,
            description:
                "Major multi-speciality hospital in Mumbai."
        },

        {
            name: "Lilavati Hospital",
            category: "hospital",
            icon: "🏥",
            lat: 19.0509,
            lng: 72.8286,
            description:
                "Multi-speciality hospital in Bandra."
        },

        {
            name: "Nanavati Max Super Speciality Hospital",
            category: "hospital",
            icon: "🏥",
            lat: 19.0896,
            lng: 72.8397,
            description:
                "Major hospital in Vile Parle."
        },

        {
            name: "Hinduja Hospital",
            category: "hospital",
            icon: "🏥",
            lat: 19.0330,
            lng: 72.8397,
            description:
                "Hospital and healthcare facility in Mahim."
        },

        {
            name: "Apollo Pharmacy",
            category: "pharmacy",
            icon: "💊",
            lat: 19.0750,
            lng: 72.8777,
            description:
                "Pharmacy location. Verify opening hours before visiting."
        },

        {
            name: "Mumbai Police Headquarters",
            category: "police",
            icon: "🚓",
            lat: 18.9322,
            lng: 72.8374,
            description:
                "Mumbai Police headquarters."
        },

        {
            name: "Bandra Police Station",
            category: "police",
            icon: "🚓",
            lat: 19.0550,
            lng: 72.8320,
            description:
                "Local police station in Bandra."
        },

        {
            name: "Bandra Fire Station",
            category: "fire",
            icon: "🚒",
            lat: 19.0600,
            lng: 72.8330,
            description:
                "Fire and emergency response facility."
        },

        {
            name: "BMC Headquarters",
            category: "government",
            icon: "🏛️",
            lat: 18.9322,
            lng: 72.8264,
            description:
                "Municipal Corporation of Greater Mumbai headquarters."
        },

        {
            name: "Nehru Centre",
            category: "shelter",
            icon: "🏫",
            lat: 18.9820,
            lng: 72.8150,
            description:
                "Public facility. Emergency shelter availability should be independently verified."
        }

    ];


    /* =====================================================
       CUSTOM MARKER ICON
    ===================================================== */

    function createMarkerIcon(location) {

        return L.divIcon({

            className: "",

            html: `
                <div class="lifelink-marker ${location.category}">
                    <span>${location.icon}</span>
                </div>
            `,

            iconSize: [42, 42],

            iconAnchor: [21, 42],

            popupAnchor: [0, -40]

        });

    }


    /* =====================================================
       CREATE MARKERS
    ===================================================== */

    const markerObjects = [];


    locations.forEach((location, index) => {

        const marker = L.marker(
            [location.lat, location.lng],
            {
                icon: createMarkerIcon(location)
            }
        );


        marker.locationData = location;


        marker.bindPopup(`

            <div>

                <div class="lifelink-popup-category">
                    ${location.category.toUpperCase()}
                </div>

                <div class="lifelink-popup-title">
                    ${location.icon} ${location.name}
                </div>

                <div class="lifelink-popup-description">
                    ${location.description}
                </div>

                <button
                    class="lifelink-popup-button"
                    data-location-index="${index}"
                >
                    View Details
                </button>

            </div>

        `);


        marker.on("popupopen", () => {

            const button =
                document.querySelector(
                    `.lifelink-popup-button[data-location-index="${index}"]`
                );


            if (button) {

                button.addEventListener(
                    "click",
                    () => {

                        showLocationCard(location);

                    }
                );

            }

        });


        marker.addTo(map);

        markerObjects.push(marker);

    });


    /* =====================================================
       LOCATION CARD
    ===================================================== */

    const locationCard =
        document.getElementById("locationCard");

    const locationCardIcon =
        document.getElementById("locationCardIcon");

    const locationCardCategory =
        document.getElementById("locationCardCategory");

    const locationCardTitle =
        document.getElementById("locationCardTitle");

    const locationCardDescription =
        document.getElementById("locationCardDescription");

    const locationDirections =
        document.getElementById("locationDirections");

    const locationClose =
        document.getElementById("locationClose");


    let selectedLocation = null;


    function showLocationCard(location) {

        selectedLocation = location;


        locationCardIcon.textContent =
            location.icon;

        locationCardCategory.textContent =
            location.category.toUpperCase();

        locationCardTitle.textContent =
            location.name;

        locationCardDescription.textContent =
            location.description;


        locationCard.classList.remove("hidden");


        map.setView(
            [location.lat, location.lng],
            15,
            {
                animate: true
            }
        );

    }


    if (locationClose) {

        locationClose.addEventListener(
            "click",
            () => {

                locationCard.classList.add("hidden");

                selectedLocation = null;

            }
        );

    }


    /* =====================================================
       DIRECTIONS
    ===================================================== */

    if (locationDirections) {

        locationDirections.addEventListener(
            "click",
            () => {

                if (!selectedLocation) return;


                const destination =
                    `${selectedLocation.lat},${selectedLocation.lng}`;


                const url =
                    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;


                window.open(
                    url,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

    }


    /* =====================================================
       FILTERS
    ===================================================== */

    const filterButtons =
        document.querySelectorAll(".map-filter");


    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(btn => {

                    btn.classList.remove("active");

                });


                button.classList.add("active");


                const category =
                    button.dataset.category;


                markerObjects.forEach(marker => {

                    const location =
                        marker.locationData;


                    const show =
                        category === "all" ||
                        location.category === category;


                    if (show) {

                        if (!map.hasLayer(marker)) {

                            marker.addTo(map);

                        }

                    } else {

                        if (map.hasLayer(marker)) {

                            map.removeLayer(marker);

                        }

                    }

                });


                const count =
                    locations.filter(location => {

                        return (
                            category === "all" ||
                            location.category === category
                        );

                    }).length;


                updateMapStatus(
                    "Filter active",
                    `${count} location${count === 1 ? "" : "s"} shown.`
                );

            }
        );

    });


    /* =====================================================
       SEARCH
    ===================================================== */

    const mapSearch =
        document.getElementById("mapSearch");


    if (mapSearch) {

        mapSearch.addEventListener(
            "input",
            () => {

                const query =
                    mapSearch.value
                        .trim()
                        .toLowerCase();


                if (!query) {

                    updateMapStatus(
                        "Map ready",
                        "Search for a location or use My Location."
                    );

                    return;

                }


                const results =
                    locations.filter(location => {

                        return (

                            location.name
                                .toLowerCase()
                                .includes(query)

                            ||

                            location.category
                                .toLowerCase()
                                .includes(query)

                        );

                    });


                if (results.length === 0) {

                    updateMapStatus(
                        "No results",
                        "Try another location or category."
                    );

                    return;

                }


                const location =
                    results[0];


                map.setView(
                    [location.lat, location.lng],
                    15,
                    {
                        animate: true
                    }
                );


                const marker =
                    markerObjects.find(
                        item =>
                            item.locationData === location
                    );


                if (marker) {

                    marker.openPopup();

                }


                updateMapStatus(
                    "Location found",
                    `${results.length} matching result${results.length === 1 ? "" : "s"} found.`
                );

            }
        );

    }


    /* =====================================================
       MY LOCATION
    ===================================================== */

    const locationButton =
        document.getElementById("mapLocationButton");


    if (locationButton) {

        locationButton.addEventListener(
            "click",
            () => {

                if (!navigator.geolocation) {

                    updateMapStatus(
                        "Unavailable",
                        "Your browser does not support location access."
                    );

                    return;

                }


                locationButton.disabled = true;


                updateMapStatus(
                    "Finding you...",
                    "Please allow location access."
                );


                navigator.geolocation.getCurrentPosition(

                    position => {

                        const lat =
                            position.coords.latitude;

                        const lng =
                            position.coords.longitude;


                        map.setView(
                            [lat, lng],
                            15,
                            {
                                animate: true
                            }
                        );


                        L.circleMarker(
                            [lat, lng],
                            {
                                radius: 9,
                                fillOpacity: 0.9
                            }
                        )
                        .addTo(map)
                        .bindPopup(
                            "📍 Your approximate location"
                        )
                        .openPopup();


                        updateMapStatus(
                            "Location found",
                            "The map is centered on your current location."
                        );


                        locationButton.disabled = false;

                    },


                    error => {

                        let message =
                            "Unable to access your location.";


                        if (error.code === 1) {

                            message =
                                "Location permission was denied.";

                        }


                        if (error.code === 2) {

                            message =
                                "Your location could not be determined.";

                        }


                        if (error.code === 3) {

                            message =
                                "Location request timed out.";

                        }


                        updateMapStatus(
                            "Location unavailable",
                            message
                        );


                        locationButton.disabled = false;

                    },

                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 60000
                    }

                );

            }
        );

    }


    /* =====================================================
       MAP STATUS
    ===================================================== */

    function updateMapStatus(title, message) {

        const status =
            document.getElementById("mapStatus");


        if (!status) return;


        status.innerHTML = `

            <span>
                🗺️
            </span>

            <div>

                <strong>
                    ${title}
                </strong>

                <small>
                    ${message}
                </small>

            </div>

        `;

    }


    /* =====================================================
       RESOURCE DIRECTORY
    ===================================================== */

    const resources = [

        {
            title: "112 India",
            category: "Emergency",
            description:
                "India's unified emergency response number.",
            url: "https://112.gov.in/"
        },

        {
            title: "National Disaster Management Authority",
            category: "Disaster",
            description:
                "Official disaster management information.",
            url: "https://ndma.gov.in/"
        },

        {
            title: "Ministry of Health and Family Welfare",
            category: "Health",
            description:
                "Official Government of India health information.",
            url: "https://mohfw.gov.in/"
        },

        {
            title: "India.gov.in",
            category: "Government",
            description:
                "National portal for government services.",
            url: "https://www.india.gov.in/"
        }

    ];


    const resourceList =
        document.getElementById("resourceList");

    const resourceSearch =
        document.getElementById("resourceSearch");

    const resourceFilter =
        document.getElementById("resourceFilter");

    const noResources =
        document.getElementById("noResources");


    function renderResources() {

        if (!resourceList) return;


        const search =
            resourceSearch
                ? resourceSearch.value
                    .trim()
                    .toLowerCase()
                : "";


        const category =
            resourceFilter
                ? resourceFilter.value
                : "all";


        const filtered =
            resources.filter(resource => {

                const searchMatch =

                    !search ||

                    resource.title
                        .toLowerCase()
                        .includes(search)

                    ||

                    resource.description
                        .toLowerCase()
                        .includes(search);


                const categoryMatch =
                    category === "all" ||
                    resource.category === category;


                return (
                    searchMatch &&
                    categoryMatch
                );

            });


        resourceList.innerHTML = "";


        filtered.forEach(resource => {

            const card =
                document.createElement("article");


            card.className =
                "resource-card";


            card.innerHTML = `

                <div class="resource-tag">
                    ${resource.category}
                </div>

                <h3>
                    ${resource.title}
                </h3>

                <p>
                    ${resource.description}
                </p>

                <a
                    href="${resource.url}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Visit official source ↗
                </a>

            `;


            resourceList.appendChild(card);

        });


        if (noResources) {

            noResources.classList.toggle(
                "hidden",
                filtered.length !== 0
            );

        }

    }


    if (resourceSearch) {

        resourceSearch.addEventListener(
            "input",
            renderResources
        );

    }


    if (resourceFilter) {

        resourceFilter.addEventListener(
            "change",
            renderResources
        );

    }


    renderResources();


    /* =====================================================
       SMART GUIDE
    ===================================================== */

    const guideCards =
        document.querySelectorAll(".guide-card");

    const guideResult =
        document.getElementById("guideResult");


    const guideMessages = {

        Emergency: {
            icon: "🚨",
            text:
                "For an immediate emergency in India, call 112."
        },

        Medical: {
            icon: "🏥",
            text:
                "Use the map to find nearby hospitals and pharmacies."
        },

        Disaster: {
            icon: "🌪️",
            text:
                "Check official disaster-management information and follow instructions from authorities."
        },

        Nearby: {
            icon: "📍",
            text:
                "Open the LIFELINK Map and use My Location to explore nearby services."
        },

        Government: {
            icon: "🏛️",
            text:
                "Use official government sources for verified public-service information."
        }

    };


    guideCards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const type =
                    card.dataset.guide;


                const result =
                    guideMessages[type];


                if (!result || !guideResult) return;


                guideResult.innerHTML = `

                    <span>
                        ${result.icon}
                    </span>

                    <span>
                        ${result.text}
                    </span>

                `;


                guideCards.forEach(item => {

                    item.classList.remove("active");

                });


                card.classList.add("active");

            }
        );

    });


    /* =====================================================
       SMOOTH NAVIGATION
    ===================================================== */

    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetID =
                    link.getAttribute("href");


                if (
                    !targetID ||
                    targetID === "#"
                ) return;


                const target =
                    document.querySelector(targetID);


                if (!target) return;


                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });


    /* =====================================================
       LEAFLET SIZE FIX
    ===================================================== */

    setTimeout(() => {

        map.invalidateSize();

    }, 500);


    window.addEventListener(
        "resize",
        () => {

            map.invalidateSize();

        }
    );


    /* =====================================================
       READY
    ===================================================== */

    updateMapStatus(
        "Map ready",
        "Search for a location or use My Location."
    );


    console.log(
        "✅ LIFELINK V2.4 is fully loaded."
    );

});
```
