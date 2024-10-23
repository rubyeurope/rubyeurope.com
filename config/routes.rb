Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  root "meetups#index"

  resources :meetups, only: [:index]
  resources :meetup_registration_requests, only: [:new, :create]
    resources :contact,  :path => :contact
  resources :conferences, only: [:index]
  resources :about, only: [:index]
  resources :sponsors, only: [:index]
  resources :news, only: [:index]
end
