/* =====================================================
   LIFELINK V2.1
   MAIN JAVASCRIPT
===================================================== */

"use strict";


/* =====================================================
   RESOURCE DATABASE
   Official/public sources only
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


            return matchesSearch && matchesCategory;

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
   SAFE HTML HELPER
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
   NEARBY SERVICES
===================================================== */

const services = [

    {
        name: "Hospitals",
        icon: "🏥",
        query: "hospital"
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
        name: "Pharmacies",
        icon: "💊",
        query: "pharmacy"
    },

    {
        name: "Government Services",
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


let userCoordinates = null;



/* =====================================================
   CREATE MAP SEARCH
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
   RENDER NEARBY SERVICES
===================================================== */

function renderNearbyServices() {

    if (!nearbyServices) {
        return;
    }


    nearbyServices.innerHTML = "";


    services.forEach(function(service) {

        const card =
            document.createElement("div");


        card.className =
            "nearby-card";


        const mapURL =
            createMapURL(service.query);


        card.innerHTML = `

            <strong>
                ${service.icon}
                ${escapeHTML(service.name)}
            </strong>

            <small>
                ${
                    userCoordinates
                    ?
                    "Search around your location."
                    :
                    "Open a map search for this service."
                }
            </small>

            <a
                class="map-link"
                href="${mapURL}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Open Map ↗
            </a>

        `;


        nearbyServices.appendChild(card);

    });

}


renderNearbyServices();



/* =====================================================
   LOCATION
===================================================== */

function requestLocation() {

    if (!locationStatus) {
        return;
    }


    if (!navigator.geolocation) {

        locationStatus.textContent =
            "⚠️ Geolocation is not supported by this browser.";

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
                "✅ Location ready. Choose a service below.";


            if (locationButton) {

                locationButton.disabled = false;

                locationButton.textContent =
                    "Location Ready ✓";

            }


            renderNearbyServices();

        },


        function(error) {

            let message =
                "⚠️ Location permission was not granted.";


            if (error.code === 1) {

                message =
                    "⚠️ Location permission was denied. You can still search maps manually.";

            }

            else if (error.code === 2) {

                message =
                    "⚠️ Your location could not be determined. Try again.";

            }

            else if (error.code === 3) {

                message =
                    "⚠️ Location request timed out. Try again.";

            }


            locationStatus.textContent =
                message;


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

        For official health information,
        visit the National Health Authority.

        You can also use Nearby Help to search
        for hospitals and pharmacies.

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

        For official disaster preparedness
        and response information, use NDMA.

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

        Use the Nearby Help section and allow
        location access if you want map searches
        centred around your current location.

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
   KEYBOARD ACCESSIBILITY
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            document.activeElement
        ) {

            document.activeElement.blur();

        }

    }
);



/* =====================================================
   SERVICE WORKER
   Only register if a service-worker.js exists.
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

            })

            .catch(function() {

                /*
                    No service worker installed.
                    This is completely fine.
                */

            });

        }
    );

}



/* =====================================================
   STARTUP CHECK
===================================================== */

console.log(
    "LIFELINK V2.1 loaded successfully 🚀"
);
