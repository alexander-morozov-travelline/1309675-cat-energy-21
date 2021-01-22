ymaps.ready(init);

var map;

function init () {
  map = new ymaps.Map('map', {
    center: [59.939, 30.323],
    zoom: 17
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

/* background-image - webp */
var i=new Image;i.onload=i.onerror=function(){document.body.classList.add(i.height==1?"webp":"no-webp")};i.src="data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==";
