/* =========================================
   LIFELINK V2
   MAIN JAVASCRIPT
========================================= */


/* =========================================
   OFFICIAL RESOURCE DATABASE
========================================= */

const resources = [

    {
        name: "112 India Emergency Response",
        category: "Emergency",
        location: "India",
        description:
            "Unified emergency number for police, fire, ambulance and other emergency assistance.",
        source: "Government of India — 112 India",
        url: "https://112.gov.in/"
    },

    {
        name: "National Health Authority",
        category: "Health",
        location: "India",
        description:
            "Official public information from India's National Health Authority.",
        source: "Government of India — NHA",
        url: "https://www.nha.gov.in/"
    },

    {
        name: "National Disaster Management Authority",
        category: "Disaster",
        location: "India",
        description:
            "Official disaster-management information, preparedness and guidance.",
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


/* =========================================
   RESOURCE DIRECTORY
========================================= */

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
        resourceSearch.value
            .toLowerCase()
            .trim();

    const selectedCategory =
        resourceFilter.value;


    const filteredResources =
        resources.filter(function(resource) {

            const matchesSearch =
                (
                    resource.name +
                    " " +
                    resource.category +
                    " " +
                    resource.location +
                    " " +
                    resource.description
                )
                .toLowerCase()
                .includes(searchText);


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
                ${resource.name}
            </h3>

            <p>
                <strong>
                    ${resource.category}
                </strong>
                •
                ${resource.location}
            </p>

            <p>
                ${resource.description}
            </p>

            <a
                href="${resource.url}"
                target="_blank"
                rel="noopener noreferrer"
            >
                ${resource.source} ↗
            </a>

        `;


        resourceList.appendChild(card);

    });


    if (noResources) {

        noResources.classList.toggle(
            "hidden",
            filteredResources.length > 0
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



/* =========================================
   NEARBY HELP
========================================= */


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



/* =========================================
   DRAW NEARBY SERVICES
========================================= */

function drawNearbyServices() {

    if (!nearbyServices) {
        return;
    }


    nearbyServices.innerHTML = "";


    services.forEach(function(service) {

        let mapURL;


        if (userCoordinates) {

            mapURL =
                "https://www.google.com/maps/search/" +
                encodeURIComponent(service.query) +
                "/@" +
                userCoordinates.latitude +
                "," +
                userCoordinates.longitude +
                ",14z";

        } else {

            mapURL =
                "https://www.google.com/maps/search/" +
                encodeURIComponent(service.query);

        }


        const card =
            document.createElement("div");


        card.className =
            "nearby-card";


        card.innerHTML = `

            <strong>
                ${service.icon}
                ${service.name}
            </strong>

            <small>
                ${
                    userCoordinates
                    ?
                    "Search around your location."
                    :
                    "Allow location for a local search."
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


drawNearbyServices();



/* =========================================
   LOCATION BUTTON
========================================= */

if (locationButton) {

    locationButton.addEventListener(
        "click",
        function() {


            /* Browser does not support GPS */

            if (!navigator.geolocation) {

                locationStatus.textContent =
                    "⚠️ Geolocation is not supported by this browser.";

                return;

            }


            locationStatus.textContent =
                "📍 Requesting your location…";


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


                    drawNearbyServices();

                },


                function() {

                    locationStatus.textContent =
                        "⚠️ Location permission was not granted. You can still search maps manually.";

                    drawNearbyServices();

                },


                {

                    enableHighAccuracy: false,

                    timeout: 10000,

                    maximumAge: 300000

                }

            );

        }
    );

}



/* =========================================
   LIFELINK GUIDE
========================================= */


const guideMessages = {

    Emergency: `
        For an immediate emergency in India,
        call <strong>112</strong>.

        <br><br>

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
        For official health information,
        visit the <strong>National Health Authority</strong>.

        <br><br>

        You can also use the Nearby Help section
        to search for hospitals and pharmacies.
    `,


    Disaster: `
        For official disaster-management information,
        visit the <strong>National Disaster Management Authority</strong>.

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
        Use the Nearby Help section
        and allow location access to create
        map searches around you.
    `,


    Government: `
        For official Government of India
        information and services, visit:

        <br><br>

        <a
            class="official-link"
            href="https://www.india.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
        >
            National Portal of India ↗
        </a>
    `

};



/* =========================================
   GUIDE BUTTONS
========================================= */

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

                guideResult.innerHTML =
                    guideMessages[selectedGuide];

            }

        }
    );

});



/* =========================================
   ACTIVE NAVIGATION
========================================= */

const sections =
    document.querySelectorAll(
        "section[id]"
    );


const navigationLinks =
    document.querySelectorAll(
        ".navigation a"
    );


window.addEventListener(
    "scroll",
    function() {

        let currentSection = "";


        sections.forEach(function(section) {

            const sectionTop =
                section.offsetTop - 150;


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
);



/* =========================================
   SAFETY CHECK
========================================= */

console.log(
    "LIFELINK V2 loaded successfully 🚀"
);
