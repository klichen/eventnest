from django.db import models
from django.utils import timezone


class Club(models.Model):
    '''
    id [int] - The ID of this event.
    name [str] - The name of this club.
    description [str] - The description for this club.
    website_type [int] The type of website associated with this club. Different indices refer to different types of website. For your reference:
        "NA": "None",
        "IN": "Instagram", 
        "HH": "Hart House"
    website_link [URL] - The link to this club’s website.


    '''
    WEBSITE_CHOICES = {
        ("NA", "None"),
        ("SP", "Student Portal"),
        ("IN", "Instagram"), 
        ("HH", "Hart House")
    }
    name = models.TextField(max_length=100)
    description = models.TextField(max_length=1000)
    email = models.TextField(max_length=50, default='')
    website_type = models.CharField(max_length=2,
        choices=WEBSITE_CHOICES,
        default="NA",)
    website_link = models.URLField(max_length=150, blank=True, default='')
    last_updated = models.DateTimeField(blank=True, null=True) 
   

    def __str__(self): 
        return self.name


class Event(models.Model):
    '''
    id [int] - The ID of this event.
    club_id [Foreign Key to Club] - The ID of the club that this event belongs to.
    title [String] - The title of the event.
    date_time [datetime] - The date and time at which the event will be held.
    location [String] - The location at which the event is said to be held.
    event_link [URL] - The URL link to the original post from which this entry was scraped.
    image_link [URL] - the URL link to the image associated with this post.
    description [String] - A brief description of the event.

    '''
    club_id = models.ForeignKey(Club, on_delete=models.CASCADE)
    title = models.TextField(max_length=100)
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField(blank=True, null=True, default=None)
    location = models.TextField(max_length=100)
    event_link = models.URLField(max_length=100, blank=True, default='') #must be unique !!!
    image_link = models.URLField(max_length=100, blank=True, default='')
    description = models.TextField(max_length=250)
    date_created = models.DateTimeField(blank=True, default=timezone.now)


    def __str__(self): 
        return self.title + " " + self.start_datetime.strftime('%m/%d/%Y')