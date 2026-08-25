/* =========================================================
   LIFELINK V2.6
   WEBSITE JAVASCRIPT
   NO MAP / NO LEAFLET
   ========================================================= */

"use strict";


/* =========================================================
   WAIT FOR PAGE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeMobileMenu();

    initializeResourceFilters();

    initializeResourceSearch();

    initializeSmoothNavigation();

    initializeEmergencyButtons();

});


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

function initializeMobileMenu() {

    const menuButton =
        document.getElementById("mobileMenuButton");

    const navigation =
        document.querySelector(".navigation");

    if (!menuButton || !navigation) {
        return;
    }


    menuButton.addEventListener("click", () => {

        const isOpen =
            navigation.classList.toggle("open");

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuButton.textContent =
            isOpen ? "✕" : "☰";

    });


    /*
     * Close mobile menu after clicking
     * a navigation link.
     */

    const navigationLinks =
        navigation.querySelectorAll("a");

    navigationLinks.forEach((link) => {

        link.addEventListener("click", () => {

            navigation.classList.remove("open");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            menuButton.textContent = "☰";

        });

    });


    /*
     * Close menu when clicking outside.
     */

    document.addEventListener("click", (event) => {

        const clickedInsideMenu =
            navigation.contains(event.target);

        const clickedButton =
            menuButton.contains(event.target);

        if (
            !clickedInsideMenu &&
            !clickedButton &&
            navigation.classList.contains("open")
        ) {

            navigation.classList.remove("open");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            menuButton.textContent = "☰";

        }

    });

}


/* =========================================================
   RESOURCE FILTERS
   ========================================================= */

function initializeResourceFilters() {

    const filterContainer =
        document.getElementById("resourceFilters");

    const cards =
        document.querySelectorAll(".resource-card");

    if (!filterContainer || !cards.length) {
        return;
    }


    const filterButtons =
        filterContainer.querySelectorAll(
            ".resource-filter"
        );


    filterButtons.forEach((button) => {

        button.addEventListener("click", () => {

            /*
             * Remove active state
             * from every button.
             */

            filterButtons.forEach((item) => {

                item.classList.remove("active");

            });


            /*
             * Activate selected button.
             */

            button.classList.add("active");


            const selectedCategory =
                button.dataset.category || "all";


            /*
             * Show/hide cards.
             */

            cards.forEach((card) => {

                const cardCategory =
                    card.dataset.category || "";

                const matches =
                    selectedCategory === "all" ||
                    cardCategory === selectedCategory;


                if (matches) {

                    card.classList.remove(
                        "hidden-card"
                    );

                } else {

                    card.classList.add(
                        "hidden-card"
                    );

                }

            });


            /*
             * Re-check whether search
             * is currently active.
             */

            applyResourceSearch();

        });

    });

}


/* =========================================================
   RESOURCE SEARCH
   ========================================================= */

let currentSearchTerm = "";


function initializeResourceSearch() {

    const searchInput =
        document.getElementById("resourceSearch");

    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        () => {

            currentSearchTerm =
                searchInput.value
                    .trim()
                    .toLowerCase();

            applyResourceSearch();

        }
    );

}


/* =========================================================
   APPLY RESOURCE SEARCH
   ========================================================= */

function applyResourceSearch() {

    const cards =
        document.querySelectorAll(".resource-card");

    const noResults =
        document.getElementById("noResources");

    const activeFilter =
        document.querySelector(
            ".resource-filter.active"
        );


    if (!cards.length) {
        return;
    }


    const selectedCategory =
        activeFilter?.dataset.category || "all";


    let visibleCount = 0;


    cards.forEach((card) => {

        const category =
            card.dataset.category || "";

        const searchData =
            (
                card.dataset.search ||
                card.textContent ||
                ""
            ).toLowerCase();


        const categoryMatches =
            selectedCategory === "all" ||
            category === selectedCategory;


        const searchMatches =
            currentSearchTerm === "" ||
            searchData.includes(currentSearchTerm);


        const shouldShow =
            categoryMatches &&
            searchMatches;


        if (shouldShow) {

            card.classList.remove(
                "hidden-card"
            );

            visibleCount++;

        } else {

            card.classList.add(
                "hidden-card"
            );

        }

    });


    /*
     * Show "No results" message
     * if nothing matches.
     */

    if (noResults) {

        if (visibleCount === 0) {

            noResults.classList.remove(
                "hidden"
            );

        } else {

            noResults.classList.add(
                "hidden"
            );

        }

    }

}


/* =========================================================
   SMOOTH NAVIGATION
   ========================================================= */

