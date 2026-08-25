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
/* =========================================================
   LIFELINK V2.8
   RESOURCE INTELLIGENCE
   ========================================================= */


/* =========================================================
   RESOURCE COUNT
   ========================================================= */

function updateResourceCount() {

    const cards =
        document.querySelectorAll(
            ".resource-card"
        );

    const countElement =
        document.getElementById(
            "resourceCount"
        );

    if (!cards.length || !countElement) {
        return;
    }

    const visibleCards =
        [...cards].filter(
            (card) =>
                !card.classList.contains(
                    "hidden-card"
                )
        );


    countElement.textContent =
        `Showing ${visibleCards.length} resource${
            visibleCards.length === 1
                ? ""
                : "s"
        }`;

}


/* =========================================================
   RESOURCE MODAL
   ========================================================= */

function initializeResourceModal() {

    const modal =
        document.getElementById(
            "resourceModal"
        );

    const closeButton =
        document.getElementById(
            "closeResourceModal"
        );

    const backdrop =
        modal?.querySelector(
            "[data-close-modal]"
        );

    if (!modal) {
        return;
    }


    const name =
        document.getElementById(
            "modalResourceName"
        );

    const category =
        document.getElementById(
            "modalResourceCategory"
        );

    const location =
        document.getElementById(
            "modalResourceLocation"
        );

    const phone =
        document.getElementById(
            "modalResourcePhone"
        );

    const services =
        document.getElementById(
            "modalResourceServices"
        );

    const callButton =
        document.getElementById(
            "modalCallButton"
        );

    const copyButton =
        document.getElementById(
            "modalCopyButton"
        );


    let currentResource = null;


    function closeModal() {

        modal.classList.remove("open");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow = "";

    }


    function openModal(button) {

        const data = {
            name:
                button.dataset.name ||
                "Resource",

            category:
                button.dataset.category ||
                "Resource",

            location:
                button.dataset.location ||
                "Not listed",

            phone:
                button.dataset.phone ||
                "Not listed",

            services:
                button.dataset.services ||
                "Not listed"
        };


        currentResource = data;


        name.textContent =
            data.name;

        category.textContent =
            data.category;

        location.textContent =
            data.location;

        phone.textContent =
            data.phone;

        services.textContent =
            data.services;


        if (
            data.phone &&
            data.phone !== "Not listed"
        ) {

            callButton.href =
                `tel:${data.phone}`;

            callButton.classList.remove(
                "hidden"
            );

        } else {

            callButton.classList.add(
                "hidden"
            );

        }


        modal.classList.add("open");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow =
            "hidden";

    }


    document.addEventListener(
        "click",
        (event) => {

            const detailsButton =
                event.target.closest(
                    ".resource-details"
                );

            if (!detailsButton) {
                return;
            }

            openModal(detailsButton);

        }
    );


    closeButton?.addEventListener(
        "click",
        closeModal
    );


    backdrop?.addEventListener(
        "click",
        closeModal
    );


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                modal.classList.contains("open")
            ) {

                closeModal();

            }

        }
    );


    copyButton?.addEventListener(
        "click",
        async () => {

            if (!currentResource) {
                return;
            }


            const text =
                `${currentResource.name}
Category: ${currentResource.category}
Location: ${currentResource.location}
Phone: ${currentResource.phone}
Services: ${currentResource.services}`;


            try {

                await navigator.clipboard.writeText(
                    text
                );

                copyButton.textContent =
                    "✓ Copied";

                setTimeout(
                    () => {
/* =========================================================
   LIFELINK V2.9
   SAFETY INTELLIGENCE
   ========================================================= */


/* =========================================================
   SAFETY DATA
   ========================================================= */

const safetyGuidance = {

    medical: {

        icon: "🚑",

        label: "MEDICAL SAFETY",

        title: "Get appropriate medical help.",

        description:
            "If someone may have a serious or life-threatening medical problem, contact emergency medical services and follow the instructions of the emergency operator.",

        emergency:
            "108",

        emergencyLabel:
            "📞 Emergency Medical Help",

        steps: [

            "Move the person away from immediate hazards if it is safe to do so.",

            "Contact emergency medical services when the situation is urgent or life-threatening.",

            "Follow the instructions given by the emergency operator or medical professional.",

            "Do not give medication or treatment unless you know it is appropriate and safe."
        ]

    },


    fire: {

        icon: "🔥",

        label: "FIRE SAFETY",

        title: "Get away from the hazard.",

        description:
            "If there is a fire or significant smoke, prioritize getting to a safe location and contacting fire and rescue services.",

        emergency:
            "101",

        emergencyLabel:
            "📞 Fire & Rescue",

        steps: [

            "Leave the affected area if you can do so safely.",

            "Avoid entering a smoke-filled or burning area.",

            "Move away from the building or hazard and follow official instructions.",

            "Contact emergency fire and rescue services."
        ]

    },


    personal: {

        icon: "🚨",

        label: "PERSONAL SAFETY",

        title: "Move toward safety.",

        description:
            "If you feel threatened or unsafe, prioritize getting to a safer environment and contacting trusted people or emergency services when necessary.",

        emergency:
            "112",

        emergencyLabel:
            "📞 Emergency Help",

        steps: [

            "Move toward a populated or otherwise safer location if you can do so safely.",

            "Avoid confronting a person who may pose a danger.",

            "Contact a trusted person and let them know you need help.",

            "Contact emergency services if there is an immediate threat."
        ]

    },


    disaster: {

        icon: "🌊",

        label: "DISASTER SAFETY",

        title: "Follow official instructions.",

        description:
            "During floods, severe weather, earthquakes, or other disasters, move away from immediate hazards and follow instructions from local authorities.",

        emergency:
            "112",

        emergencyLabel:
            "📞 Emergency Help",

        steps: [

            "Move away from immediate hazards and unstable areas.",

            "Follow evacuation or shelter instructions from local authorities.",

            "Keep your phone available for official alerts.",

            "Avoid damaged structures, floodwater, and other unsafe areas."
        ]

    },


    other: {

        icon: "🛡️",

        label: "GENERAL SAFETY",

        title: "Prioritize your immediate safety.",

        description:
            "If you are unsure what to do, move away from immediate danger and seek help from a trusted person or appropriate official service.",

        emergency:
            "112",

        emergencyLabel:
            "📞 Emergency Help",

        steps: [

            "Identify the immediate hazard and move away from it if possible.",

            "Get to a safer environment or stay with people you trust.",

            "Contact the appropriate emergency service if the situation is urgent.",

            "Follow instructions from trained professionals or local authorities."
        ]

    }

};


/* =========================================================
   SAFETY HELPER
   ========================================================= */

function initializeSafetyHelper() {

    const helper =
        document.getElementById(
            "safetyHelper"
        );

    if (!helper) {
        return;
    }


    const question =
        document.getElementById(
            "safetyQuestion"
        );

    const result =
        document.getElementById(
            "safetyResult"
        );

    const progress =
        document.getElementById(
            "safetyProgressBar"
        );

    const stepLabel =
        document.getElementById(
            "safetyStepLabel"
        );

    const resultIcon =
        document.getElementById(
            "safetyResultIcon"
        );

    const resultLabel =
        document.getElementById(
            "safetyResultLabel"
        );

    const resultTitle =
        document.getElementById(
            "safetyResultTitle"
        );

    const resultDescription =
        document.getElementById(
            "safetyResultDescription"
        );

    const resultActions =
        document.getElementById(
            "safetyResultActions"
        );

    const stepsList =
        document.getElementById(
            "safetyStepsList"
        );

    const resetButton =
        document.getElementById(
            "safetyReset"
        );


    const options =
        document.querySelectorAll(
            ".safety-option"
        );


    function showGuidance(type) {

        const guidance =
            safetyGuidance[type];

        if (!guidance) {
            return;
        }


        /*
         * Update progress.
         */

        if (progress) {
            progress.style.width = "100%";
        }

        if (stepLabel) {
            stepLabel.textContent =
                "Step 2 of 2";
        }


        /*
         * Update result.
         */

        resultIcon.textContent =
            guidance.icon;

        resultLabel.textContent =
            guidance.label;

        resultTitle.textContent =
            guidance.title;

        resultDescription.textContent =
            guidance.description;


        /*
         * Emergency action.
         */

        resultActions.innerHTML = "";


        if (guidance.emergency) {

            const emergencyLink =
                document.createElement("a");

            emergencyLink.href =
                `tel:${guidance.emergency}`;

            emergencyLink.className =
                "safety-emergency-link";

            emergencyLink.textContent =
                `${guidance.emergencyLabel} — ${guidance.emergency}`;

            resultActions.appendChild(
                emergencyLink
            );

        }


        /*
         * General resource link.
         */

        const resourceLink =
            document.createElement("a");

        resourceLink.href =
            "#resources";

        resourceLink.className =
            "safety-info-link";

        resourceLink.textContent =
            "View Resources";

        resultActions.appendChild(
            resourceLink
        );


        /*
         * Build safety steps.
         */

        stepsList.innerHTML = "";


        guidance.steps.forEach(
            (step) => {

                const item =
                    document.createElement("li");

                item.textContent =
                    step;

                stepsList.appendChild(
                    item
                );

            }
        );


        /*
         * Switch screens.
         */

        question.classList.remove(
            "active"
        );

        result.classList.add(
            "visible"
        );


        result.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    }


    /*
     * Option clicks.
     */

    options.forEach(
        (option) => {

            option.addEventListener(
                "click",
                () => {

                    const type =
                        option.dataset.safetyType;

                    showGuidance(type);

                }
            );

        }
    );


    /*
     * Reset.
     */

    resetButton?.addEventListener(
        "click",
        () => {

            result.classList.remove(
                "visible"
            );

            question.classList.add(
                "active"
            );


            if (progress) {
                progress.style.width =
                    "50%";
            }

            if (stepLabel) {
                stepLabel.textContent =
                    "Step 1 of 2";
            }


            helper.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }
    );

}


/* =========================================================
   INITIALIZE V2.9
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeSafetyHelper();

        console.log(
            "LIFELINK V2.9 Safety Intelligence loaded."
        );

    }
);
                        copyButton.textContent =
                            "📋 Copy Information";

                    },
                    1500
                );

            } catch (error) {

                copyButton.textContent =
                    "Copy unavailable";

                setTimeout(
                    () => {

                        copyButton.textContent =
                            "📋 Copy Information";

                    },
                    1500
                );

            }

        }
    );

}


/* =========================================================
   CONNECT V2.8 TO EXISTING FILTERS
   ========================================================= */

function initializeResourceIntelligence() {

    const grid =
        document.getElementById(
            "resourceGrid"
        );

    if (!grid) {
        return;
    }


    /*
     * Update count whenever a filter/search
     * changes.
     */

    const search =
        document.getElementById(
            "resourceSearch"
        );

    const filters =
        document.querySelectorAll(
            ".resource-filter"
        );


    search?.addEventListener(
        "input",
        () => {

            setTimeout(
                updateResourceCount,
                0
            );

        }
    );


    filters.forEach(
        (filter) => {

            filter.addEventListener(
                "click",
                () => {

                    setTimeout(
                        updateResourceCount,
                        0
                    );

                }
            );

        }
    );


    updateResourceCount();

}


/* =========================================================
   INITIALIZE V2.8
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeResourceModal();

        initializeResourceIntelligence();

        console.log(
            "LIFELINK V2.8 Resource Intelligence loaded."
        );

    }
);
/* =========================================================
   LIFELINK V2.9 — SAFETY INTELLIGENCE
   ========================================================= */

const safetyGuidance = {

    medical: {
        icon: "🚑",
        label: "MEDICAL SAFETY",
        title: "Get appropriate medical help.",
        description:
            "If someone may have a serious or life-threatening medical problem, contact emergency medical services and follow the instructions of the emergency operator.",
        emergency: "108",
        emergencyLabel: "📞 Emergency Medical Help",
        steps: [
            "Move away from immediate hazards if it is safe to do so.",
            "Contact emergency medical services when the situation is urgent.",
            "Follow the instructions given by the emergency operator.",
            "Do not give medication or treatment unless it is appropriate and safe."
        ]
    },

    fire: {
        icon: "🔥",
        label: "FIRE SAFETY",
        title: "Get away from the hazard.",
        description:
            "If there is a fire or significant smoke, prioritize getting to a safe location and contacting fire and rescue services.",
        emergency: "101",
        emergencyLabel: "📞 Fire & Rescue",
        steps: [
            "Leave the affected area if you can do so safely.",
            "Avoid entering smoke-filled or burning areas.",
            "Move away from the building or hazard.",
            "Contact fire and rescue services."
        ]
    },

    personal: {
        icon: "🚨",
        label: "PERSONAL SAFETY",
        title: "Move toward safety.",
        description:
            "If you feel threatened or unsafe, prioritize getting to a safer environment and contacting trusted people.",
        emergency: "112",
        emergencyLabel: "📞 Emergency Help",
        steps: [
            "Move toward a safer location if possible.",
            "Avoid confronting someone who may pose a danger.",
            "Contact someone you trust.",
            "Contact emergency services if there is an immediate threat."
        ]
    },

    disaster: {
        icon: "🌊",
        label: "DISASTER SAFETY",
        title: "Follow official instructions.",
        description:
            "During floods, severe weather, earthquakes, or other disasters, move away from hazards and follow local authority instructions.",
        emergency: "112",
        emergencyLabel: "📞 Emergency Help",
        steps: [
            "Move away from immediate hazards.",
            "Follow evacuation or shelter instructions.",
            "Keep your phone available for official alerts.",
            "Avoid damaged structures and unsafe areas."
        ]
    },

    other: {
        icon: "🛡️",
        label: "GENERAL SAFETY",
        title: "Prioritize your immediate safety.",
        description:
            "If you are unsure what to do, move away from immediate danger and seek help from a trusted person or appropriate service.",
        emergency: "112",
        emergencyLabel: "📞 Emergency Help",
        steps: [
            "Identify the immediate hazard.",
            "Move to a safer environment.",
            "Contact the appropriate emergency service if necessary.",
            "Follow instructions from trained professionals."
        ]
    }
};


/* =========================================================
   INITIALIZE SAFETY INTELLIGENCE
   ========================================================= */

function initializeSafetyV29() {

    const options =
        document.querySelectorAll(".safety-option");

    const question =
        document.getElementById("safetyQuestion");

    const result =
        document.getElementById("safetyResult");

    const progress =
        document.getElementById("safetyProgressBar");

    const stepLabel =
        document.getElementById("safetyStepLabel");

    const resultIcon =
        document.getElementById("safetyResultIcon");

    const resultLabel =
        document.getElementById("safetyResultLabel");

    const resultTitle =
        document.getElementById("safetyResultTitle");

    const resultDescription =
        document.getElementById("safetyResultDescription");

    const resultActions =
        document.getElementById("safetyResultActions");

    const stepsList =
        document.getElementById("safetyStepsList");

    const resetButton =
        document.getElementById("safetyReset");


    /* Safety section isn't on this page yet */
    if (!options.length) {
        console.log(
            "LIFELINK V2.9 loaded — Safety section not found."
        );
        return;
    }


    /* =====================================================
       OPTION BUTTONS
       ===================================================== */

    options.forEach(option => {

        option.addEventListener("click", function () {

            const type =
                this.dataset.safetyType;

            const data =
                safetyGuidance[type];

            if (!data) return;


            resultIcon.textContent =
                data.icon;

            resultLabel.textContent =
                data.label;

            resultTitle.textContent =
                data.title;

            resultDescription.textContent =
                data.description;


            /* Emergency button */

            resultActions.innerHTML = `
                <a
                    href="tel:${data.emergency}"
                    class="safety-emergency-link"
                >
                    ${data.emergencyLabel} — ${data.emergency}
                </a>

                <a
                    href="#resources"
                    class="safety-info-link"
                >
                    View Resources
                </a>
            `;


            /* Safety steps */

            stepsList.innerHTML = "";

            data.steps.forEach(step => {

                const li =
                    document.createElement("li");

                li.textContent = step;

                stepsList.appendChild(li);

            });


            /* Switch screen */

            question.classList.remove("active");

            result.classList.add("visible");


            progress.style.width = "100%";

            stepLabel.textContent =
                "Step 2 of 2";

        });

    });


    /* =====================================================
       RESET BUTTON
       ===================================================== */

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            function () {

                result.classList.remove(
                    "visible"
                );

                question.classList.add(
                    "active"
                );

                progress.style.width =
                    "50%";

                stepLabel.textContent =
                    "Step 1 of 2";

            }
        );

    }


    console.log(
        "LIFELINK V2.9 Safety Intelligence loaded."
    );
}


/* =========================================================
   START V2.9
   ========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeSafetyV29
    );

} else {

    initializeSafetyV29();

}
