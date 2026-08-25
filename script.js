"use strict";

/* =====================================================
   LIFELINK V2.4 — MAIN JAVASCRIPT
   Real Leaflet Map + Guide + Resources
===================================================== */


/* =====================================================
   1. MAP DATA
===================================================== */

const mapPlaces = [

    {
        id: 1,
        name: "LIFELINK Medical Centre",
        category: "hospital",
        icon: "🏥",
        description:
            "Prototype healthcare location.",
        lat: 19.1197,
        lng: 72.9056
    },

    {
        id: 2,
        name: "Community Pharmacy",
        category: "pharmacy",
        icon: "💊",
        description:
            "Prototype pharmacy location.",
        lat: 19.1218,
        lng: 72.9085
    },

    {
        id: 3,
        name: "Central Police Station",
        category: "police",
        icon: "🚓",
        description:
            "Prototype police-service location.",
        lat: 19.1165,
        lng: 72.9025
    },

    {
        id: 4,
        name: "Central Fire Station",
        category: "fire",
        icon: "🚒",
        description:
            "Prototype fire-service location.",
        lat: 19.1142,
        lng: 72.9110
    },

    {
        id: 5,
        name: "Public Services Centre",
        category: "government",
        icon: "🏛️",
        description:
            "Prototype government-service location.",
        lat: 19.1230,
        lng: 72.8995
    },

    {
        id: 6,
        name: "Community Relief Centre",
        category: "shelter",
        icon: "🏫",
        description:
            "Prototype community shelter location.",
        lat: 19.1252,
        lng: 72.9122
    }

];


/* =====================================================
   2. CATEGORY NAMES
===================================================== */

const categoryNames = {

    all: "ALL SERVICES",

    hospital: "HOSPITAL",

    pharmacy: "PHARMACY",

    police: "POLICE",

    fire: "FIRE STATION",

    government: "GOVERNMENT",

    shelter: "SHELTER"

};


/* =====================================================
   3. DOM ELEMENTS
===================================================== */

const mapElement =
    document.getElementById("mapCanvas");

const mapSearch =
    document.getElementById("mapSearch");

const mapFilters =
    document.getElementById("mapFilters");

const mapLocationButton =
    document.getElementById(
        "mapLocationButton"
    );

const mapStatus =
    document.getElementById("mapStatus");

const locationCard =
    document.getElementById("locationCard");

const locationCardIcon =
    document.getElementById(
        "locationCardIcon"
    );

const locationCardCategory =
    document.getElementById(
        "locationCardCategory"
    );

const locationCardTitle =
    document.getElementById(
        "locationCardTitle"
    );

const locationCardDescription =
    document.getElementById(
        "locationCardDescription"
    );

const locationDirections =
    document.getElementById(
        "locationDirections"
    );

const locationClose =
    document.getElementById(
        "locationClose"
    );


/* =====================================================
   4. STATE
===================================================== */

let lifelinkMap = null;

let mapMarkers = [];

let activeCategory = "all";

let searchQuery = "";

let selectedPlace = null;

let userLocationMarker = null;

let userCoordinates = null;


/* =====================================================
   5. MAP STATUS
===================================================== */

