from clubclubgo.models import Club, Event
from rest_framework import permissions, viewsets

from clubclubgo.serializers import ClubSerializer, EventSerializer


class ClubViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Club.objects.all()
    serializer_class = ClubSerializer
    # permission_classes = [permissions.IsAuthenticated]


class EventViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Event.objects.all().order_by('date_time')
    serializer_class = EventSerializer
    # permission_classes = [permissions.IsAuthenticated]

