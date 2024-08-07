# script.py
import instaloader
import csv
import json_fn
import time
import random



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
    #L.login("username", "password")

    # Get the Profile instance
    try:
        profile = instaloader.Profile.from_username(L.context, profile_name)
    
        posts = []
        
        i = 0 # only read the 5 most recent posts
        for post in profile.get_posts():
            if (i == 5):
                break
            i += 1

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
            time.sleep(random.randint(1, 6))
            # profile name|post id|date|image url|post caption

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
        return []
    
    except instaloader.PrivateProfileNotFollowedException:
        print("Login required, private instagram. skipping profile")
        return []
    
    except instaloader.InvalidArgumentException:
        print("Invalid arguments. Skipping profile ", profile_name)
        return []
    
    except instaloader.exceptions as e:
        print("instaloader error: ", e, " in profile: ", profile_name)
        return []
     
    

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
                return []
                

    return posts        


def load_club_posts(intput_filename,output_filename):
    clubs = json_fn.read_json(intput_filename)
    posts = []
    for club in clubs:
        print(club["instagram_usernames"])
        posts.extend(check_profiles(club["instagram_usernames"]))
    
    json_fn.write_json(output_filename, posts)

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