function updateMapStatus(
    title,
    message,
    icon = "🗺️"
) {

    if (!mapStatus) {
        return;
    }

    mapStatus.innerHTML = `

        <span>
            ${icon}
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
   6. CREATE CUSTOM MARKER ICON
===================================================== */

function createMarkerIcon(place) {

    return L.divIcon({

        className: "",

        html: `

            <div class="lifelink-marker ${place.category}">

                <span>
                    ${place.icon}
                </span>

            </div>

        `,

        iconSize: [42, 42],

        iconAnchor: [21, 42],

        popupAnchor: [0, -40]

    });

}


/* =====================================================
   7. CREATE POPUP
===================================================== */

function createPopup(place) {

    return `

        <div>

            <div class="lifelink-popup-category">

                ${categoryNames[place.category]}

            </div>


            <div class="lifelink-popup-title">

                ${place.icon}
                ${place.name}

            </div>


            <div class="lifelink-popup-description">

                ${place.description}

                <br><br>

                <strong>
                    Prototype location
                </strong>

            </div>


            <button
                class="lifelink-popup-button"
                onclick="window.selectLifelinkPlace(${place.id})"
            >

                View Details

            </button>

        </div>

    `;

}


/* =====================================================
   8. INITIALIZE REAL MAP
===================================================== */

function initializeMap() {

    if (!mapElement) {

        console.error(
            "LIFELINK: Map element not found."
        );

        return;

    }


    if (typeof L === "undefined") {

        updateMapStatus(
            "Map library unavailable",
            "Leaflet could not be loaded. Check your internet connection.",
            "⚠️"
        );

        console.error(
            "Leaflet is not loaded."
        );

        return;

    }


    /*
       Mumbai / Powai starting view.
       Users can freely move the map.
    */

    lifelinkMap = L.map(
        "mapCanvas",
        {
            zoomControl: true
        }
    ).setView(
        [19.1197, 72.9056],
        14
    );


    /* OpenStreetMap tiles */

    L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    {
        maxZoom: 20,
        attribution:
            '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: "abcd"
    }
).addTo(lifelinkMap);


    renderMapMarkers();


    updateMapStatus(
        "Real map ready",
        "Search, move around the map, or select a service.",
        "🗺️"
    );


    /*
       Leaflet sometimes needs a resize calculation
       after being loaded inside a section.
    */

    setTimeout(
        function() {

            lifelinkMap.invalidateSize();

        },
        300
    );

}


/* =====================================================
   9. FILTER MAP DATA
===================================================== */

function getFilteredPlaces() {

    return mapPlaces.filter(
        function(place) {

            const categoryMatch =
                activeCategory === "all" ||
                place.category === activeCategory;


            const text =
                (
                    place.name +
                    " " +
                    place.category +
                    " " +
                    place.description
                ).toLowerCase();


            const searchMatch =
                text.includes(
                    searchQuery.toLowerCase()
                );


            return (
                categoryMatch &&
                searchMatch
            );

        }
    );

}


/* =====================================================
   10. RENDER MAP MARKERS
===================================================== */

function renderMapMarkers() {

    if (!lifelinkMap) {
        return;
    }


    /*
       Remove existing markers.
    */

    mapMarkers.forEach(
        function(marker) {

            lifelinkMap.removeLayer(
                marker
            );

        }
    );


    mapMarkers = [];


    const places =
        getFilteredPlaces();


    places.forEach(
        function(place) {

            const marker =
                L.marker(

                    [
                        place.lat,
                        place.lng
                    ],

                    {
                        icon:
                            createMarkerIcon(
                                place
                            )
                    }

                );


            marker.bindPopup(
                createPopup(place)
            );


            marker.on(
                "click",
                function() {

                    selectedPlace =
                        place;

                }
            );


            marker.addTo(
                lifelinkMap
            );


            mapMarkers.push(
                marker
            );

        }
    );


    if (places.length === 0) {

        updateMapStatus(
            "No locations found",
            "Try another category or search term.",
            "🔎"
        );

    }

    else {

        updateMapStatus(
            places.length +
            (
                places.length === 1
                    ? " location"
                    : " locations"
            ) +
            " shown",
            "Select a marker for more information.",
            "📍"
        );

    }

}


/* =====================================================
   11. SHOW PLACE DETAILS
===================================================== */

function showPlace(place) {

    selectedPlace =
        place;


    if (!locationCard) {
        return;
    }


    locationCardIcon.textContent =
        place.icon;


    locationCardCategory.textContent =
        categoryNames[
            place.category
        ] || "SERVICE";


    locationCardTitle.textContent =
        place.name;


    locationCardDescription.textContent =
        place.description;


    locationCard.classList.remove(
        "hidden"
    );


    updateMapStatus(
        place.name,
        "Location selected.",
        place.icon
    );

}


/* =====================================================
   12. GLOBAL POPUP FUNCTION
===================================================== */

window.selectLifelinkPlace =
    function(id) {

        const place =
            mapPlaces.find(
                function(item) {

                    return item.id === id;

                }
            );


        if (!place) {
            return;
        }


        showPlace(place);

    };


/* =====================================================
   13. MAP SEARCH
===================================================== */

if (mapSearch) {

    mapSearch.addEventListener(
        "input",
        function() {

            searchQuery =
                mapSearch.value.trim();


            renderMapMarkers();

        }
    );

}


/* =====================================================
   14. MAP FILTERS
===================================================== */

if (mapFilters) {

    const buttons =
        mapFilters.querySelectorAll(
            ".map-filter"
        );


    buttons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {


                    buttons.forEach(
                        function(item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    activeCategory =
                        button.dataset.category ||
                        "all";


                    renderMapMarkers();

                }
            );

        }
    );

}


/* =====================================================
   15. LOCATION CARD CLOSE
===================================================== */

if (locationClose) {

    locationClose.addEventListener(
        "click",
        function() {

            selectedPlace =
                null;


            locationCard.classList.add(
                "hidden"
            );

        }
    );

}


/* =====================================================
   16. DIRECTIONS
===================================================== */

if (locationDirections) {

    locationDirections.addEventListener(
        "click",
        function() {

            if (!selectedPlace) {

                updateMapStatus(
                    "Select a location",
                    "Choose a map marker first.",
                    "📍"
                );

                return;

            }


            const destination =
                encodeURIComponent(
                    selectedPlace.name
                );


            let url;


            if (userCoordinates) {

                url =
                    "https://www.google.com/maps/dir/?api=1" +
                    "&origin=" +
                    userCoordinates.latitude +
                    "," +
                    userCoordinates.longitude +
                    "&destination=" +
                    destination;

            }

            else {

                url =
                    "https://www.google.com/maps/search/?api=1" +
                    "&query=" +
                    destination;

            }


            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );

        }
    );

}


/* =====================================================
   17. MY LOCATION
===================================================== */

function locateUser() {

    if (!navigator.geolocation) {

        updateMapStatus(
            "Location unavailable",
            "Your browser does not support geolocation.",
            "⚠️"
        );

        return;

    }


    if (mapLocationButton) {

        mapLocationButton.disabled =
            true;

        mapLocationButton.innerHTML =
            "📍 Finding...";

    }


    updateMapStatus(
        "Finding your location",
        "Please allow location access if requested.",
        "⏳"
    );


    navigator.geolocation.getCurrentPosition(

        function(position) {

            const lat =
                position.coords.latitude;

            const lng =
                position.coords.longitude;


            userCoordinates = {

                latitude: lat,

                longitude: lng

            };


            if (userLocationMarker) {

                lifelinkMap.removeLayer(
                    userLocationMarker
                );

            }


            userLocationMarker =
                L.marker(

                    [lat, lng],

                    {

                        title:
                            "Your location"

                    }

                ).addTo(
                    lifelinkMap
                );


            userLocationMarker.bindPopup(
                "<strong>📍 You are here</strong>"
            );


            lifelinkMap.setView(
                [lat, lng],
                15
            );


            userLocationMarker.openPopup();


            if (mapLocationButton) {

                mapLocationButton.disabled =
                    false;

                mapLocationButton.innerHTML =
                    "📍 My Location";

            }


            updateMapStatus(
                "Your location found",
                "The map has moved to your current location.",
                "📍"
            );

        },


        function(error) {

            let message =
                "Could not determine your location.";


            if (error.code === 1) {

                message =
                    "Location permission was denied.";

            }

            else if (error.code === 2) {

                message =
                    "Your location could not be determined.";

            }

            else if (error.code === 3) {

                message =
                    "The location request timed out.";

            }


            if (mapLocationButton) {

                mapLocationButton.disabled =
                    false;

                mapLocationButton.innerHTML =
                    "📍 My Location";

            }


            updateMapStatus(
                "Location unavailable",
                message,
                "⚠️"
            );

        },


        {

            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 300000

        }

    );

}


if (mapLocationButton) {

    mapLocationButton.addEventListener(
        "click",
        locateUser
    );

}


/* =====================================================
   18. RESOURCE DATA
===================================================== */

const resources = [

    {
        title: "112 India",
        category: "Emergency",
        icon: "🚨",
        description:
            "Official unified emergency response service.",
        url:
            "https://112.gov.in/"
    },

    {
        title: "National Disaster Management Authority",
        category: "Disaster",
        icon: "🌪️",
        description:
            "Official disaster management information and preparedness resources.",
        url:
            "https://ndma.gov.in/"
    },

    {
        title: "India.gov.in",
        category: "Government",
        icon: "🏛️",
        description:
            "National Portal of India providing government information and services.",
        url:
            "https://www.india.gov.in/"
    },

    {
        title: "National Health Authority",
        category: "Health",
        icon: "🏥",
        description:
            "Official information about India's national health programmes.",
        url:
            "https://www.nha.gov.in/"
    }

];


const resourceList =
    document.getElementById(
        "resourceList"
    );

const resourceSearch =
    document.getElementById(
        "resourceSearch"
    );

const resourceFilter =
    document.getElementById(
        "resourceFilter"
    );

const noResources =
    document.getElementById(
        "noResources"
    );


/* =====================================================
   19. RENDER RESOURCES
===================================================== */

function renderResources() {

    if (!resourceList) {
        return;
    }


    const query =
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
        resources.filter(
            function(resource) {

                const matchesCategory =
                    category === "all" ||
                    resource.category === category;


                const searchable =
                    (
                        resource.title +
                        " " +
                        resource.description +
                        " " +
                        resource.category
                    ).toLowerCase();


                const matchesSearch =
                    searchable.includes(
                        query
                    );


                return (
                    matchesCategory &&
                    matchesSearch
                );

            }
        );


    resourceList.innerHTML = "";


    filtered.forEach(
        function(resource) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "resource-card";


            card.innerHTML = `

                <div class="resource-tag">

                    ${resource.category}

                </div>


                <h3>

                    ${resource.icon}
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


            resourceList.appendChild(
                card
            );

        }
    );


    if (noResources) {

        noResources.classList.toggle(
            "hidden",
            filtered.length !== 0
        );

    }

}


