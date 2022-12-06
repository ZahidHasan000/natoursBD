// const map = require('mapboxgl');
/* eslint-disable */

// const locations = JSON.parse(document.getElementById('map').dataset.locations)
// console.log(locations);

export const displayMap = locations => {

  mapboxgl.accessToken =
    'pk.eyJ1IjoiemFoaWQwMDciLCJhIjoiY2xhcjA3MTY4MWZ3ZzN3bXFhOG0ydjdyYSJ9.-m8pqoAifqjD7_dZWhpxBw';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/zahid007/clar5s1ei000l15pcfjvzpl2f',
    scrollZoom: false
    // center: [-118.244234, 34.081604],
    // zoom: 10,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map);

    // Add popup
    // new mapboxgl.popup({
    //   offset: 30
    // })
    //   .setLngLat(loc.coordinates)
    //   .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map);


    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 200,
      left: 100,
      right: 100
    }
  });
};



// exports.module = map
