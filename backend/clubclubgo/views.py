from clubclubgo.models import Club, Event
from rest_framework import permissions, viewsets
from django.http import JsonResponse, HttpResponseBadRequest
from datetime import datetime
from dateutil.relativedelta import relativedelta
import pytz


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
    queryset = Event.objects.all().order_by('start_datetime')
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


def getUpcomingEvents(request):
    if request.method == "GET":
        queryset = Event.objects.all().order_by('start_datetime')
        eastern =pytz.timezone('US/Eastern')

        current_date_time = datetime.now(eastern)
        in_a_year_date_time = datetime.now(eastern) + relativedelta(years=1)

        print("current datetime:", current_date_time)
        print("in_a_year_date_time:", in_a_year_date_time)
        print(list(queryset)[0].start_datetime < current_date_time)
        queryset = queryset.filter(start_datetime__range=(current_date_time, in_a_year_date_time))
        # queryset = queryset.filter(start_datetime__year__gt=current_date_time.year, 
        #                  start_datetime__month__gt=current_date_time.month, 
        #                  start_datetime__day__gt=current_date_time.day)
        #  perhaps we need pagination .. ?
        return JsonResponse(EventSerializer(queryset, many=True, context={'request': request} ).data, safe=False)
        # `HyperlinkedRelatedField` requires the request in the serializer context. Add `context={'request': request}` when instantiating the serializer.
    
    # todo return response if not get 

def getClubEvents(request, id=None):
    if id is None:
        return HttpResponseBadRequest
    
    if request.method == "GET":
        queryset = Event.objects.all().order_by('start_datetime')
        # eastern =pytz.timezone('US/Eastern')

        # current_date_time = datetime.now(eastern)
        # in_a_month_date_time = datetime.now(eastern) + relativedelta(months=1)

        # if a club has past events, differentiate them from upcoming events (perhaps a front end thing) 
        # queryset.filter(start_datetime__range=(current_date_time, in_a_month_date_time))
        queryset = queryset.filter(club_id=id)
        
        return JsonResponse(EventSerializer(queryset, many=True, context={'request': request} ).data, safe=False)
        # `HyperlinkedRelatedField` requires the request in the serializer context. Add `context={'request': request}` when instantiating the serializer.
            