/* =====================================================
   20. RESOURCE SEARCH
===================================================== */

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


/* =====================================================
   21. SMART GUIDE
===================================================== */

const guideCards =
    document.querySelectorAll(
        ".guide-card"
    );

const guideResult =
    document.getElementById(
        "guideResult"
    );


const guideData = {

    Emergency: `

        <strong>
            🚨 Emergency Help
        </strong>

        <br><br>

        For an immediate emergency in India,
        use the official emergency response service.

        <br><br>

        <a
            class="official-link"
            href="tel:112"
        >
            📞 Call 112
        </a>

        &nbsp;&nbsp;

        <a
            class="official-link"
            href="https://112.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
        >
            Official 112 India ↗
        </a>

    `,


    Medical: `

        <strong>
            🏥 Medical Help
        </strong>

        <br><br>

        Use the LIFELINK map to explore
        healthcare locations and pharmacies.

        <br><br>

        <a
            class="official-link"
            href="#lifelink-map"
        >
            🗺️ Open LIFELINK Map ↓
        </a>

    `,


    Disaster: `

        <strong>
            🌪️ Disaster Information
        </strong>

        <br><br>

        For official disaster preparedness
        and management information:

        <br><br>

        <a
            class="official-link"
            href="https://ndma.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
        >
            Visit NDMA ↗
        </a>

    `,


    Nearby: `

        <strong>
            📍 Nearby Help
        </strong>

        <br><br>

        Use the LIFELINK Map to explore
        nearby public-service locations.

        <br><br>

        <a
            class="official-link"
            href="#lifelink-map"
        >
            🗺️ Open Map ↓
        </a>

    `,


    Government: `

        <strong>
            🏛️ Government Services
        </strong>

        <br><br>

        Find official Government of India
        information and public services.

        <br><br>

        <a
            class="official-link"
            href="https://www.india.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
        >
            Visit India.gov.in ↗
        </a>

    `

};


