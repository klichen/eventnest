from clubclubgo.models import Club, Event
from rest_framework import serializers


class ClubSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Club
        fields = ['id', 'name', 'description', 'email', 'website_type', 'website_link']


class EventSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'club_id', 'title', 'start_datetime', 'end_datetime', 'location', 'event_link',  'image_link', 'description'] #
         
