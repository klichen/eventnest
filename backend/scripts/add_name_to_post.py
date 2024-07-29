import json_fn


def find_club(clubs_dict,club_username):
    for club in clubs_dict:
        if club["instagram_usernames"] is not None and club["instagram_usernames"][0] == club_username:
            return club["club_title"]


def main():
    
    posts = json_fn.read_json("../files/event_posts/filtered_posts00.json")
    clubs  = json_fn.read_json("../files/clubs_names_insta.json")

    for post in posts:
        post["club_title"] = find_club(clubs, post["username"])
        post["media_url"] = "https://www.instagram.com/p/{}/media".format(post["post_id"])
    
    json_fn.write_json("../files/event_posts/p_filtered_posts00.json", posts)


    print("Complete!")

    


if __name__ == '__main__':
    main()