guideCards.forEach(
    function(card) {

        card.addEventListener(
            "click",
            function() {

                const guideType =
                    card.dataset.guide;


                if (
                    guideResult &&
                    guideData[guideType]
                ) {

                    guideResult.innerHTML = `

                        <span>
                            💡
                        </span>

                        <span>

                            ${guideData[guideType]}

                        </span>

                    `;


                    guideResult.scrollIntoView({

                        behavior:
                            "smooth",

                        block:
                            "nearest"

                    });

                }

            }
        );

    }
);


/* =====================================================
   22. NAVIGATION
===================================================== */

const navigationLinks =
    document.querySelectorAll(
        ".navigation a"
    );


const sections =
    document.querySelectorAll(
        "section[id]"
    );


function updateNavigation() {

    let currentSection = "";


    sections.forEach(
        function(section) {

            const sectionTop =
                section.offsetTop - 180;


            if (
                window.scrollY >=
                sectionTop
            ) {

                currentSection =
                    section.id;

            }

        }
    );


    navigationLinks.forEach(
        function(link) {

            link.classList.remove(
                "active"
            );


            if (
                link.getAttribute("href") ===
                "#" + currentSection
            ) {

                link.classList.add(
                    "active"
                );

            }

        }
    );

}


window.addEventListener(
    "scroll",
    updateNavigation,
    {
        passive: true
    }
);


/* =====================================================
   23. SMOOTH SCROLL
===================================================== */

document.addEventListener(
    "click",
    function(event) {

        const link =
            event.target.closest(
                'a[href^="#"]'
            );


        if (!link) {
            return;
        }


        const targetID =
            link.getAttribute("href");


        if (
            !targetID ||
            targetID === "#"
        ) {

            return;

        }


        const target =
            document.querySelector(
                targetID
            );


        if (!target) {
            return;
        }


        event.preventDefault();


        target.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });

    }
);


/* =====================================================
   24. ESCAPE KEY
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            locationCard
        ) {

            locationCard.classList.add(
                "hidden"
            );

        }

    }
);


/* =====================================================
   25. START EVERYTHING
===================================================== */

initializeMap();

renderResources();

updateNavigation();


/* =====================================================
   26. CONSOLE
===================================================== */

console.log(
    "LIFELINK V2.4 loaded successfully 🗺️"
);

console.log(
    "Real Leaflet map initialized."
);
