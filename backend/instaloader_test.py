# script.py
from datetime import datetime
from dateutil.relativedelta import relativedelta 
from itertools import dropwhile, takewhile
import instaloader

class Post:
    date = datetime

def main():

    L = instaloader.Instaloader()
    #L.login("username", "password")

    # profile_name = "uoftparties"
    profile_name = "uoftsu"

    # # Get the Profile instance
    # profile = instaloader.Profile.from_username(L.context, profile_name)

    # for post in profile.get_posts():
    #     #L.download_post(post, target=profile_name)
    #     print(post.caption)
    #     print(post.url) # image url 
    #     break

    posts = instaloader.Profile.from_username(L.context, profile_name).get_posts()
    UNTIL = datetime.now()
    SINCE = UNTIL + relativedelta(months=-1)

    # print(p2.date > SINCE)

    # counter = 0

    # for post in posts:
    #     print(post.date)
    #     counter += 1
    #     if counter == 5:
    #         break

    for post in dropwhile(lambda p: p.date > UNTIL, takewhile(lambda p: p.date > SINCE, posts)):
        print(post.date)
        if not post.is_video:
            L.download_post(post, profile_name)
        # print(ret)


if __name__ == '__main__':
    main()