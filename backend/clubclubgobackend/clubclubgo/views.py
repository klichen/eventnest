from clubclubgo.models import Club, Event
from rest_framework import permissions, viewsets


from clubclubgo.serializers import ClubSerializer, EventSerializer


class ClubViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Club.objects.all()
    serializer_class = ClubSerializer
    permission_classes = [permissions.IsAuthenticated]
    permission_classes_by_action = {'list': [permissions.AllowAny],
                                    'retrieve': [permissions.AllowAny]}
    
    def get_permissions(self):
        try:
            # return permission_classes depending on `action` 
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError: 
            # action is not set return default permission_classes
            return [permission() for permission in self.permission_classes]
    




class EventViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Event.objects.all().order_by('date_time')
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]
    permission_classes_by_action = {'list': [permissions.AllowAny],
                                    'retrieve': [permissions.AllowAny]}
    
    def get_permissions(self):
        try:
            # return permission_classes depending on `action` 
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError: 
            # action is not set return default permission_classes
            return [permission() for permission in self.permission_classes]

