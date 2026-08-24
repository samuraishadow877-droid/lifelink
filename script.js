```javascript
// ==========================================
// SPACE EXPLORER V2.4
// FILE 3 — script.js
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ---------- ELEMENTS ----------
    const map = document.getElementById("spaceMap");
    const guideBtn = document.getElementById("guideBtn");
    const upgradeBtn = document.getElementById("upgradeBtn");
    const searchInput = document.getElementById("searchInput");

    // ---------- SPACE LOCATIONS ----------
    const locations = [
        {
            name: "Sun",
            type: "Star",
            x: 50,
            y: 50,
            description:
                "The Sun is the star at the center of our Solar System. Almost all the energy reaching Earth comes from the Sun."
        },
        {
            name: "Mercury",
            type: "Planet",
            x: 58,
            y: 50,
            description:
                "Mercury is the closest planet to the Sun and the smallest planet in the Solar System."
        },
        {
            name: "Venus",
            type: "Planet",
            x: 64,
            y: 50,
            description:
                "Venus is the hottest planet in our Solar System because of its powerful greenhouse effect."
        },
        {
            name: "Earth",
            type: "Planet",
            x: 70,
            y: 50,
            description:
                "Earth is our home planet and the only known world with life."
        },
        {
            name: "Mars",
            type: "Planet",
            x: 76,
            y: 50,
            description:
                "Mars is known as the Red Planet because iron minerals on its surface give it a reddish appearance."
        },
        {
            name: "Jupiter",
            type: "Planet",
            x: 84,
            y: 50,
            description:
                "Jupiter is the largest planet in the Solar System."
        },
        {
            name: "Saturn",
            type: "Planet",
            x: 91,
            y: 50,
            description:
                "Saturn is famous for its spectacular system of icy rings."
        },
        {
            name: "Milky Way",
            type: "Galaxy",
            x: 35,
            y: 25,
            description:
                "The Milky Way is the galaxy containing our Solar System."
        },
        {
            name: "Andromeda",
            type: "Galaxy",
            x: 20,
            y: 20,
            description:
                "Andromeda is the nearest major galaxy to the Milky Way."
        },
        {
            name: "Sagittarius A*",
            type: "Black Hole",
            x: 35,
            y: 70,
            description:
                "Sagittarius A* is the supermassive black hole located at the center of the Milky Way."
        }
    ];


    // ---------- CREATE MAP ----------
    function createMap() {

        if (!map) {
            console.warn("Map element not found.");
            return;
        }

        map.innerHTML = "";

        locations.forEach((location, index) => {

            const marker = document.createElement("button");

            marker.className = "space-marker";
            marker.dataset.name = location.name.toLowerCase();

            marker.style.left = `${location.x}%`;
            marker.style.top = `${location.y}%`;

            marker.innerHTML = `
                <span class="marker-dot"></span>
                <span class="marker-label">${location.name}</span>
            `;

            marker.addEventListener("click", () => {
                openLocation(location);
            });

            map.appendChild(marker);
        });
    }


    // ---------- LOCATION PANEL ----------
    function openLocation(location) {

        let panel = document.getElementById("locationPanel");

        if (!panel) {

            panel = document.createElement("div");

            panel.id = "locationPanel";
            panel.className = "location-panel";

            document.body.appendChild(panel);
        }

        panel.innerHTML = `
            <div class="location-content">

                <button class="close-location" id="closeLocation">
                    ✕
                </button>

                <div class="location-type">
                    ${location.type}
                </div>

                <h2>${location.name}</h2>

                <p>${location.description}</p>

                <button class="explore-location">
                    🚀 Explore ${location.name}
                </button>

            </div>
        `;

        panel.classList.add("show");

        document
            .getElementById("closeLocation")
            .addEventListener("click", () => {
                panel.classList.remove("show");
            });

        const exploreButton =
            panel.querySelector(".explore-location");

        exploreButton.addEventListener("click", () => {

            alert(
                `🚀 Exploration mode activated for ${location.name}!`
            );

        });
    }


    // ---------- SEARCH ----------
    function searchSpace() {

        if (!searchInput) return;

        const query =
            searchInput.value.trim().toLowerCase();

        const markers =
            document.querySelectorAll(".space-marker");

        markers.forEach(marker => {

            const name =
                marker.dataset.name;

            if (!query || name.includes(query)) {

                marker.style.display = "block";

                if (query && name === query) {
                    marker.classList.add("highlight");
                } else {
                    marker.classList.remove("highlight");
                }

            } else {

                marker.style.display = "none";
            }
        });
    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            searchSpace
        );
    }


    // ---------- GUIDE ----------
    if (guideBtn) {

        guideBtn.addEventListener("click", () => {

            const guide =
                document.getElementById("guidePanel");

            if (guide) {

                guide.classList.toggle("show");

            } else {

                showGuide();
            }
        });
    }


    function showGuide() {

        const guide = document.createElement("div");

        guide.id = "guidePanel";

        guide.innerHTML = `
            <div class="guide-box">

                <button id="closeGuide">
                    ✕
                </button>

                <h2>🧭 Space Explorer Guide</h2>

                <p>
                    Welcome to Space Explorer!
                    Click any object on the map to learn more.
                </p>

                <div class="guide-step">
                    <strong>1️⃣ Explore</strong>
                    <span>Click a glowing marker.</span>
                </div>

                <div class="guide-step">
                    <strong>2️⃣ Search</strong>
                    <span>Use the search box to find objects.</span>
                </div>

                <div class="guide-step">
                    <strong>3️⃣ Discover</strong>
                    <span>Open different locations and learn about them.</span>
                </div>

                <div class="guide-step">
                    <strong>4️⃣ Upgrade</strong>
                    <span>Unlock more features in future versions.</span>
                </div>

            </div>
        `;

        document.body.appendChild(guide);

        requestAnimationFrame(() => {
            guide.classList.add("show");
        });

        document
            .getElementById("closeGuide")
            .addEventListener("click", () => {

                guide.classList.remove("show");

                setTimeout(() => {
                    guide.remove();
                }, 300);
            });
    }


    // ---------- UPGRADE ----------
    if (upgradeBtn) {

        upgradeBtn.addEventListener("click", () => {

            showUpgradeMessage();

        });
    }


    function showUpgradeMessage() {

        const existing =
            document.getElementById("upgradeMessage");

        if (existing) {
            existing.remove();
        }

        const box =
            document.createElement("div");

        box.id = "upgradeMessage";

        box.innerHTML = `
            <div class="upgrade-box">

                <button id="closeUpgrade">
                    ✕
                </button>

                <div class="upgrade-icon">
                    🚀
                </div>

                <h2>Coming Soon</h2>

                <p>
                    Advanced Space Explorer features
                    are being developed.
                </p>

                <ul>
                    <li>🌌 More galaxies</li>
                    <li>🕳️ More black holes</li>
                    <li>🪐 Detailed planetary systems</li>
                    <li>🔭 Deep-space exploration</li>
                    <li>⭐ Interactive missions</li>
                </ul>

            </div>
        `;

        document.body.appendChild(box);

        requestAnimationFrame(() => {
            box.classList.add("show");
        });

        document
            .getElementById("closeUpgrade")
            .addEventListener("click", () => {

                box.classList.remove("show");

                setTimeout(() => {
                    box.remove();
                }, 300);
            });
    }


    // ---------- MAP DRAGGING ----------
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;

    if (map) {

        map.addEventListener("pointerdown", (event) => {

            if (
                event.target.closest(".space-marker")
            ) return;

            isDragging = true;

            startX =
                event.clientX - offsetX;

            startY =
                event.clientY - offsetY;

            map.setPointerCapture(event.pointerId);

        });


        map.addEventListener("pointermove", (event) => {

            if (!isDragging) return;

            offsetX =
                event.clientX - startX;

            offsetY =
                event.clientY - startY;

            map.style.transform =
                `translate(${offsetX}px, ${offsetY}px)`;

        });


        map.addEventListener("pointerup", () => {

            isDragging = false;

        });


        map.addEventListener("pointercancel", () => {

            isDragging = false;

        });
    }


    // ---------- ESCAPE KEY ----------
    document.addEventListener("keydown", (event) => {

        if (event.key !== "Escape") return;

        const locationPanel =
            document.getElementById("locationPanel");

        const guidePanel =
            document.getElementById("guidePanel");

        const upgradeMessage =
            document.getElementById("upgradeMessage");

        if (locationPanel) {
            locationPanel.classList.remove("show");
        }

        if (guidePanel) {
            guidePanel.remove();
        }

        if (upgradeMessage) {
            upgradeMessage.remove();
        }
    });


    // ---------- INITIALIZE ----------
    createMap();

    console.log(
        "🚀 Space Explorer V2.4 loaded successfully!"
    );

});
```
