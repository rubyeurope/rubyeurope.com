# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin_all_from "app/javascript/helpers", under: "helpers"
pin_all_from "app/javascript/components", under: "components"
pin "@googlemaps/markerclusterer", to: "@googlemaps--markerclusterer.js" # @2.5.3
pin "fast-deep-equal" # @3.1.3
pin "kdbush" # @4.0.2
pin "supercluster" # @8.0.1
