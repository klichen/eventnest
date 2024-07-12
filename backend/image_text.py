import json_fn
from PIL import Image
import requests
from io import BytesIO





def image_to_text(image_urls):
    api_url = 'https://api.api-ninjas.com/v1/imagetotext'
    image_texts = []

    for image_url in image_urls:
        response = requests.get(image_url)
        # img = Image.open(BytesIO(response.content))
        # print(img)
        # image_file_descriptor = open("files/433139615_18326318554189325_4150010369888308604_n.jpg", 'rb') #[for locally stored picture ]
        # print(image_file_descriptor)
        files = {'image': response.content}
        r = requests.post(api_url, files=files)
        # print(r.json())
        image_texts.append(r.json())

    return image_texts


def main():


    posts = json_fn.read_json("files/posts/posts00")
    processed_posts = []
    for post in posts:
        post["image_texts"] = image_to_text(post["image_urls"])
        processed_posts.append(post)

    json_fn.write_json("files/posts/posts00", posts)
    # print(posts[5]["image_texts"])
    # print(processed_posts)
    # image_to_text("https://instagram.fyzd1-3.fna.fbcdn.net/v/t39.30808-6/433139615_18326318554189325_4150010369888308604_n.jpg?stp=dst-jpg_e15_fr_s1080x1080&_nc_ht=instagram.fyzd1-3.fna.fbcdn.net&_nc_cat=105&_nc_ohc=FRrbw1mNPwsQ7kNvgFgq62k&edm=AOQ1c0wAAAAA&ccb=7-5&ig_cache_key=MzMzMTExMTUxOTUyOTE3MTE5NA%3D%3D.2-ccb7-5&oh=00_AYDiRay80ssYPau5nTSllU81bTnVFRGsJoVazXmUcmmJmg&oe=668E15B3&_nc_sid=8b3546")
    print("Complete!")



if __name__ == '__main__':
    main()