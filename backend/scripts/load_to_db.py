from MySQLdb import _mysql
import json_fn
import json
import dateutil.parser
import dateparser
import re
import mysql.connector
import logging
# from ..clubclubgo.models  import Club


HOST = "b7n3yx0oplrx3fektmdw-mysql.services.clever-cloud.com"
USER="ue6crgij3j651go4"
PASSWORD="gYuvqMA63YtXmi8NuN0B"
DB="b7n3yx0oplrx3fektmdw"


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

    if "-" in new_time:
        start_time, end_time = new_time.split("-")
    else: 
        start_time = new_time
        end_time = None

    parsed_date = dateparser.parse(post["date"] + " "+ start_time)
    print(post["date"] + " "+ post["time"] + " ---> ")
    print(parsed_date)
    post["start_datetime"] = parsed_date
    if end_time is not None:
        post["end_datetime"] = dateparser.parse(post["date"] + " "+ end_time)
    else: 
        post["end_datetime"] = None

    return post
    
def saniztize(dictionary):
    for key in dictionary:
        if "datetime" not in key.lower() and type(dictionary[key]) == str:
            # dictionary[key] = dictionary[key].encode()
            # print(dictionary[key])
            if key=="club_descriptions":
                dictionary[key] = dictionary[key].split("\n")[0]
        
    return dictionary


def load_clubs_to_db(clubs):
    """{"club_page": "https://sop.utoronto.ca/group/american-rock-mechanics-association-university-of-toronto-student-chapter/", 
    "club_title": "American Rock Mechanics Association University of Toronto Student Chapter", 
    "club_descriptions": "ARMA UToronto student chapter’s goal is to disseminate information through presentations, meetings, publications (ARMA E-News), and symposiums to engage geotechnical, civil and geomechanics students as well as other members in various fields of engineering, geology, and oil & gas. The purpose being to educate and better deliver state of art of rock mechanics knowledge whilst promoting the development of knowledge within the field.", 
    "instagram_links": null, 
    "instagram_usernames": null},
    """
    
    cnx = mysql.connector.connect(host=HOST,user=USER,
                    password=PASSWORD,database=DB)
    cursor = cnx.cursor()

    # logger = logging.getLogger("mysql.connector")
    # logger.setLevel(logging.DEBUG)

    # formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s- %(message)s")

    # stream_handler = logging.StreamHandler()
    # stream_handler.setFormatter(formatter)
    # logger.addHandler(stream_handler)

    # file_handler = logging.FileHandler("cpy.log")
    # file_handler.setFormatter(formatter)
    # logger.addHandler(file_handler) 

    # add_club = """INSERT INTO clubclubgo_club (name, description, email, website_type, website_link)
    #             VALUES (%s, %s, %s, %s, %s);"""
    # club_data = ("Amiercan ROcks", "Med descr, momre owrds", "", "SP", "https://sop.utoronto.ca")
    # cursor.execute(add_club, club_data)

    try:

        for club in clubs:
            # print("----new club: ----")
            # parse the club 
            # try: 
            if club["instagram_links"] is not None:
                website_link = club["instagram_links"][0]
                website_type = "IN"
            else: 
                website_link = club["club_page"]
                website_type = "SP"

            # add to db 
            try:
                add_club = """INSERT INTO clubclubgo_club (name, description, email, website_type, website_link)
                        VALUES (%s, %s, %s, %s, %s);"""
                club_data = (club["club_title"],  deEmojify(club["club_descriptions"]),"",website_type, website_link)
                # print(club_data)
                cursor.execute(add_club, club_data)
                

            except mysql.connector.errors.DatabaseError as e:
                print("Error inserting: ", e, club_data)
        
        print("Total rows:")
        cursor.execute("""SELECT COUNT(*) FROM clubclubgo_club;""")
        myresult = cursor.fetchall()

        for x in myresult:
            print(x)

    finally:
        cnx.commit()
        cnx.close()

def get_club_id(club_name):
    return Club.objects.get(name=club_name)

