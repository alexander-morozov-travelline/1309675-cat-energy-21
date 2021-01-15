ymaps.ready(init);

var map;

function init () {
  map = new ymaps.Map('map', {
    center: [55.755768, 37.617671],
    zoom: 10
  }, {
    searchControlProvider: 'yandex#search'
  });

  var placemark = new ymaps.Placemark(map.getCenter(), {
    hintContent: 'Cat energy',
    balloonContent: 'Cat energy'
  }, {
    iconLayout: 'default#image',
    iconImageHref: './img/placemark.png',
    iconImageSize: [57, 53],
    iconImageOffset: [-28, -26]
  });

  map.geoObjects.add(placemark);
}
