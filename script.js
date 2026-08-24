/* =====================================================
   LIFELINK V2.2 — MAIN JAVASCRIPT
===================================================== */

"use strict";


/* =====================================================
   OFFICIAL RESOURCE DATABASE
===================================================== */

const resources = [

    {
        name: "112 India Emergency Response",
        category: "Emergency",
        location: "India",
        description:
            "Unified emergency response service for police, fire, ambulance and other emergency assistance.",
        source: "Government of India — 112 India",
        url: "https://112.gov.in/"
    },

    {
        name: "National Health Authority",
        category: "Health",
        location: "India",
        description:
            "Official information about India's public health and healthcare initiatives.",
        source: "Government of India — NHA",
        url: "https://www.nha.gov.in/"
    },

    {
        name: "National Disaster Management Authority",
        category: "Disaster",
        location: "India",
        description:
            "Official disaster preparedness, response and management information.",
        source: "Government of India — NDMA",
        url: "https://ndma.gov.in/"
    },

    {
        name: "National Portal of India",
        category: "Government",
        location: "India",
        description:
            "Official Government of India portal for public information and services.",
        source: "Government of India — India.gov.in",
        url: "https://www.india.gov.in/"
    }

];


/* =====================================================
   SAFE HTML
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
   RESOURCE DIRECTORY
===================================================== */

const resourceSearch =
    document.getElementById("resourceSearch");

const resourceFilter =
    document.getElementById("resourceFilter");

const resourceList =
    document.getElementById("resourceList");

const noResources =
    document.getElementById("noResources");