def load_events_to_db(events):
    cnx = mysql.connector.connect(host=HOST,user=USER,
                    password=PASSWORD,database=DB)
    cursor = cnx.cursor()


    try:

        for event in events:

            find_club_id = ("""SELECT id WHERE name = "%s" FROM clubclubgo_club;""")
            club_name = [event["club_title"]]
            # club_name = get_club_id(event["club_title"])
            print(club_name)
            cursor.execute(find_club_id, club_name)

            myresult = cursor.fetchall()
            for x in myresult:
                print(x)

            # add to db 
            # try:
            #     add_event = """INSERT INTO clubclubgo_club (club_id, title, start_datetime, end_datetime, location, event_link, image_link, description)
            #             VALUES (%s, %s, %s, %s, %s);"""
            #     event_data = club_id, event["title"], event["start_datetime"], event["end_datetime"], event["location"],event_link, event["media_url"], event["summary"])
            #     # print(club_data)
            #     cursor.execute(add_event, event_data)
                

            # except mysql.connector.errors.DatabaseError as e:
            #     print("Error inserting: ", e, event_data)
        
        print("Total rows:")
        cursor.execute("""SELECT COUNT(*) FROM clubclubgo_club;""")
        myresult = cursor.fetchall()

        for x in myresult:
            print(x)

    finally:
        pass
        # cnx.commit()
        # cnx.close()

    # # TODO load from settings.py
    # db=_mysql.connect(host=HOST,user=USER,
    #                 password=PASSWORD,database=DB)

    # for event in events:
    #     try: 
    #         # parse event

    #         # find club id for event club 
            
    #         db.query("""SELECT id WHERE name = {} FROM clubclubgo_event;""".format(event["club_title"]))
    #         r=db.store_result()
    #         club_id = r.fetch_row()
    #         print(club_id)

    #         # add to db 
    #         # TODO sanitize ? 
        
    #         event_link = "https://www.instagram.com/p/{}".format(event["post_id"])
    #         db.query("""INSERT INTO clubclubgo_event (club_id, title, start_datetime, end_datetime, location, event_link, image_link, description)
    #                 VALUES ({}, {}, {}, {}, {}, {}, {}, {});""".format(club_id, event["title"], event["start_datetime"], event["end_datetime"], event["location"],\
    #                                     event_link, event["media_url"], event["summary"]))
    #         r=db.store_result()

    #         db.query("""SELECT * FROM clubclubgo_event;""")
    #         r=db.store_result()

    #         print(r.fetch_row(maxrows=0))
    #     except KeyError:
    #         print("KeyError: Event missing data") 



    # db.commit()
    # db.close()

def process_posts():
    posts = json_fn.read_json("../files/chatgpt_posts/batch1_data.json")
    clubs  = json_fn.read_json("../files/club_all.json")

    completed_posts = []
    unapproved_posts = []
    for post in posts:
        processed_post = process_post(post)

        if processed_post[0] == 0:
            processed_post[1]["club_title"] = find_club(clubs, post["username"])
            processed_post[1]["media_url"] = "https://www.instagram.com/p/{}/media".format(post["post_id"])
            completed_posts.append(processed_post[1])
        elif processed_post[0] == 1:
            unapproved_posts.append(processed_post[1])
    print("Approved Posts: ", completed_posts)
    print("Unapproved Posts: ", unapproved_posts)

    json_fn.write_json("../files/event_posts/filtered_posts00.json", completed_posts)
    json_fn.write_json("../files/event_posts/unapproved_posts00.json", unapproved_posts)
    


def deEmojify(text):
    # https://stackoverflow.com/questions/33404752/removing-emojis-from-a-string-in-python 
    regrex_pattern = re.compile(pattern = "["
        u"\U0001F600-\U0001F64F"  # emoticons
        u"\U0001F300-\U0001F5FF"  # symbols & pictographs
        u"\U0001F680-\U0001F6FF"  # transport & map symbols
        u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                           "]+", flags = re.UNICODE)
    return regrex_pattern.sub(r'',text)

def showTable():
    # db=_mysql.connect(host=HOST,user=USER,
    #                 password=PASSWORD,database=DB)
    
    # db.query("""SELECT * FROM clubclubgo_club;""")
    # r=db.store_result()
    # print(r.fetch_row(maxrows=0))

    # print("________________cnx___________________\n\n")

    cnx = mysql.connector.connect(host=HOST,user=USER,
                    password=PASSWORD,database=DB)
    cursor = cnx.cursor()
    cursor.execute("""SELECT * FROM clubclubgo_club;""")
    myresult = cursor.fetchall()
    
    f = open("../files/inDB.txt", "w")

    for x in myresult:
        f.write(''.join(str(x)))
    f.close()



def main():
    
    # clubs  = json_fn.read_json("../files/club_all.json")
    # load_clubs_to_db(clubs)

    events  = json_fn.read_json("../files/event_posts/p_filtered_posts00.json")
    load_events_to_db(events)
    # showTable()

    # print(posts[5]["image_texts"])
    # print(processed_posts)
    # image_to_text("https://instagram.fyzd1-3.fna.fbcdn.net/v/t39.30808-6/433139615_18326318554189325_4150010369888308604_n.jpg?stp=dst-jpg_e15_fr_s1080x1080&_nc_ht=instagram.fyzd1-3.fna.fbcdn.net&_nc_cat=105&_nc_ohc=FRrbw1mNPwsQ7kNvgFgq62k&edm=AOQ1c0wAAAAA&ccb=7-5&ig_cache_key=MzMzMTExMTUxOTUyOTE3MTE5NA%3D%3D.2-ccb7-5&oh=00_AYDiRay80ssYPau5nTSllU81bTnVFRGsJoVazXmUcmmJmg&oe=668E15B3&_nc_sid=8b3546")
    print("Complete!")

    


if __name__ == '__main__':
    main()