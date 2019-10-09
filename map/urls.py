from django.conf.urls import url
from django.contrib.auth.views import (logout, login)

from map import views

urlpatterns = [
	url(r'^$', login, name='login'),
	url(r'^logout/$', logout, name='logout'),
	url(r'^register/$', views.register, name='register'),
	url(r'^map/$', views.mapView, name='map_view'),

	url(r'^api/create/$', views.createItem, name='create_item'),
	url(r'^api/remove/$', views.removeItem, name='remove_item'),
	url(r'^api/geojson/$', views.getGeoJson, name='api_geojson'),
	url(r'^api/upload/$', views.upload, name='api_upload'),
	
	url(r'^update-profile/(?P<pk>\d+)/$', views.update_profile, name='update_profile'),
]