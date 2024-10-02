# script.py
import instaloader
import csv
import json_fn
import time
import random
from datetime import datetime
import threading
# from pynput.keyboard import Key, Controller


def read_clubs_csv():
    with open('files/club_instagrams.csv', newline='') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
        clubs = []
        for row in spamreader:
            clubs.append(row)
            print(row)
        return clubs


def write_posts_csv(rows):
    with open('files/posts.csv', 'a', newline='') as csvfile:
        csv_writer = csv.writer(csvfile, delimiter="|",
                                quotechar='^', quoting=csv.QUOTE_MINIMAL)
        for row in rows:
            # print(row)
            csv_writer.writerow(row)


def skip_profile(profile_name):
    # append profile names to skipped_profiles.txt --- delete these from clubs json files after
    with open("files/skipped_profiles.txt", "a") as text_file:
        text_file.write("%s\n" % profile_name)
    keyboard = Controller()
    with keyboard.pressed(Key.ctrl):
        keyboard.press('c')
        keyboard.release('c')

def load_posts(profile_name):
    user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
    # L = instaloader.Instaloader(max_connection_attempts=0, user_agent=user_agent)
    L = instaloader.Instaloader()
    L.login("kedoged115", "clubclubgoing")
    # get_profile_delay = 5
    # alarm = threading.Timer(get_profile_delay, skip_profile, args=[profile_name])

    try:
        # Get the Profile instance
        # alarm.start()
        profile = instaloader.Profile.from_username(L.context, profile_name)
        # alarm.cancel()
        print(profile)
        posts = []
        month_start = datetime.today().replace(day=18, month=9, hour=0, minute=0, second=0, microsecond=0)

        pinned_posts_buffer = 0
        post_counter = 0
        profile_posts = profile.get_posts()

        for post in profile_posts:
            print(post.date)
            if post.date < month_start:
                # allow for pinned posts to be skipped without skipping recently uploaded posts
                if pinned_posts_buffer == 5:
                    break
                else:
                    pinned_posts_buffer += 1
                    continue

            # check if post has multiple images
            if post.mediacount > 1:
                url = []
                for sidecar in post.get_sidecar_nodes(): 
                    url.append(sidecar.display_url)
            else:
                url = [post.url]

            posts.append({"username": profile_name, 
                        "post_id": post.shortcode, 
                        "date_posted": post.date, 
                        "image_urls": url, 
                        "caption": post.caption})
            post_counter += 1
            # profile name|post id|date|image url|post caption
        
        print(f"{post_counter} new post(s) - {profile_name}")
        rand = random.randint(200, 654)
        print("sleeping for ", rand, " seconds")
        time.sleep(rand)
        return posts
    
    except instaloader.ProfileNotExistsException:
        print(f"Profile {profile_name} does not exist")
        return []
    
    except instaloader.exceptions.QueryReturnedNotFoundException:
        print(f"Profile {profile_name} cannot be found")
        return []
    
    except instaloader.exceptions.ConnectionException:
        print(f"Profile {profile_name} cannot be found")
        return []
    
    except instaloader.QueryReturnedNotFoundException:
        print(f"Profile {profile_name} cannot be found")
        return []

    except instaloader.LoginRequiredException:
        print("Login required, skipping profile")
        return -1
    
    except instaloader.PrivateProfileNotFollowedException:
        print("Login required, private instagram. skipping profile")
        return []
    
    except instaloader.InvalidArgumentException:
        print("Invalid arguments. Skipping profile ", profile_name)
        return -1
    

def load_post(post_id):
    L = instaloader.Instaloader()
    #L.login("username", "password")


    # Get the Profile instance
    # profile = instaloader.Profile.from_username(L.context, profile_name)
    post = instaloader.Post.from_shortcode(L.context, post_id)
    print(post.mediacount)
    sidecars = post.get_sidecar_nodes()
    for sidecar in sidecars: 
        print(sidecar.display_url)


def check_profiles(profile_list):
    posts = []
    if profile_list:
        for profile in profile_list:
            print("profile: " + profile)
            try: 
                loaded_posts = load_posts(profile)
                if not loaded_posts is None:
                    posts.extend(loaded_posts)
            except TypeError:
                print("No posts. Something went wrong :/")
                return -1
                

    return posts        


def load_club_posts(intput_filename, output_filename):
    clubs = json_fn.read_json(intput_filename)
    posts = []
    for club in clubs:
        try:
            if club["instagram_usernames"] is not None:
                print(club["instagram_usernames"])
                posts.extend(check_profiles(club["instagram_usernames"]))
        except TypeError:
                print("There was an error. Stop running the program  :[ ")
                return -1
    
    json_fn.write_json(output_filename, posts)
    print("Complete!")
    return 0


def main():
    posts = load_posts('volleyballestadiopapi222')
    # posts = load_posts('uoftparties')
    print(posts)
#     clubs = json_fn.read_json("../files/clubs/clubs00.json")
#     posts = []
#     for club in clubs:
#         print(club["instagram_usernames"])
#         posts.extend(check_profiles(club["instagram_usernames"]))
    
#     json_fn.write_json("../files/posts/posts00.json", posts)

#     # https://www.instagram.com/p/CxvdeKcg1EK/?img_index=1 
#     # load_post("CxvdeKcg1EK")
#     print("Complete!")

#     # club = clubs[1][1].split("/")[-2]
#     # load_posts(club)
#     # load_posts("uofttempo")
# #    write_csv()


if __name__ == '__main__':
    main()
