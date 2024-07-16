# script.py
import instaloader


def main():

    L = instaloader.Instaloader()
    #L.login("username", "password")

    profile_name = "uofttempo"

    # Get the Profile instance
    profile = instaloader.Profile.from_username(L.context, profile_name)

    for post in profile.get_posts():
        #L.download_post(post, target=profile_name)
        print(post.caption)
        print(post.url) # image url 
        break


if __name__ == '__main__':
    main()