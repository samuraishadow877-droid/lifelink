"use strict";

/* =====================================================
   LIFELINK V2.3 — INTERACTIVE MAP
===================================================== */


/* =====================================================
   DEMONSTRATION MAP DATA
   IMPORTANT:
   These are clearly marked prototype locations.
   They are NOT live emergency locations.
===================================================== */

const mapPlaces = [

    {
        id: 1,
        name: "LIFELINK Medical Centre",
        category: "hospital",
        icon: "🏥",
        description:
            "Demonstration hospital marker for the LIFELINK map prototype.",
        x: 27,
        y: 32
    },

    {
        id: 2,
        name: "Community Pharmacy",
        category: "pharmacy",
        icon: "💊",
        description:
            "Demonstration pharmacy marker for the LIFELINK map prototype.",
        x: 63,
        y: 25
    },

    {
        id: 3,
        name: "Central Police Station",
        category: "police",
        icon: "🚓",
        description:
            "Demonstration police-station marker for the LIFELINK map prototype.",
        x: 76,
        y: 57
    },

    {
        id: 4,
        name: "Central Fire Station",
        category: "fire",
        icon: "🚒",
        description:
            "Demonstration fire-station marker for the LIFELINK map prototype.",
        x: 22,
        y: 70
    },

    {
        id: 5,
        name: "Public Services Centre",
        category: "government",
        icon: "🏛️",
        description:
            "Demonstration government-service marker for the LIFELINK map prototype.",
        x: 52,
        y: 65
    },

    {
        id: 6,
        name: "Community Relief Centre",
        category: "shelter",
        icon: "🏫",
        description:
            "Demonstration community shelter marker for the LIFELINK map prototype.",
        x: 80,
        y: 20
    },

    {
        id: 7,
        name: "LIFELINK Health Point",
        category: "hospital",
        icon: "🏥",
        description:
            "Demonstration health-service marker for the LIFELINK map prototype.",
        x: 42,
        y: 82
    }

];


/* =====================================================
   CATEGORY INFORMATION
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
   DOM ELEMENTS
===================================================== */

const mapCanvas =
    document.getElementById("mapCanvas");

const mapMarkers =
    document.getElementById("mapMarkers");

const mapSearch =
    document.getElementById("mapSearch");

const mapFilters =
    document.getElementById("mapFilters");

const mapLocationButton =
    document.getElementById("mapLocationButton");

const mapStatus =
    document.getElementById("mapStatus");

const mapEmptyState =
    document.getElementById("mapEmptyState");

const userMarker =
    document.getElementById("userMarker");

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


/* =====================================================
   STATE
===================================================== */

let activeCategory = "all";

let searchQuery = "";

let selectedPlace = null;

let userCoordinates = null;


/* =====================================================
   SAFETY
===================================================== */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =====================================================
   UPDATE MAP STATUS
===================================================== */

