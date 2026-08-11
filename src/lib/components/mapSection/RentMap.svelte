<script>
import {
    onMount
} from 'svelte';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

let map;
let popup;

let isLoading = $state(true);
let loadingInfo = $state("Karte läd...")



onMount(() => {

    setTimeout(() => {
        isLoading === true ? loadingInfo = "Karte konnte nicht geladen werden." : ""
    }, 6000)

    // Initialize Mapbox
    mapboxgl.accessToken = 'pk.eyJ1IjoiYmVubWFyYmUiLCJhIjoiY204ZGdqbmk2MjIxcjJrczd5cjhnOWc5ZiJ9.aNWSLi175awDsnHX7mZIlQ';
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/benmarbe/cm8bs3mv900gf01s96g49btrq',
        center: [10.0, 51.3],
        zoom: 5,
        projection: 'mercator',
        maxZoom: 12,
        minZoom: 5.4
    });

    // Initialize popup
    popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    // Map event handlers
    map.on('load', () => {
        isLoading = false;
        map.getCanvas().style.cursor = 'default';
        map.addControl(new mapboxgl.NavigationControl());
    });

    map.on('style.load', function() {
        map.setPaintProperty('background', 'background-color', 'rgba(0, 0, 0, 0)');

    });

    map.on('mousemove', (event) => {
        const plzs = map.queryRenderedFeatures(event.point, {
            layers: ['germany-rent-plz-0-7ubtns']
        });

        if (plzs.length > 0) {
            const feature = plzs[0];
            const plz = feature.properties.plz || 'Keine Daten verfügbar.';
            const regio3 = feature.properties.regio3 || 'Keine Daten verfügbar.';
            const regio2 = feature.properties.regio2 || 'Keine Daten verfügbar.';
            const retrievedPrice = feature.properties.price_per_sqm;
            const priceSqm = retrievedPrice ? retrievedPrice : '';
            popup.setLngLat(event.lngLat)
                .setHTML(`
            <div id="pd">
              <h3 class="regio2">${regio2}</h3>
              <div id="location-information">
                <p id="regio3">${regio3}</p>
                <p id="plz">PLZ: ${plz}</p>
              </div>
              <p id="rent-price-info">Durchschnittlicher Mietpreis pro Quadratmeter:</p>
              <p id="rent-price">${priceSqm.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
            </div>
          `)
                .addTo(map);
        } else {
            popup.remove();
        }
    });

    document.getElementById('map').addEventListener('mouseleave', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
});
</script>
<figure id="map">
    {#if isLoading} <div class="loading-screen"><p>{loadingInfo}<p></div>{/if}
        </figure>

<style>
#map {
    width: 100%;
    min-height: 100vh;
    height: 100%;
    top: 0;
    overflow: hidden;
}

.loading-screen {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.loading-screen p {
    font-size: 1.2rem;
    text-align: center;
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    line-height: 2.3rem;
}

/* These are Mapbox's elements, so they need :global() */
:global(.mapboxgl-popup) {
    max-width: 300px !important;
}

:global(.mapboxgl-popup-content) {
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.8);
}


@media (max-width: 900px) {
    #map {
        height: 60vh;
    }

}
</style>