function renderResources() {

    if (!resourceList) {
        return;
    }


    const searchText =
        resourceSearch
            ? resourceSearch.value.toLowerCase().trim()
            : "";


    const selectedCategory =
        resourceFilter
            ? resourceFilter.value
            : "all";


    const filteredResources =
        resources.filter(function(resource) {

            const searchableText = (

                resource.name +
                " " +
                resource.category +
                " " +
                resource.location +
                " " +
                resource.description

            ).toLowerCase();


            const matchesSearch =
                searchableText.includes(searchText);


            const matchesCategory =
                selectedCategory === "all" ||
                resource.category === selectedCategory;


            return matchesSearch &&
                   matchesCategory;

        });


    resourceList.innerHTML = "";


    filteredResources.forEach(function(resource) {

        const card =
            document.createElement("article");


        card.className =
            "resource-card";


        card.innerHTML = `

            <span class="resource-tag">
                ✓ OFFICIAL SOURCE
            </span>

            <h3>
                ${escapeHTML(resource.name)}
            </h3>

            <p>
                <strong>
                    ${escapeHTML(resource.category)}
                </strong>
                •
                ${escapeHTML(resource.location)}
            </p>

            <p>
                ${escapeHTML(resource.description)}
            </p>

            <a
                href="${resource.url}"
                target="_blank"
                rel="noopener noreferrer"
            >
                ${escapeHTML(resource.source)} ↗
            </a>

        `;


        resourceList.appendChild(card);

    });


    if (noResources) {

        noResources.classList.toggle(
            "hidden",
            filteredResources.length !== 0
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
   NEARBY SERVICES
===================================================== */

const services = [

    {
        name: "Hospitals",
        icon: "🏥",
        query: "hospital"
    },

    {
        name: "Pharmacies",
        icon: "💊",
        query: "pharmacy"
    },

    {
        name: "Police Stations",
        icon: "🚓",
        query: "police station"
    },

    {
        name: "Fire Stations",
        icon: "🚒",
        query: "fire station"
    },

    {
        name: "Government Offices",
        icon: "🏛️",
        query: "government office"
    }

];


const nearbyServices =
    document.getElementById(
        "nearbyServices"
    );


const locationStatus =
    document.getElementById(
        "locationStatus"
    );


const locationButton =
    document.getElementById(
        "locationButton"
    );


const nearbyResult =
    document.getElementById(
        "nearbyResult"
    );


let userCoordinates = null;



/* =====================================================
   MAP SEARCH URL
===================================================== */

function createMapURL(query) {

    const encodedQuery =
        encodeURIComponent(query);


    if (userCoordinates) {

        return (
            "https://www.google.com/maps/search/" +
            encodedQuery +
            "/@" +
            userCoordinates.latitude +
            "," +
            userCoordinates.longitude +
            ",14z"
        );

    }


    return (
        "https://www.google.com/maps/search/" +
        encodedQuery
    );

}



/* =====================================================
   UPDATE RESULT STATUS
===================================================== */

function updateNearbyResult(
    title,
    message,
    icon = "📍"
) {

    if (!nearbyResult) {
        return;
    }


    nearbyResult.innerHTML = `

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
   RENDER NEARBY SERVICES
===================================================== */

function renderNearbyServices() {

    if (!nearbyServices) {
        return;
    }


    nearbyServices.innerHTML = "";


    services.forEach(function(service) {

        const card =
            document.createElement("article");


        card.className =
            "nearby-card";


        const mapURL =
            createMapURL(service.query);


        const locationText =
            userCoordinates

                ? "Search around your location."

                : "Search this service on Google Maps.";


        card.innerHTML = `

            <strong>
                ${service.icon}
                ${escapeHTML(service.name)}
            </strong>

            <small>
                ${escapeHTML(locationText)}
            </small>

            <a
                class="map-link"
                href="${mapURL}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Find Nearby ↗
            </a>

        `;


        const mapLink =
            card.querySelector(".map-link");


        if (mapLink) {

            mapLink.addEventListener(
                "click",
                function() {

                    updateNearbyResult(
                        "Opening map search",
                        "Searching for " +
                        service.name.toLowerCase() +
                        " near you.",
                        service.icon
                    );

                }
            );

        }


        nearbyServices.appendChild(card);

    });

}


renderNearbyServices();



/* =====================================================
   LOCATION PERMISSION
===================================================== */

function requestLocation() {

    if (!locationStatus) {
        return;
    }


    if (!navigator.geolocation) {

        locationStatus.textContent =
            "⚠️ Geolocation is not supported by this browser.";


        updateNearbyResult(
            "Location unavailable",
            "Your browser does not support location services.",
            "⚠️"
        );

        return;

    }


    locationStatus.textContent =
        "📍 Requesting your location…";


    if (locationButton) {

        locationButton.disabled = true;

        locationButton.textContent =
            "Finding Location…";

    }


    navigator.geolocation.getCurrentPosition(

        function(position) {

            userCoordinates = {

                latitude:
                    position.coords.latitude,

                longitude:
                    position.coords.longitude

            };


            locationStatus.textContent =
                "Location ready. Nearby searches are now centred around you.";


            if (locationButton) {

                locationButton.disabled = false;

                locationButton.textContent =
                    "Location Ready ✓";

            }


            updateNearbyResult(
                "Location ready",
                "Choose a service to search near your current location.",
                "✅"
            );


            renderNearbyServices();

        },


        function(error) {

            let message =
                "Location permission was not granted.";


            if (error.code === 1) {

                message =
                    "Location permission was denied. You can still search manually.";

            }

            else if (error.code === 2) {

                message =
                    "Your location could not be determined. Please try again.";

            }

            else if (error.code === 3) {

                message =
                    "The location request timed out. Please try again.";

            }


            locationStatus.textContent =
                "⚠️ " + message;


            updateNearbyResult(
                "Location not available",
                message,
                "⚠️"
            );


            if (locationButton) {

                locationButton.disabled = false;

                locationButton.textContent =
                    "Try Again";

            }

        },

        {

            enableHighAccuracy: false,

            timeout: 10000,

            maximumAge: 300000

        }

    );

}


if (locationButton) {

    locationButton.addEventListener(
        "click",
        requestLocation
    );

}



/* =====================================================
   SMART GUIDE
===================================================== */

const guideMessages = {

    Emergency: `
        <strong>Emergency help</strong>
        <br><br>
        If you are facing an immediate emergency
        in India, use the official emergency
        response service.
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
        <strong>Medical information</strong>
        <br><br>
        For official health information, visit
        the National Health Authority.
        You can also search for nearby hospitals
        and pharmacies.
        <br><br>
        <a
            class="official-link"
            href="https://www.nha.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
        >
            Visit NHA ↗
        </a>
    `,


    Disaster: `
        <strong>Disaster information</strong>
        <br><br>
        For official disaster preparedness and
        response information, use NDMA.
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
        <strong>Nearby services</strong>
        <br><br>
        Use Nearby Help to search for hospitals,
        pharmacies, police stations, fire stations
        and government offices.
        <br><br>
        <a
            class="official-link"
            href="#nearby"
        >
            Go to Nearby Help ↓
        </a>
    `,


    Government: `
        <strong>Government information</strong>
        <br><br>
        The National Portal of India provides
        official information about Government
        of India services and resources.
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


const guideCards =
    document.querySelectorAll(
        ".guide-card"
    );


const guideResult =
    document.getElementById(
        "guideResult"
    );


guideCards.forEach(function(card) {

    card.addEventListener(
        "click",
        function() {

            const selectedGuide =
                card.dataset.guide;


            if (
                guideResult &&
                guideMessages[selectedGuide]
            ) {

                guideResult.innerHTML = `

                    <span class="result-icon">
                        💡
                    </span>

                    <span>
                        ${guideMessages[selectedGuide]}
                    </span>

                `;

            }

        }
    );

});



/* =====================================================
   ACTIVE NAVIGATION
===================================================== */

const sections =
    document.querySelectorAll(
        "section[id]"
    );


const navigationLinks =
    document.querySelectorAll(
        ".navigation a"
    );


function updateActiveNavigation() {

    let currentSection = "";


    sections.forEach(function(section) {

        const sectionTop =
            section.offsetTop - 180;


        if (
            window.scrollY >= sectionTop
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navigationLinks.forEach(
        function(link) {

            link.classList.remove(
                "active"
            );


            const target =
                link.getAttribute("href");


            if (
                target ===
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
    updateActiveNavigation,
    {
        passive: true
    }
);


updateActiveNavigation();



/* =====================================================
   SMOOTH GUIDE LINKS
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


        if (target) {

            event.preventDefault();


            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }
);



/* =====================================================
   KEYBOARD ACCESSIBILITY
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            if (
                document.activeElement &&
                typeof document.activeElement.blur ===
                "function"
            ) {

                document.activeElement.blur();

            }

        }

    }
);



/* =====================================================
   SERVICE WORKER
===================================================== */

if (
    "serviceWorker" in navigator &&
    window.location.protocol === "https:"
) {

    window.addEventListener(
        "load",
        function() {

            fetch(
                "./service-worker.js",
                {
                    method: "HEAD"
                }
            )

            .then(function(response) {

                if (response.ok) {

                    return navigator.serviceWorker
                        .register("./service-worker.js");

                }

                return null;

            })

            .catch(function() {

                /*
                    No service worker is installed.
                    LIFELINK works normally without it.
                */

            });

        }
    );

}



/* =====================================================
   STARTUP
===================================================== */

console.log(
    "LIFELINK V2.2 loaded successfully 🚀"
);
