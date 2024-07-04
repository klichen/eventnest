# script.py
import instaloader
import csv

def read_csv():
    with open('club instagrams.csv', newline='') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
        clubs = []
        for row in spamreader:

            clubs.append(row)
        return clubs

def load_posts(profile_name):
    L = instaloader.Instaloader()
    #L.login("username", "password")


    # Get the Profile instance
    profile = instaloader.Profile.from_username(L.context, profile_name)

    for post in profile.get_posts():
        #L.download_post(post, target=profile_name)
        print(post.caption)
        print(post.url) # image url 
        break

def main():
    
    clubs = read_csv()
    club = clubs[1][1].split("/")[-2]
    load_posts(club)
    # load_posts("uofttempo")
   


if __name__ == '__main__':
    main()