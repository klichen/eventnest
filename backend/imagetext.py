import csv
from PIL import Image
import requests
from io import BytesIO



def read_posts_csv():
    with open('files/posts.csv', newline='') as csvfile:
        spamreader = csv.reader(csvfile, delimiter='|', quotechar='^')
        posts = []
        for row in spamreader:
            posts.append(row)
            # print(row)
        return posts

def image_to_text(image_url):
    api_url = 'https://api.api-ninjas.com/v1/imagetotext'
    
    response = requests.get(image_url)
    # img = Image.open(BytesIO(response.content))
    # print(img)
    # image_file_descriptor = open("files/433139615_18326318554189325_4150010369888308604_n.jpg", 'rb') #[for locally stored picture ]
    # print(image_file_descriptor)
    files = {'image': response.content}
    r = requests.post(api_url, files=files)
    print(r.json())

def main():
    # read_posts_csv()
    image_to_text("https://instagram.fyzd1-3.fna.fbcdn.net/v/t39.30808-6/433139615_18326318554189325_4150010369888308604_n.jpg?stp=dst-jpg_e15_fr_s1080x1080&_nc_ht=instagram.fyzd1-3.fna.fbcdn.net&_nc_cat=105&_nc_ohc=FRrbw1mNPwsQ7kNvgFgq62k&edm=AOQ1c0wAAAAA&ccb=7-5&ig_cache_key=MzMzMTExMTUxOTUyOTE3MTE5NA%3D%3D.2-ccb7-5&oh=00_AYDiRay80ssYPau5nTSllU81bTnVFRGsJoVazXmUcmmJmg&oe=668E15B3&_nc_sid=8b3546")
    



if __name__ == '__main__':
    main()