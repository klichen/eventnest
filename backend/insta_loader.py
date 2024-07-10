# script.py
import instaloader
import csv
import json

def read_clubs_csv():
    with open('files/club_instagrams.csv', newline='') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
        clubs = []
        for row in spamreader:
            clubs.append(row)
            print(row)
        return clubs

def read_clubs_json():
    with open('files/clubs.json', 'r') as openfile:
 
        # Reading from json file
        json_object = json.load(openfile)
 
    print(json_object)
    # print(type(json_object))
    return json_object

# class ProfileNotExistsException(Exception):
#     pass


def load_posts(profile_name):
    L = instaloader.Instaloader()
    #L.login("username", "password")


    # Get the Profile instance
    try:
        profile = instaloader.Profile.from_username(L.context, profile_name)
    
        
        posts = []
        # post = instaloader.Post.from_shortcode(L.context, "CxvdeKcg1EK")
        # print(post)
        for post in profile.get_posts():
            #L.download_post(post, target=profile_name)
            # print(post.caption)
            # print(post.url) # image url 
            # print(post.title) 
            # print(post.shortcode) 
            # L.download_post(post, target=profile_name)

            # check if post has multiple images
            if post.mediacount > 1:
                url = []
                for sidecar in post.get_sidecar_nodes(): 
                    url.append(sidecar.display_url)
            else:
                url = [post.url]

            posts.append({"username": profile_name, 
                        "post _id": post.shortcode, 
                        "date_posted": post.date, 
                        "image_url": url, 
                        "caption": post.caption})
            # profile name|post id|date|image url|post caption

        return posts
    
    except instaloader.ProfileNotExistsException:
        print("profile does not exist")
        return 

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
            posts.append(load_posts(profile))

    return posts        

def write_posts_csv(rows):
    with open('files/posts.csv', 'a', newline='') as csvfile:
        csv_writer = csv.writer(csvfile, delimiter="|",
                                quotechar='^', quoting=csv.QUOTE_MINIMAL)
        for row in rows:
            # print(row)
            csv_writer.writerow(row)
        
def write_posts_json(posts):
    # Serializing json
    json_object = json.dumps(posts, indent=4)
    
    # Writing to sample.json
    with open("posts.json", "a") as outfile:
        outfile.write(json_object)


def main():
    clubs = read_clubs_json()
    # clubs = read_clubs_csv()
    posts = []
    for club in clubs:
        print(club["instagram_usernames"])
        posts.append(check_profiles(club["instagram_usernames"]))
    
    write_posts_json(posts)

    # https://www.instagram.com/p/CxvdeKcg1EK/?img_index=1 
    # load_post("CxvdeKcg1EK")
    print("Complete!")

    # club = clubs[1][1].split("/")[-2]
    # load_posts(club)
    # load_posts("uofttempo")
#    write_csv()


if __name__ == '__main__':
    main()