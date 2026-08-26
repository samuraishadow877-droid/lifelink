
(function () {

    "use strict";

    /* =====================================================
       LIFELINK V3.2 — CLEAN MAP MODULE
       MapLibre GL JS + OpenFreeMap
       ===================================================== */

    var MAP_ID = "lifelinkMap";

    var MAP_STYLE =
        "https://tiles.openfreemap.org/styles/liberty";

    var CENTER = [72.8777, 19.0760];

    var ZOOM = 11;


    /* =====================================================
       RESOURCE DATA
       ===================================================== */

    var resources = [

        {
            name: "LIFELINK Medical Point",
            category: "hospital",
            icon: "🏥",
            lat: 19.0760,
            lng: 72.8777,
            location: "Mumbai",
            service: "Emergency medical resource"
        },

        {
            name: "LIFELINK Hospital Resource",
            category: "hospital",
            icon: "🏥",
            lat: 19.0178,
            lng: 72.8478,
            location: "Mumbai",
            service: "Medical emergency resource"
        },

        {
            name: "LIFELINK Pharmacy Point",
            category: "pharmacy",
            icon: "💊",
            lat: 19.1136,
            lng: 72.8697,
            location: "Mumbai",
            service: "Pharmacy resource"
        },

        {
            name: "LIFELINK Police Resource",
            category: "police",
            icon: "🚓",
            lat: 19.0330,
            lng: 73.0297,
            location: "Mumbai Region",
            service: "Police assistance resource"
        },

        {
            name: "LIFELINK Fire Resource",
            category: "fire",
            icon: "🚒",
            lat: 19.2183,
            lng: 72.9781,
            location: "Mumbai Region",
            service: "Fire and rescue resource"
        },

        {
            name: "LIFELINK Government Resource",
            category: "government",
            icon: "🏛️",
            lat: 19.2183,
            lng: 72.9781,
            location: "Mumbai Region",
            service: "Public government resource"
        },

        {
            name: "LIFELINK Safety Shelter",
            category: "shelter",
            icon: "🏠",
            lat: 19.0825,
            lng: 72.8811,
            location: "Mumbai",
            service: "Safety shelter resource"
        }

    ];


    /* =====================================================
       FIND ELEMENTS
       ===================================================== */

    var mapElement =
        document.getElementById(MAP_ID);

    var statusElement =
        document.getElementById("lifelinkMapStatus");

    var searchInput =
        document.getElementById("lifelinkMapSearch");

    var searchButton =
        document.getElementById("lifelinkMapSearchButton");

    var locationButton =
        document.getElementById("lifelinkMyLocation");

    var filterButtons =
        document.querySelectorAll(".map-filter");


    /* =====================================================
       STATUS
       ===================================================== */

    function status(message) {

        if (statusElement) {
            statusElement.textContent = message;
        }

    }


    /* =====================================================
       SAFETY CHECK
       ===================================================== */

    if (!mapElement) {

        console.error(
            "LIFELINK V3.2: #lifelinkMap was not found."
        );

        return;
    }


    status("Loading map...");


    /* =====================================================
       LOAD MAPLIBRE CSS
       ===================================================== */

    function loadCSS() {

        if (
            document.querySelector(
                "link[data-lifelink-maplibre]"
            )
        ) {
            return;
        }

        var link =
            document.createElement("link");

        link.rel = "stylesheet";

        link.href =
            "https://unpkg.com/maplibre-gl@5.6.2/dist/maplibre-gl.css";

        link.dataset.lifelinkMaplibre = "true";

        document.head.appendChild(link);

    }


    /* =====================================================
       LOAD MAPLIBRE JS
       ===================================================== */

    function loadMapLibre() {

        return new Promise(function (resolve, reject) {

            if (window.maplibregl) {

                resolve();

                return;
            }

            var existing =
                document.querySelector(
                    "script[data-lifelink-maplibre]"
                );

            if (existing) {

                existing.addEventListener(
                    "load",
                    function () {

                        if (window.maplibregl) {
                            resolve();
                        } else {
                            reject(
                                new Error(
                                    "MapLibre failed to initialize."
                                )
                            );
                        }

                    }
                );

                existing.addEventListener(
                    "error",
                    function () {

                        reject(
                            new Error(
                                "MapLibre script failed to load."
                            )
                        );

                    }
                );

                return;
            }

            var script =
                document.createElement("script");

            script.src =
                "https://unpkg.com/maplibre-gl@5.6.2/dist/maplibre-gl.js";

            script.dataset.lifelinkMaplibre =
                "true";

            script.onload = function () {

                if (window.maplibregl) {

                    resolve();

                } else {

                    reject(
                        new Error(
                            "MapLibre loaded but maplibregl is unavailable."
                        )
                    );

                }

            };

            script.onerror = function () {

                reject(
                    new Error(
                        "Could not download MapLibre."
                    )
                );

            };

            document.head.appendChild(script);

        });

    }


    /* =====================================================
       CREATE POPUP
       ===================================================== */

    function createPopup(resource) {

        var wrapper =
            document.createElement("div");

        wrapper.className =
            "map-popup";


        var category =
            document.createElement("div");

        category.className =
            "map-popup-category";

        category.textContent =
            resource.icon +
            " " +
            resource.category;


        var title =
            document.createElement("div");

        title.className =
            "map-popup-title";

        title.textContent =
            resource.name;


        var location =
            document.createElement("p");

        location.className =
            "map-popup-location";

        location.textContent =
            "📍 " +
            resource.location;


        var service =
            document.createElement("p");

        service.className =
            "map-popup-location";

        service.textContent =
            "🛠️ " +
            resource.service;


        var note =
            document.createElement("p");

        note.className =
            "map-popup-location";

        note.textContent =
            "ℹ️ Prototype resource location";


        wrapper.appendChild(category);

        wrapper.appendChild(title);

        wrapper.appendChild(location);

        wrapper.appendChild(service);

        wrapper.appendChild(note);


        return wrapper;

    }


    /* =====================================================
       CREATE MARKER
       ===================================================== */

    function createMarker(map, resource) {

        var element =
            document.createElement("button");

        element.type = "button";

        element.className =
            "lifelink-map-marker";

        element.textContent =
            resource.icon;

        element.setAttribute(
            "aria-label",
            resource.name
        );

        element.style.width = "42px";

        element.style.height = "42px";

        element.style.borderRadius = "50%";

        element.style.border =
            "2px solid rgba(255,255,255,0.9)";

        element.style.background =
            "rgba(5,7,11,0.95)";

        element.style.display =
            "flex";

        element.style.alignItems =
            "center";

        element.style.justifyContent =
            "center";

        element.style.fontSize =
            "20px";

        element.style.cursor =
            "pointer";


        var popup =
            new maplibregl.Popup({
                offset: 25,
                closeButton: true,
                closeOnClick: false
            });


        popup.setDOMContent(
            createPopup(resource)
        );


        var marker =
            new maplibregl.Marker({
                element: element,
                anchor: "center"
            })
            .setLngLat([
                resource.lng,
                resource.lat
            ])
            .setPopup(popup)
            .addTo(map);


        return {
            resource: resource,
            marker: marker,
            element: element
        };

    }


    /* =====================================================
       CREATE MARKERS
       ===================================================== */

    function createMarkers(map) {

        var markerObjects = [];

        resources.forEach(
            function (resource) {

                markerObjects.push(
                    createMarker(
                        map,
                        resource
                    )
                );

            }
        );

        return markerObjects;

    }


    /* =====================================================
       FILTER MARKERS
       ===================================================== */

    function filterMarkers(
        markerObjects,
        category
    ) {

        var visible = 0;


        markerObjects.forEach(
            function (item) {

                var show =
                    category === "all" ||
                    item.resource.category === category;


                item.element.style.display =
                    show ? "flex" : "none";


                if (show) {
                    visible++;
                }

            }
        );


        if (category === "all") {

            status(
                "🟢 Showing all " +
                visible +
                " resources."
            );

        } else {

            status(
                "📍 Showing " +
                visible +
                " " +
                category +
                " resources."
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


                        button.classList.add(
                            "active"
                        );


                        var category =
                            button.dataset.mapFilter ||
                            button.dataset.category ||
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

        if (!searchInput) {
            return;
        }


        function searchPlace() {

            var query =
                searchInput.value.trim();


            if (!query) {

                status(
                    "🔎 Enter a place to search."
                );

                return;

            }


            status(
                "🔎 Searching..."
            );


            var url =
                "https://nominatim.openstreetmap.org/search" +
                "?format=jsonv2" +
                "&limit=1" +
                "&q=" +
                encodeURIComponent(query);


            fetch(url)

                .then(
                    function (response) {

                        if (!response.ok) {

                            throw new Error(
                                "Search request failed."
                            );

                        }

                        return response.json();

                    }
                )

                .then(
                    function (results) {

                        if (!results.length) {

                            status(
                                "❌ No matching place found."
                            );

                            return;

                        }


                        var result =
                            results[0];


                        var lng =
                            Number(result.lon);

                        var lat =
                            Number(result.lat);


                        map.flyTo({
                            center: [
                                lng,
                                lat
                            ],
                            zoom: 14,
                            speed: 1.2
                        });


                        var marker =
                            new maplibregl.Marker()
                            .setLngLat([
                                lng,
                                lat
                            ])
                            .setPopup(
                                new maplibregl.Popup({
                                    offset: 25
                                })
                            )
                            .addTo(map);


                        var popup =
                            document.createElement("div");

                        popup.className =
                            "map-popup";


                        var title =
                            document.createElement("div");

                        title.className =
                            "map-popup-title";

                        title.textContent =
                            "📍 " +
                            result.display_name;


                        var text =
                            document.createElement("p");

                        text.className =
                            "map-popup-location";

                        text.textContent =
                            "Search result";


                        popup.appendChild(title);

                        popup.appendChild(text);


                        marker
                            .getPopup()
                            .setDOMContent(popup)
                            .addTo(map);


                        status(
                            "📍 Showing: " +
                            result.display_name
                        );

                    }
                )

                .catch(
                    function (error) {

                        console.error(
                            "LIFELINK search error:",
                            error
                        );


                        status(
                            "⚠️ Search could not be completed."
                        );

                    }
                );

        }


        if (searchButton) {

            searchButton.addEventListener(
                "click",
                searchPlace
            );

        }


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

                    status(
                        "❌ Location is not supported."
                    );

                    return;

                }


                status(
                    "📍 Requesting your location..."
                );


                navigator.geolocation.getCurrentPosition(

                    function (position) {

                        var lng =
                            position.coords.longitude;

                        var lat =
                            position.coords.latitude;


                        map.flyTo({
                            center: [
                                lng,
                                lat
                            ],
                            zoom: 15,
                            speed: 1.2
                        });


                        var marker =
                            new maplibregl.Marker()
                            .setLngLat([
                                lng,
                                lat
                            ])
                            .addTo(map);


                        var popup =
                            document.createElement("div");

                        popup.className =
                            "map-popup";


                        var title =
                            document.createElement("div");

                        title.className =
                            "map-popup-title";

                        title.textContent =
                            "📍 Your Location";


                        var text =
                            document.createElement("p");

                        text.className =
                            "map-popup-location";

                        text.textContent =
                            "Location provided by your browser.";


                        popup.appendChild(title);

                        popup.appendChild(text);


                        marker
                            .setPopup(
                                new maplibregl.Popup({
                                    offset: 25
                                })
                                .setDOMContent(popup)
                            )
                            .togglePopup();


                        status(
                            "📍 Your location is shown."
                        );

                    },


                    function (error) {

                        console.warn(
                            "LIFELINK location error:",
                            error
                        );


                        if (
                            error.code ===
                            error.PERMISSION_DENIED
                        ) {

                            status(
                                "⚠️ Location permission was denied."
                            );

                        } else {

                            status(
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
       INITIALIZE
       ===================================================== */

    function initializeMap() {

        status(
            "🗺️ Creating map..."
        );


        var map =
            new maplibregl.Map({

                container: MAP_ID,

                style: MAP_STYLE,

                center: CENTER,

                zoom: ZOOM,

                attributionControl: true

            });


        map.addControl(
            new maplibregl.NavigationControl(),
            "top-right"
        );


        map.on(
            "load",
            function () {

                var markerObjects =
                    createMarkers(map);


                setupFilters(
                    markerObjects
                );


                setupSearch(
                    map
                );


                setupLocation(
                    map
                );


                filterMarkers(
                    markerObjects,
                    "all"
                );


                status(
                    "🟢 Map ready — resources loaded."
                );


                console.log(
                    "LIFELINK V3.2 map initialized successfully."
                );

            }
        );


        map.on(
            "error",
            function (event) {

                console.error(
                    "LIFELINK map error:",
                    event
                );


                status(
                    "⚠️ Map data could not be loaded."
                );

            }
        );

    }


    /* =====================================================
       START
       ===================================================== */

    loadCSS();


    loadMapLibre()

        .then(
            function () {

                initializeMap();

            }
        )

        .catch(
            function (error) {

                console.error(
                    "LIFELINK V3.2 initialization failed:",
                    error
                );


                status(
                    "❌ Map could not be loaded."
                );

            }
        );


})();
```
