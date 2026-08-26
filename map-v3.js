```javascript
/* =========================================================
   LIFELINK V3.1 — RESOURCE INTELLIGENCE MAP
   MapLibre GL JS + OpenFreeMap
   ========================================================= */

(function () {

    "use strict";

    /* =====================================================
       CONFIG
       ===================================================== */

    const MAP_CONTAINER_ID = "lifelinkMap";

    const DEFAULT_CENTER = [72.8777, 19.0760]; // Mumbai

    const DEFAULT_ZOOM = 11;

    const MAP_STYLE =
        "https://tiles.openfreemap.org/styles/liberty";


    /* =====================================================
       RESOURCE DATA
       ===================================================== */

    /*
       IMPORTANT:

       These are demonstration resource locations for the
       LIFELINK prototype.

       They are NOT claiming to be the exact locations of
       official emergency facilities.

       Real verified data can be connected later.
    */

    const resources = [

        {
            id: "hospital-1",
            name: "LIFELINK Medical Point",
            category: "hospital",
            icon: "🏥",
            latitude: 19.0760,
            longitude: 72.8777,
            location: "Mumbai",
            service: "Emergency medical assistance"
        },

        {
            id: "hospital-2",
            name: "LIFELINK Hospital Resource",
            category: "hospital",
            icon: "🏥",
            latitude: 19.0178,
            longitude: 72.8478,
            location: "Mumbai",
            service: "Medical emergency resource"
        },

        {
            id: "pharmacy-1",
            name: "LIFELINK Pharmacy Point",
            category: "pharmacy",
            icon: "💊",
            latitude: 19.1136,
            longitude: 72.8697,
            location: "Mumbai",
            service: "Pharmacy resource"
        },

        {
            id: "police-1",
            name: "LIFELINK Police Resource",
            category: "police",
            icon: "🚓",
            latitude: 19.0330,
            longitude: 73.0297,
            location: "Mumbai Region",
            service: "Police assistance resource"
        },

        {
            id: "fire-1",
            name: "LIFELINK Fire Resource",
            category: "fire",
            icon: "🚒",
            latitude: 19.2183,
            longitude: 72.9781,
            location: "Mumbai Region",
            service: "Fire and rescue resource"
        },

        {
            id: "government-1",
            name: "LIFELINK Government Resource",
            category: "government",
            icon: "🏛️",
            latitude: 19.2183,
            longitude: 72.9781,
            location: "Mumbai Region",
            service: "Public government resource"
        },

        {
            id: "shelter-1",
            name: "LIFELINK Safety Shelter",
            category: "shelter",
            icon: "🏠",
            latitude: 19.0825,
            longitude: 72.8811,
            location: "Mumbai",
            service: "Safety shelter resource"
        }

    ];


    /* =====================================================
       DOM
       ===================================================== */

    const mapContainer =
        document.getElementById(MAP_CONTAINER_ID);

    const statusElement =
        document.getElementById("lifelinkMapStatus");

    const searchInput =
        document.getElementById("lifelinkMapSearch");

    const searchButton =
        document.getElementById("lifelinkMapSearchButton");

    const locationButton =
        document.getElementById("lifelinkMyLocation");

    const filterButtons =
        document.querySelectorAll(".map-filter");


    /* =====================================================
       SAFETY CHECK
       ===================================================== */

    if (!mapContainer) {

        console.warn(
            "LIFELINK V3.1: Map container not found."
        );

        return;
    }


    /* =====================================================
       STATUS
       ===================================================== */

    function setStatus(message) {

        if (statusElement) {
            statusElement.textContent = message;
        }

    }


    setStatus("🗺️ Loading LIFELINK map...");


    /* =====================================================
       LOAD MAPLIBRE
       ===================================================== */

    function loadMapLibre() {

        return new Promise(function (resolve, reject) {

            if (window.maplibregl) {

                resolve();

                return;
            }


            /*
               Load MapLibre CSS
            */

            if (
                !document.querySelector(
                    'link[data-lifelink-maplibre="css"]'
                )
            ) {

                const css =
                    document.createElement("link");

                css.rel = "stylesheet";

                css.href =
                    "https://unpkg.com/maplibre-gl@5.6.2/dist/maplibre-gl.css";

                css.dataset.lifelinkMaplibre =
                    "css";

                document.head.appendChild(css);
            }


            /*
               Load MapLibre JavaScript
            */

            const script =
                document.createElement("script");

            script.src =
                "https://unpkg.com/maplibre-gl@5.6.2/dist/maplibre-gl.js";

            script.dataset.lifelinkMaplibre =
                "js";


            script.onload = function () {

                if (window.maplibregl) {

                    resolve();

                } else {

                    reject(
                        new Error(
                            "MapLibre loaded but was not found."
                        )
                    );

                }

            };


            script.onerror = function () {

                reject(
                    new Error(
                        "Could not load MapLibre GL JS."
                    )
                );

            };


            document.head.appendChild(script);

        });

    }


    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       POPUP HTML
       ===================================================== */

  function createPopup(resource) {

    return `
        <div class="map-popup">

            <div class="map-popup-category">
                ${resource.icon}
                ${escapeHTML(resource.category)}
            </div>

            <div class="map-popup-title">
                ${escapeHTML(resource.name)}
            </div>

            <p class="map-popup-location">
                📍 ${escapeHTML(resource.location)}
            </p>

            <p class="map-popup-location">
                🛠️ ${escapeHTML(resource.service)}
            </p>

            <p class="map-popup-location">
                ℹ️ Prototype resource location
            </p>

        </div>
    `;

}
    /* =====================================================
       CREATE MARKER
       ===================================================== */

    function createMarker(map, resource) {

        const markerElement =
            document.createElement("div");

        markerElement.className =
            "lifelink-map-marker";

        markerElement.dataset.category =
            resource.category;

        markerElement.setAttribute(
            "aria-label",
            resource.name
        );

        markerElement.innerHTML =
            resource.icon;


        markerElement.style.cssText = `
            width: 42px;
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: rgba(5, 7, 11, 0.94);
            border: 2px solid rgba(255,255,255,0.85);
            box-shadow: 0 5px 18px rgba(0,0,0,0.4);
            font-size: 21px;
            cursor: pointer;
            user-select: none;
        `;


        const marker =
            new maplibregl.Marker({
                element: markerElement,
                anchor: "center"
            })
            .setLngLat([
                resource.longitude,
                resource.latitude
            ])
            .setPopup(
                new maplibregl.Popup({
                    offset: 25,
                    closeButton: true,
                    closeOnClick: false
                })
                .setHTML(
                    createPopup(resource)
                )
            )
            .addTo(map);


        return {
            resource: resource,
            marker: marker,
            element: markerElement
        };

    }


    /* =====================================================
       CREATE ALL MARKERS
       ===================================================== */

    function createMarkers(map) {

        return resources.map(function (resource) {

            return createMarker(
                map,
                resource
            );

        });

    }


    /* =====================================================
       FILTER MARKERS
       ===================================================== */

    function filterMarkers(
        markerObjects,
        category
    ) {

        markerObjects.forEach(
            function (item) {

                const shouldShow =
                    category === "all" ||
                    item.resource.category === category;


                item.element.style.display =
                    shouldShow
                        ? "flex"
                        : "none";

            }
        );


        if (category === "all") {

            setStatus(
                "🗺️ Showing all emergency resources."
            );

        } else {

            const visibleCount =
                markerObjects.filter(
                    function (item) {

                        return (
                            item.resource.category ===
                            category
                        );

                    }
                ).length;


            setStatus(
                "📍 Showing " +
                visibleCount +
                " " +
                category +
                " resource" +
                (visibleCount === 1 ? "" : "s") +
                "."
            );

        }

    }


    /* =====================================================
       FILTER BUTTONS
       ===================================================== */

    function setupFilters(markerObjects) {

        filterButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        filterButtons.forEach(
                            function (item) {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        this.classList.add(
                            "active"
                        );


                        const category =
                            this.dataset.mapFilter ||
                            "all";


                        filterMarkers(
                            markerObjects,
                            category
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       SEARCH
       ===================================================== */

    function setupSearch(map) {

        if (!searchButton || !searchInput) {
            return;
        }


        async function searchPlace() {

            const query =
                searchInput.value.trim();


            if (!query) {

                setStatus(
                    "🔎 Enter a place to search."
                );

                return;
            }


            setStatus(
                "🔎 Searching..."
            );


            try {

                const url =
                    "https://nominatim.openstreetmap.org/search" +
                    "?format=jsonv2" +
                    "&limit=1" +
                    "&q=" +
                    encodeURIComponent(query);


                const response =
                    await fetch(url);


                if (!response.ok) {

                    throw new Error(
                        "Search request failed."
                    );

                }


                const results =
                    await response.json();


                if (!results.length) {

                    setStatus(
                        "❌ No matching place found."
                    );

                    return;
                }


                const result =
                    results[0];


                const longitude =
                    Number(result.lon);

                const latitude =
                    Number(result.lat);


                map.flyTo({

                    center: [
                        longitude,
                        latitude
                    ],

                    zoom: 14,

                    speed: 1.2

                });


                new maplibregl.Marker()
                    .setLngLat([
                        longitude,
                        latitude
                    ])
                    .setPopup(
                        new maplibregl.Popup({
                            offset: 25
                        })
                        .setHTML(`
                            <div class="map-popup-title">
                                📍 ${escapeHTML(
                                    result.display_name
                                )}
                            </div>

                            <p class="map-popup-location">
                                Search result
                            </p>
                        `)
                    )
                    .addTo(map)
                    .togglePopup();


                setStatus(
                    "📍 Showing: " +
                    result.display_name
                );


            } catch (error) {

                console.error(
                    "LIFELINK search error:",
                    error
                );


                setStatus(
                    "⚠️ Search could not be completed."
                );

            }

        }


        searchButton.addEventListener(
            "click",
            searchPlace
        );


        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    searchPlace();

                }

            }
        );

    }


    /* =====================================================
       USER LOCATION
       ===================================================== */

    function setupLocation(map) {

        if (!locationButton) {
            return;
        }


        locationButton.addEventListener(
            "click",
            function () {

                if (!navigator.geolocation) {

                    setStatus(
                        "❌ Your browser does not support location."
                    );

                    return;
                }


                setStatus(
                    "📍 Requesting your location..."
                );


                navigator.geolocation.getCurrentPosition(

                    function (position) {

                        const longitude =
                            position.coords.longitude;

                        const latitude =
                            position.coords.latitude;


                        map.flyTo({

                            center: [
                                longitude,
                                latitude
                            ],

                            zoom: 15,

                            speed: 1.2

                        });


                        new maplibregl.Marker({
                            color: "#ffffff"
                        })
                        .setLngLat([
                            longitude,
                            latitude
                        ])
                        .setPopup(
                            new maplibregl.Popup({
                                offset: 25
                            })
                            .setHTML(`
                                <div class="map-popup-title">
                                    📍 Your Location
                                </div>

                                <p class="map-popup-location">
                                    Location provided by your browser.
                                </p>
                            `)
                        )
                        .addTo(map)
                        .togglePopup();


                        setStatus(
                            "📍 Your location is shown."
                        );

                    },


                    function (error) {

                        console.warn(
                            "Location error:",
                            error
                        );


                        if (
                            error.code ===
                            error.PERMISSION_DENIED
                        ) {

                            setStatus(
                                "⚠️ Location permission was denied."
                            );

                        } else {

                            setStatus(
                                "⚠️ Unable to determine your location."
                            );

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


    /* =====================================================
       INITIALIZE MAP
       ===================================================== */

    function initializeMap() {

        const map =
            new maplibregl.Map({

                container:
                    MAP_CONTAINER_ID,

                style:
                    MAP_STYLE,

                center:
                    DEFAULT_CENTER,

                zoom:
                    DEFAULT_ZOOM,

                attributionControl:
                    true

            });


        map.addControl(
            new maplibregl.NavigationControl(),
            "top-right"
        );


        map.on(
            "load",
            function () {

                /*
                   Create resource markers only after
                   the map has loaded.
                */

                const markerObjects =
                    createMarkers(map);


                /*
                   Activate filter system.
                */

                setupFilters(
                    markerObjects
                );


                /*
                   Search.
                */

                setupSearch(
                    map
                );


                /*
                   Location.
                */

                setupLocation(
                    map
                );


                /*
                   Initial state.
                */

                filterMarkers(
                    markerObjects,
                    "all"
                );


                setStatus(
                    "🟢 Map ready — emergency resources loaded."
                );


                console.log(
                    "LIFELINK V3.1 initialized.",
                    resources
                );

            }
        );


        map.on(
            "error",
            function (event) {

                console.error(
                    "LIFELINK V3.1 map error:",
                    event
                );


                setStatus(
                    "⚠️ Some map data could not be loaded."
                );

            }
        );

    }


    /* =====================================================
       START
       ===================================================== */

    loadMapLibre()

        .then(
            function () {

                initializeMap();

            }
        )

        .catch(
            function (error) {

                console.error(
                    "LIFELINK V3.1 initialization failed:",
                    error
                );


                setStatus(
                    "⚠️ Map could not be loaded."
                );

            }
        );


})();
```
