from clubclubgo.models import Club, Event
from django.db.models import Q
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

        # print("current datetime:", current_date_time)
        # print("in_a_year_date_time:", in_a_year_date_time)
        # print(list(queryset)[0].start_datetime < current_date_time)
        queryset = queryset.filter(start_datetime__range=(current_date_time, in_a_year_date_time))

        #  perhaps we need pagination .. ?
        return JsonResponse(EventSerializer(queryset, many=True, context={'request': request} ).data, safe=False)
        # `HyperlinkedRelatedField` requires the request in the serializer context. Add `context={'request': request}` when instantiating the serializer.
    
    # todo return response if not get 

def getRecentlyUpdatedEvents(request):
    if request.method == "GET":
        queryset = Event.objects.all().order_by('date_created')
        eastern =pytz.timezone('US/Eastern')

        current_date_time = datetime.now(eastern)
        in_a_year_date_time = datetime.now(eastern) + relativedelta(years=1)

        # print("current datetime:", current_date_time)
        # print("in_a_year_date_time:", in_a_year_date_time)
        # print(list(queryset)[0].start_datetime < current_date_time)
        queryset = queryset.filter(start_datetime__range=(current_date_time, in_a_year_date_time))
        querylst = list(queryset)
        if len(querylst) < 15:
            top15 = querylst
        else: 
           top15 = querylst [:15]

        #  perhaps we need pagination .. ?
        return JsonResponse(EventSerializer(top15, many=True, context={'request': request} ).data, safe=False)
        # `HyperlinkedRelatedField` requires the request in the serializer context. Add `context={'request': request}` when instantiating the serializer.
    
    # todo return response if not get 

def getEvents(request):
    if request.method == "GET":
        event_ids = request.GET.getlist("event_id")
        # print(event_ids)
        events = []
        for event_id in event_ids:
            events.append(Event.objects.get(id=event_id))
        
        return JsonResponse(EventSerializer(events, many=True, context={'request': request} ).data, safe=False)
        # `HyperlinkedRelatedField` requires the request in the serializer context. Add `context={'request': request}` when instantiating the serializer.


def getClubEvents(request, id=None):
    if id is None:
        return HttpResponseBadRequest
    
    if request.method == "GET":
        queryset = Event.objects.all().order_by('start_datetime')
        queryset = queryset.filter(club_id=id)
        
        return JsonResponse(EventSerializer(queryset, many=True, context={'request': request} ).data, safe=False)
        # `HyperlinkedRelatedField` requires the request in the serializer context. Add `context={'request': request}` when instantiating the serializer.
            
