# script.py
import instaloader
import csv
import json_fn
import time
import random
from datetime import datetime



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



def load_posts(profile_name):
    L = instaloader.Instaloader()
    # L.login("kevinchen3880", "contra123KK!")

    # Get the Profile instance
    try:
        profile = instaloader.Profile.from_username(L.context, profile_name)
        print(profile)
        posts = []
        month_start = datetime.today().replace(day=18)
        pinned_posts_buffer = 0
        profile_posts = profile.get_posts()
        print(profile_posts)

        for post in profile_posts:
            if post.date < month_start:
                # allow for pinned posts to be skipped without skipping recently uploaded posts
                if pinned_posts_buffer == 3:
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
            time.sleep(random.randint(2,9))
            print("found a post -> ", profile_name)
            
            # profile name|post id|date|image url|post caption
        rand = random.randint(181, 333)
        print("sleeping for ", rand, " seconds")
        time.sleep(rand)
        return posts
    
    except instaloader.ProfileNotExistsException:
        print("Profile does not exist")
        return []
    
    except instaloader.exceptions.QueryReturnedNotFoundException:
        print("Profile cannot be found")
        return []
    
    except instaloader.QueryReturnedNotFoundException:
        print("Profile cannot be found")
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
    
    except instaloader.exceptions as e:
        print("instaloader error: ", e, " in profile: ", profile_name)
        return -1
     
    

def load_post(post_id):
    # L = instaloader.Instaloader()
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
    return 0

    # https://www.instagram.com/p/CxvdeKcg1EK/?img_index=1 
    # load_post("CxvdeKcg1EK")
    print("Complete!")


def main():
    clubs = json_fn.read_json("../files/clubs/clubs00.json")
    posts = []
    for club in clubs:
        print(club["instagram_usernames"])
        posts.extend(check_profiles(club["instagram_usernames"]))
    
    json_fn.write_json("../files/posts/posts00.json", posts)

    # https://www.instagram.com/p/CxvdeKcg1EK/?img_index=1 
    # load_post("CxvdeKcg1EK")
    print("Complete!")

    # club = clubs[1][1].split("/")[-2]
    # load_posts(club)
    # load_posts("uofttempo")
#    write_csv()


if __name__ == '__main__':
    main()
