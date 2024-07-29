from MySQLdb import _mysql
import json_fn
import json
import dateutil.parser
import dateparser
import re



def find_club(clubs_dict,club_username):
    for club in clubs_dict:
        if club["instagram_usernames"] is not None and club["instagram_usernames"][0] == club_username:
            return club["club_title"]
        


def process_post(content):
    content_count = []
    try:
        content_count.append(content["title"] is not None and not content["title"] == "null" ) 
        content_count.append(content["summary"] is not None and not content["summary"] == "null"  )
        content_count.append(content["date"] is not None and not content["date"] == "null")  
        content_count.append(content["location"] is not None and not content["location"] == "null"  )
        content_count.append(content["time"] is not None and not content["time"] == "null"  )
        
        print("content_count sum: ", sum(content_count))

        if sum(content_count) == 5:
            return [0, get_event_from_post(content)]
        elif sum(content_count) > 3 and content_count[0] == 1 and content_count[1]==1:
            # must have title and summary available
            return [1, content]
        else:
            return [-1, content]
    except KeyError:
        print("content: \n")
        print(content)
        return (-1, content)

def fix_am_pm(string):
    string = string.group(0)
    print(string)
    time = re.search(r"[apAP][mM]", string)
    result = re.search(r"\d+(:\d+)* *-", string)
    if result is not None:
        string = string[:result.end(0)-1] + time.group(0) + string[result.end(0)-1:]
    return string


def get_event_from_post(post):
    # TODO can use this to parse....  
    # if has __-__ (AM OR PM)
    print(post["time"])
    new_time = re.sub(r"\d+(:\d+)* *- *\d+(:\d+)* *[apAP].*[mM].*", fix_am_pm, post["time"])
    print("new_time", new_time)

    if re.search("\d+ *- *\d+ *[AP].*M.*", post["time"]):
        start_time, end_time = post["time"].split("-")
    else: 
        start_time = post["time"]
        end_time = None

    parsed_date = dateparser.parse(post["date"] + " "+ start_time)
    print(post["date"] + " "+ post["time"] + " ---> ")
    print(parsed_date)
    post["start_datetime"] = parsed_date
    if end_time is not None:
        post["end_datetime"] = dateparser.parse(post["date"] + " "+ end_time)

    
    # how to get club it ??????
    # club_id = models.ForeignKey(Club, on_delete=models.CASCADE)
    # title = models.TextField(max_length=100)
    # start_datetime = models.DateTimeField()
    # end_datetime = models.DateTimeField(blank=True,  default=None)
    # location = models.TextField(max_length=100)
    # event_link = models.URLField(max_length=100, blank=True, default='')
    # image_link = models.URLField(max_length=100, blank=True, default='')
    # description = models.TextField(max_length=300)


def load_events_to_db(events):
    pass
    # TODO load from settings.py
    db=_mysql.connect(host="b7n3yx0oplrx3fektmdw-mysql.services.clever-cloud.com",user="ue6crgij3j651go4",
                    password="gYuvqMA63YtXmi8NuN0B",database="b7n3yx0oplrx3fektmdw")

    db.query("""INSERT INTO clubclubgo_event
            VALUES ();""")
    r=db.store_result()

    db.query("""SELECT * FROM clubclubgo_event;""")
    r=db.store_result()

    print(r.fetch_row(maxrows=0))


    # db.commit()
    # db.close()


def main():
    posts = json_fn.read_json("../files/chatgpt_posts/batch1_data.json")
    clubs  = json_fn.read_json("../files/clubs_names_insta.json")

    completed_posts = []
    unapproved_posts = []
    for post in posts:
        processed_post = process_post(post)

        if processed_post[0] == 0:
            # processed_post[1]["club_title"] = find_club(clubs, post["username"])
            # processed_post[1]["media_url"] = "https://www.instagram.com/p/{}/media".format(post["post_id"])
            completed_posts.append(processed_post[1])
        elif processed_post[0] == 1:
            unapproved_posts.append(processed_post[1])
    print("Approved Posts: ", completed_posts)
    print("Unapproved Posts: ", unapproved_posts)

    json_fn.write_json("../files/event_posts/filtered_posts00.json", completed_posts)
    json_fn.write_json("../files/event_posts/unapproved_posts00.json", unapproved_posts)
    # print(posts[5]["image_texts"])
    # print(processed_posts)
    # image_to_text("https://instagram.fyzd1-3.fna.fbcdn.net/v/t39.30808-6/433139615_18326318554189325_4150010369888308604_n.jpg?stp=dst-jpg_e15_fr_s1080x1080&_nc_ht=instagram.fyzd1-3.fna.fbcdn.net&_nc_cat=105&_nc_ohc=FRrbw1mNPwsQ7kNvgFgq62k&edm=AOQ1c0wAAAAA&ccb=7-5&ig_cache_key=MzMzMTExMTUxOTUyOTE3MTE5NA%3D%3D.2-ccb7-5&oh=00_AYDiRay80ssYPau5nTSllU81bTnVFRGsJoVazXmUcmmJmg&oe=668E15B3&_nc_sid=8b3546")
    print("Complete!")

    


if __name__ == '__main__':
    main()