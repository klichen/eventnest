# script.py
import instaloader
import csv

def read_clubs_csv():
    with open('files/club_instagrams.csv', newline='') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
        clubs = []
        for row in spamreader:
            clubs.append(row)
            print(row)
        return clubs



def load_posts(profile_name):
    L = instaloader.Instaloader()
    #L.login("username", "password")


    # Get the Profile instance
    profile = instaloader.Profile.from_username(L.context, profile_name)
    posts = []
    for post in profile.get_posts():
        #L.download_post(post, target=profile_name)
        # print(post.caption)
        # print(post.url) # image url 
        # print(post.title) 
        # print(post.shortcode) 
        # L.download_post(post, target=profile_name)
        posts.append((profile_name, post.shortcode, post.date, post.url, post.caption))
        # profile name|post id|date|image url|post caption


    return posts



def write_posts_csv(rows):
    with open('files/posts.csv', 'a', newline='') as csvfile:
        csv_writer = csv.writer(csvfile, delimiter="|",
                                quotechar='^', quoting=csv.QUOTE_MINIMAL)
        for row in rows:
            # print(row)
            csv_writer.writerow(row)
        


def main():
    
    clubs = read_clubs_csv()
    for i in range(1,len(clubs)):
        posts = load_posts(clubs[i][1].split("/")[-2])
        write_posts_csv(posts)

    print("Complete!")

    # club = clubs[1][1].split("/")[-2]
    # load_posts(club)
    # load_posts("uofttempo")
#    write_csv()


if __name__ == '__main__':
    main()