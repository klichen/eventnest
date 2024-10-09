import json_fn
import requests
import time
import random 


def image_to_text(image_urls):
    api_url = 'https://api.api-ninjas.com/v1/imagetotext'
    image_texts = []

    for image_url in image_urls:
        rand = random.randint(1, 9)
        print('sleeping for ', rand)
        time.sleep(rand)
        response = requests.get(image_url)
        files = {'image': response.content}
        r = requests.post(api_url, files=files)
        # print(r.json())
        image_texts.append(r.json())

    return image_texts


def process_posts(intput_filepath, output_filepath):
    print("Processing images in ", intput_filepath)
    posts = json_fn.read_json(intput_filepath)
    print(str(len(posts)), " posts")
    for post in posts:
        try:
            if not post["image_texts"]:
                post["image_texts"] = image_to_text([f"https://www.instagram.com/p/{post['post_id']}/media"])
                
        except KeyError:
            post["image_texts"] = image_to_text([f"https://www.instagram.com/p/{post['post_id']}/media"])


    json_fn.write_json(output_filepath, posts)

    print("Completed processing " + intput_filepath  + " and outputted into " + output_filepath + "!")


def main():
    posts = json_fn.read_json("../files/posts/posts00.json")
    for post in posts:
        if not post["image_texts"]:
            post["image_texts"] = image_to_text(post["image_urls"])

    json_fn.write_json("../files/posts/posts00.json", posts)
    # print(posts[5]["image_texts"])
    # print(processed_posts)
    # image_to_text("https://instagram.fyzd1-3.fna.fbcdn.net/v/t39.30808-6/433139615_18326318554189325_4150010369888308604_n.jpg?stp=dst-jpg_e15_fr_s1080x1080&_nc_ht=instagram.fyzd1-3.fna.fbcdn.net&_nc_cat=105&_nc_ohc=FRrbw1mNPwsQ7kNvgFgq62k&edm=AOQ1c0wAAAAA&ccb=7-5&ig_cache_key=MzMzMTExMTUxOTUyOTE3MTE5NA%3D%3D.2-ccb7-5&oh=00_AYDiRay80ssYPau5nTSllU81bTnVFRGsJoVazXmUcmmJmg&oe=668E15B3&_nc_sid=8b3546")
    print("Complete!")



if __name__ == '__main__':
    main()