function updateMapStatus(
    title,
    message,
    icon = "📍"
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
                ${escapeHTML(title)}
            </strong>

            <small>
                ${escapeHTML(message)}
            </small>

        </div>

    `;

}


/* =====================================================
   FILTER PLACES
===================================================== */

function getFilteredPlaces() {

    return mapPlaces.filter(function(place) {

        const matchesCategory =
            activeCategory === "all" ||
            place.category === activeCategory;

        const searchableText = (

            place.name +
            " " +
            place.category +
            " " +
            place.description

        ).toLowerCase();

        const matchesSearch =
            searchableText.includes(
                searchQuery.toLowerCase()
            );

        return (
            matchesCategory &&
            matchesSearch
        );

    });

}


/* =====================================================
   CREATE MAP MARKER
===================================================== */

function createMarker(place) {

    const marker =
        document.createElement("button");

    marker.type = "button";

    marker.className =
        "map-marker marker-" +
        place.category;

    marker.style.left =
        place.x + "%";

    marker.style.top =
        place.y + "%";

    marker.setAttribute(
        "aria-label",
        place.name
    );

    marker.innerHTML = `

        <span>
            ${place.icon}
        </span>

    `;


    marker.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            showPlace(place);

        }
    );


    return marker;

}


/* =====================================================
   RENDER MAP
===================================================== */

function renderMap() {

    if (!mapMarkers) {
        return;
    }


    mapMarkers.innerHTML = "";


    const filteredPlaces =
        getFilteredPlaces();


    filteredPlaces.forEach(
        function(place) {

            const marker =
                createMarker(place);

            mapMarkers.appendChild(marker);

        }
    );


    if (mapEmptyState) {

        mapEmptyState.classList.toggle(
            "hidden",
            filteredPlaces.length !== 0
        );

    }


    if (filteredPlaces.length === 0) {

        updateMapStatus(
            "No locations found",
            "Try another search or category.",
            "🔎"
        );

    }

    else {

        updateMapStatus(
            filteredPlaces.length +
            " service" +
            (
                filteredPlaces.length === 1
                    ? ""
                    : "s"
            ) +
            " shown",
            "Select a map marker for more information.",
            "📍"
        );

    }

}


/* =====================================================
   SHOW LOCATION CARD
===================================================== */

function showPlace(place) {

    selectedPlace = place;


    if (!locationCard) {
        return;
    }


    locationCardIcon.textContent =
        place.icon;


    locationCardCategory.textContent =
        categoryNames[place.category] ||
        "SERVICE";


    locationCardTitle.textContent =
        place.name;


    locationCardDescription.textContent =
        place.description;


    locationCard.classList.remove(
        "hidden"
    );


    updateMapStatus(
        place.name,
        "Demonstration map location selected.",
        place.icon
    );


    locationCard.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

}


/* =====================================================
   CLOSE LOCATION CARD
===================================================== */

function closeLocationCard() {

    selectedPlace = null;


    if (locationCard) {

        locationCard.classList.add(
            "hidden"
        );

    }


    updateMapStatus(
        "Map ready",
        "Select a marker to explore a location.",
        "📍"
    );

}


if (locationClose) {

    locationClose.addEventListener(
        "click",
        closeLocationCard
    );

}


/* =====================================================
   DIRECTIONS
===================================================== */

if (locationDirections) {

    locationDirections.addEventListener(
        "click",
        function() {

            if (!selectedPlace) {
                return;
            }


            let destination =
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
                    "https://www.google.com/maps/search/" +
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
   CATEGORY FILTERS
===================================================== */

if (mapFilters) {

    const filterButtons =
        mapFilters.querySelectorAll(
            ".map-filter"
        );


    filterButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    filterButtons.forEach(
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


                    renderMap();

                }
            );

        }
    );

}


/* =====================================================
   MAP SEARCH
===================================================== */

if (mapSearch) {

    mapSearch.addEventListener(
        "input",
        function() {

            searchQuery =
                mapSearch.value.trim();

            renderMap();

        }
    );

}


/* =====================================================
   USER LOCATION
===================================================== */

function requestUserLocation() {

    if (!navigator.geolocation) {

        updateMapStatus(
            "Location unavailable",
            "Your browser does not support location services.",
            "⚠️"
        );

        return;

    }


    if (mapLocationButton) {

        mapLocationButton.disabled =
            true;

        mapLocationButton.innerHTML =
            "📍 Finding location…";

    }


    updateMapStatus(
        "Requesting location",
        "Please allow location access if your browser asks.",
        "⏳"
    );


    navigator.geolocation.getCurrentPosition(

        function(position) {

            userCoordinates = {

                latitude:
                    position.coords.latitude,

                longitude:
                    position.coords.longitude

            };


            if (userMarker) {

                userMarker.classList.remove(
                    "hidden"
                );

            }


            if (mapLocationButton) {

                mapLocationButton.disabled =
                    false;

                mapLocationButton.innerHTML =
                    "📍 Location Ready ✓";

            }


            updateMapStatus(
                "Your location is ready",
                "Your location is shown locally in this browser.",
                "✅"
            );

        },


        function(error) {

            let message =
                "Location permission was not granted.";


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
                    "📍 Try Again";

            }


            updateMapStatus(
                "Location unavailable",
                message,
                "⚠️"
            );

        },

        {

            enableHighAccuracy: false,

            timeout: 10000,

            maximumAge: 300000

        }

    );

}


if (mapLocationButton) {

    mapLocationButton.addEventListener(
        "click",
        requestUserLocation
    );

}


/* =====================================================
   MAP CLICK
===================================================== */

if (mapCanvas) {

    mapCanvas.addEventListener(
        "click",
        function(event) {

            if (
                event.target.closest(
                    ".map-marker"
                )
            ) {

                return;

            }


            closeLocationCard();

        }
    );

}


/* =====================================================
   KEYBOARD SUPPORT
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeLocationCard();

        }

    }
);


/* =====================================================
   NAVIGATION
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
   SMOOTH SCROLL
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
            behavior: "smooth",
            block: "start"
        });

    }
);


/* =====================================================
   START MAP
===================================================== */

renderMap();

updateNavigation();


/* =====================================================
   CONSOLE
===================================================== */

console.log(
    "LIFELINK V2.3 Map loaded successfully 🗺️"
);

console.log(
    "Prototype locations:",
    mapPlaces.length
);
