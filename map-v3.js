/* =========================================================
   LIFELINK V3.0 — ISOLATED MAP ENGINE
   MapLibre GL JS + OpenFreeMap
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIGURATION
       ===================================================== */

    const MAP_CONTAINER_ID = "lifelinkMap";

    const DEFAULT_CENTER = [72.8777, 19.0760]; // Mumbai

    const DEFAULT_ZOOM = 10;


    /*
       OpenFreeMap style.

       No API key required.
    */

    const MAP_STYLE =
        "https://tiles.openfreemap.org/styles/liberty";


    /* =====================================================
       DOM ELEMENTS
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
            "LIFELINK V3.0: Map container not found."
        );

        return;
    }


    /* =====================================================
       STATUS HELPER
       ===================================================== */

    function setStatus(message) {

        if (statusElement) {
            statusElement.textContent = message;
        }

    }


    setStatus("🗺️ Loading map...");


    /* =====================================================
       LOAD MAPLIBRE
       ===================================================== */

    function loadMapLibre() {

        return new Promise(function (resolve, reject) {

            /*
               Already loaded?
            */

            if (window.maplibregl) {

                resolve();

                return;
            }


            /*
               CSS
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
               JavaScript
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
       CREATE MAP
       ===================================================== */

    function createMap() {

        const map =
            new maplibregl.Map({

                container: MAP_CONTAINER_ID,

                style: MAP_STYLE,

                center: DEFAULT_CENTER,

                zoom: DEFAULT_ZOOM,

                attributionControl: true

            });


        /* Navigation controls */

        map.addControl(
            new maplibregl.NavigationControl(),
            "top-right"
        );


        /* =================================================
           MAP LOAD
           ================================================= */

        map.on("load", function () {

            setStatus(
                "🟢 Map loaded. Explore the area or use My Location."
            );

            console.log(
                "LIFELINK V3.0 Map loaded successfully."
            );

        });


        /* =================================================
           MAP ERROR
           ================================================= */

        map.on("error", function (event) {

            console.error(
                "LIFELINK V3.0 Map error:",
                event
            );

            /*
               Don't destroy the rest of LIFELINK.
            */

            setStatus(
                "⚠️ Some map data could not be loaded."
            );

        });


        return map;

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

                /*
                   Nominatim / OpenStreetMap geocoding.

                   This is deliberately kept separate
                   from the map renderer.
                */

                const url =
                    "https://nominatim.openstreetmap.org/search" +
                    "?format=jsonv2" +
                    "&limit=1" +
                    "&q=" +
                    encodeURIComponent(query);


                const response =
                    await fetch(url, {
                        headers: {
                            "Accept":
                                "application/json"
                        }
                    });


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
                        }).setHTML(`
                            <div class="map-popup-title">
                                ${escapeHTML(result.display_name)}
                            </div>

                            <p class="map-popup-location">
                                Search result
                            </p>
                        `)
                    )
                    .addTo(map);


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
       LOCATION
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
                                }).setHTML(`
                                    <div class="map-popup-title">
                                        📍 Your Location
                                    </div>

                                    <p class="map-popup-location">
                                        Your browser provided this location.
                                    </p>
                                `)
                            )
                            .addTo(map)
                            .togglePopup();


                        setStatus(
                            "📍 Your location is shown on the map."
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
       FILTERS
       ===================================================== */

    function setupFilters() {

        filterButtons.forEach(function (button) {

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


                    const filter =
                        this.dataset.mapFilter;


                    setStatus(
                        filter === "all"
                            ? "🗺️ Showing all map resources."
                            : "🗺️ Showing " +
                              filter +
                              " resources."
                    );

                }
            );

        });

    }


    /* =====================================================
       BASIC HTML ESCAPING
       ===================================================== */

    function escapeHTML(value) {

        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* =====================================================
       START MAP
       ===================================================== */

    loadMapLibre()

        .then(function () {

            const map =
                createMap();


            setupSearch(map);

            setupLocation(map);

            setupFilters();

        })

        .catch(function (error) {

            console.error(
                "LIFELINK V3.0 failed to initialize:",
                error
            );


            setStatus(
                "⚠️ Map could not be loaded. LIFELINK remains available."
            );

        });


})();