function initializeSmoothNavigation() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    links.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");


            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }


            const target =
                document.querySelector(targetId);


            if (!target) {
                return;
            }


            event.preventDefault();


            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });


            /*
             * Update URL without
             * causing a page reload.
             */

            try {

                history.pushState(
                    null,
                    "",
                    targetId
                );

            } catch (error) {

                /*
                 * Some restricted environments
                 * may prevent history updates.
                 */

            }

        });

    });

}


/* =========================================================
   EMERGENCY BUTTONS
   ========================================================= */

function initializeEmergencyButtons() {

    const callLinks =
        document.querySelectorAll(
            'a[href^="tel:"]'
        );


    callLinks.forEach((link) => {

        link.addEventListener(
            "click",
            () => {

                /*
                 * On supported phones, the browser
                 * will open the phone dialer.
                 *
                 * Desktop browsers may simply
                 * ignore the tel: action.
                 */

                console.log(
                    "Emergency contact selected:",
                    link.getAttribute("href")
                );

            }
        );

    });

}


/* =========================================================
   SMALL SCROLL EFFECT
   ========================================================= */

window.addEventListener(
    "scroll",
    () => {

        const header =
            document.querySelector(".site-header");

        if (!header) {
            return;
        }


        if (window.scrollY > 20) {

            header.style.boxShadow =
                "0 10px 30px rgba(0,0,0,0.18)";

        } else {

            header.style.boxShadow = "none";

        }

    },
    { passive: true }
);


/* =========================================================
   KEYBOARD ACCESSIBILITY
   ========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        /*
         * Escape closes the mobile navigation.
         */

        if (event.key !== "Escape") {
            return;
        }


        const navigation =
            document.querySelector(".navigation");

        const menuButton =
            document.getElementById(
                "mobileMenuButton"
            );


        if (!navigation || !menuButton) {
            return;
        }


        navigation.classList.remove("open");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        menuButton.textContent = "☰";

    }
);


/* =========================================================
   LIFELINK READY
   ========================================================= */

console.log(
    "LIFELINK V2.6 initialized successfully."
);

console.log(
    "Map module intentionally disabled in V2.6."
);
/* =========================================================
   LIFELINK V2.7
   EMERGENCY COMMAND CENTER
   ========================================================= */


/* =========================================================
   QUICK EMERGENCY ACTIONS
   ========================================================= */

document.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(
                ".quick-action"
            );

        if (!button) {
            return;
        }

        const number =
            button.dataset.emergency;

        if (!number) {
            return;
        }

        /*
         * On phones this opens the dialer.
         * Desktop browsers may not support tel: actions.
         */

        window.location.href =
            `tel:${number}`;

    }
);


/* =========================================================
   EMERGENCY CHECKLIST
   ========================================================= */

function initializeEmergencyChecklist() {

    const checkboxes =
        document.querySelectorAll(
            ".emergency-check"
        );

    const progress =
        document.getElementById(
            "checklistProgress"
        );

    if (!checkboxes.length || !progress) {
        return;
    }


    function updateProgress() {

        const completed =
            document.querySelectorAll(
                ".emergency-check:checked"
            ).length;

        const total =
            checkboxes.length;


        progress.textContent =
            `${completed} of ${total} completed`;

    }


    checkboxes.forEach((checkbox) => {

        checkbox.addEventListener(
            "change",
            updateProgress
        );

    });


    updateProgress();

}


/* =========================================================
   LOCATION
   ========================================================= */

function initializeLocationFeature() {

    const button =
        document.getElementById(
            "locationShareButton"
        );

    const status =
        document.getElementById(
            "locationStatus"
        );

    if (!button || !status) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            if (!navigator.geolocation) {

                status.textContent =
                    "Location services are not supported by this browser.";

                return;
            }


            status.textContent =
                "Requesting your location…";


            button.disabled = true;


            navigator.geolocation.getCurrentPosition(

                (position) => {

                    const latitude =
                        position.coords.latitude
                            .toFixed(5);

                    const longitude =
                        position.coords.longitude
                            .toFixed(5);


                    status.textContent =
                        `Location detected: ${latitude}, ${longitude}`;

                    button.textContent =
                        "✓ Location Detected";

                    button.disabled = false;

                },


                (error) => {

                    button.disabled = false;

                    button.textContent =
                        "📍 Get My Location";


                    switch (error.code) {

                        case error.PERMISSION_DENIED:

                            status.textContent =
                                "Location permission was denied.";

                            break;


                        case error.POSITION_UNAVAILABLE:

                            status.textContent =
                                "Location information is unavailable.";

                            break;


                        case error.TIMEOUT:

                            status.textContent =
                                "Location request timed out.";

                            break;


                        default:

                            status.textContent =
                                "Unable to determine your location.";

                    }

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


/* =========================================================
   INITIALIZE V2.7
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeEmergencyChecklist();

        initializeLocationFeature();

        console.log(
            "LIFELINK V2.7 Emergency Command Center loaded."
        );

    }
);
