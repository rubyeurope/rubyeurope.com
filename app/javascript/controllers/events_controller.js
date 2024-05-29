import { Controller } from "@hotwired/stimulus";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { InfoWindowElementContent, InfoWindowElementHeader } from "components/InfoWindowElement";
import { CustomControlButton } from "components/CustomControlButton";
import { RubyPin } from "components/RubyPin";
import { ClusteredRubyPin } from "components/ClusteredRubyPin";

export default class extends Controller {
  static values = {
    events: Array,
  };

  static targets = ["eventsList", "displayMap", "selectButtonText"];

  munichCoordinates = {
    lat: 48.13380555478656,
    lng: 11.57513552159241,
  };

  mapInitialized = false;

  eventToMarkerMap = {};

  connect() {
    if (this.mapInitialized) return;

    // initialize map centered on Munich
    this.initMap(this.munichCoordinates.lat, this.munichCoordinates.lng);
    this.mapInitialized = true;
  }

  async initMap(lat, lng) {
    const initialPosition = { lat: lat, lng: lng };

    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const map = new Map(this.displayMapTarget, {
      center: initialPosition,
      zoom: 4,
      mapId: "displayMap",
      controlSize: 28,
      mapTypeControl: false,
      streetViewControl: false,
    });

    const events = this.eventsValue;

    const infoWindow = new InfoWindow({ maxWidth: 320 });

    const markers = events.map(
      ({ latitude, longitude, name, description, link, img, dom_id, event_date, location }) => {
        const position = { lat: latitude, lng: longitude };

        const marker = new AdvancedMarkerElement({
          position,
          map,
          title: name,
          content: RubyPin("/rubyPin.svg"),
        });

        marker.addListener("click", (event) => {
          map.setCenter({ lat: latitude, lng: longitude });
          map.setZoom(14);

          infoWindow.setHeaderContent(InfoWindowElementHeader(name));
          infoWindow.setContent(
            InfoWindowElementContent({
              img,
              link,
              description,
              event_date,
              location,
            })
          );
          infoWindow.open(marker.map, marker);

          // find displayed event's button in events list and scroll it to view
          if (this.previouslyDisplayed) {
            document.getElementById(this.previouslyDisplayed).classList.remove("text-red");
          }
          const activeButton = document.getElementById(dom_id);
          this.currentlyDisplayed = activeButton.id;
          const isMobile = window.screen.width < "768";
          activeButton.classList.add("text-red");

          if (isMobile) {
            if (!event) this.toggleList();
            this.selectButtonTextTarget.innerText = name;
          } else {
            activeButton.scrollIntoView({ behavior: "smooth", block: "end" });
          }
          this.previouslyDisplayed = activeButton.id;
        });

        this.eventToMarkerMap[dom_id] = marker;

        return marker;
      }
    );

    const renderer = {
      render: ({ count, position }) =>
        new AdvancedMarkerElement({
          position,
          content: ClusteredRubyPin(count),
          zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
        }),
    };

    new MarkerClusterer({ markers, map, renderer });

    // add custom zoom out control button
    const zoomOutControlButton = CustomControlButton(
      "Zoom out",
      "Click to zoom out and recenter the map"
    );
    zoomOutControlButton.addEventListener("click", () => {
      const { lat, lng } = this.munichCoordinates;
      infoWindow.close();
      map.setCenter({ lat, lng });
      map.setZoom(4);
    });

    zoomOutControlButton.addEventListener("mouseenter", () => {
      zoomOutControlButton.style.backgroundColor = "#EBEBEB";
    });

    zoomOutControlButton.addEventListener("mouseleave", () => {
      zoomOutControlButton.style.backgroundColor = "#fff";
    });

    const zoomOutWrapper = document.createElement("div");
    zoomOutWrapper.appendChild(zoomOutControlButton);
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(zoomOutWrapper);
  }

  displayDetails(event) {
    if (!event) return;
    const activeMarker = this.eventToMarkerMap[event.currentTarget.id];
    google.maps.event?.trigger(activeMarker, "click");
  }

  toggleList() {
    this.eventsListTarget.classList.toggle("hidden");
  }
}