def searchEvents(request):
    """
    request.body = {start_date=today(), 
        end_date=inayear(), 
        searchString="" (to search title, description and club) }
        # all optional
    """
    if request.method == "GET":
        queryset = Event.objects.all().order_by('start_datetime')
        club_queryset = Club.objects.all()

        # print("DATE!!! ")
        start_date_str = request.GET.get("start_date", datetime.today().strftime('%m-%d-%Y'))
        # print(start_date_str)
        end_date_str = request.GET.get("end_date", (datetime.today() + relativedelta(years=1)).strftime('%m-%d-%Y'))
        # print(end_date_str)

        
        start_date = datetime.strptime(start_date_str, '%m-%d-%Y')
        end_date = datetime.strptime(end_date_str + " 23:59", '%m-%d-%Y %H:%M')
        

        # print("current start_date:", start_date)
        # print("end_date:", end_date)

        # date_search = Q(start_datetime__range=(request.body["start_date"], request.body["end_date"]))
        date_search = Q(start_datetime__range=(start_date, end_date))
        queryset = queryset.filter(date_search)

        searchString = request.GET.get("search", "")
        searchStrs = searchString.split(" ") 
        # print(searchStrs)
        event_vals  = {}
        
        title_search = Q(title__icontains=searchString)
        descr_search = Q(description__icontains=searchString)
        club_search = Q(name__icontains=searchString)
        
        events_queryset = queryset.filter(title_search | descr_search )
        # print("title")
        # print(list(queryset.filter(title_search)))
        # print("descr")
        # print(list(queryset.filter(descr_search)))


        for event in events_queryset.values("id"):
            if event["id"] in event_vals:
                event_vals[event["id"]] += len(searchStrs)
            else: 
                event_vals[event["id"]] = len(searchStrs)
        
        for term in searchStrs:
            title_search = Q(title__icontains=term)
            descr_search = Q(description__icontains=term)
            
            # print("term: ", term)
            events_queryset = queryset.filter(title_search | descr_search )
            # print("title")
            # print(list(queryset.filter(title_search)))
            # print("descr")
            # print(list(queryset.filter(descr_search)))


            for event in events_queryset.values("id"):
                if event["id"] in event_vals:
                    event_vals[event["id"]] += 1
                else: 
                    event_vals[event["id"]] = 1

        sorted_events = [item for item, _ in sorted(event_vals.items(), key=lambda item: item[1])]
        # print("sorted_events")
        # print(sorted_events)

        sorted_events_queryset = [queryset.get(id=event_id) for event_id in sorted_events]
        # print("sorted_events_queryset")
        # print(sorted_events_queryset)

        club_queryset = club_queryset.filter(club_search) 

        # print("club_queryset")
        # print(list(club_queryset))

        # get next event for each club in club_queryset
        clubs_list = list(club_queryset)
        club_events = Event.objects.none()
        
        if not searchString == "" and len(clubs_list) > 0:
            for i in  range(0, len(clubs_list)):
                club_event_search = Q(club_id=clubs_list[i].id)
                club_events = club_events.union(queryset.filter(club_event_search))

        club_events = list(club_events.order_by('start_datetime'))
        # print("club_events_queryset")
        # print(club_events)

        # TODO: NOTE: i am going to union the club events with the events beause we should have them available anyways even if not seperated
        # sorted_events_queryset.extend(club_events) 
        # ^commented out, this was causing duplicates in the retrieved data
        return JsonResponse({"events":EventSerializer(sorted_events_queryset, many=True, context={'request': request}).data if len(sorted_events_queryset)>0 else [],
                             "club_events": EventSerializer(club_events, many=True, context={'request': request}).data if len(club_events)>0 else []}, safe=False )
        # `HyperlinkedRelatedField` requires the request in the serializer context. Add `context={'request': request}` when instantiating the serializer.
    
def searchEventCategory(request):
    """
    request.body = {start_date=today(), 
        end_date=inayear(), 
        searchString="" (to search title, description and club) }
        # all optional
    """
    if request.method == "GET":
        queryset = Event.objects.all().order_by('start_datetime')

        # print("DATE!!! ")
        start_date_str = request.GET.get("start_date", datetime.today().strftime('%m-%d-%Y'))
        # print(start_date_str)
        end_date_str = request.GET.get("end_date", (datetime.today() + relativedelta(years=1)).strftime('%m-%d-%Y'))
        # print(end_date_str)

        
        start_date = datetime.strptime(start_date_str, '%m-%d-%Y')
        end_date = datetime.strptime(end_date_str + " 23:59", '%m-%d-%Y %H:%M')
        

        # print("current start_date:", start_date)
        # print("end_date:", end_date)

        # date_search = Q(start_datetime__range=(request.body["start_date"], request.body["end_date"]))
        date_search = Q(start_datetime__range=(start_date, end_date))
        queryset = queryset.filter(date_search)

        categoryTerms = request.GET.get("search", "").split(" ")
        category_events = Event.objects.none()
        # print(list(category_events))

        
        for term in categoryTerms:
            title_search = Q(title__icontains=term)
            descr_search = Q(description__icontains=term)
            
            # print("term: ", term)
            events_queryset = queryset.filter(title_search | descr_search)
            # print("title")
            # print(list(queryset.filter(title_search)))
            # print("descr")
            # print(list(queryset.filter(descr_search)))
            # print("category_events.first()")
            # print(list(category_events))
            # print("events_queryset.first()")
            # print(events_queryset.first())
            category_events = category_events.union(events_queryset)
            

        return JsonResponse({"events":EventSerializer(category_events.order_by('start_datetime'), many=True, context={'request': request}).data if len(category_events)>0 else []},
                             safe=False )
        # `HyperlinkedRelatedField` requires the request in the serializer context. Add `context={'request': request}` when instantiating the serializer.
    



