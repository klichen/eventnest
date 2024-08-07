import json_fn
import json


def process_post(response_content):
    content = json.loads(response_content["response"]["body"]["choices"][0]["message"]["content"])
    print(content)

    try:
        if content["title"] is not None and content[ "date"] is not None and content["location"] is not None and \
                content["summary"] is not None and \
            not content["title"] == "null" and not content["date"] == "null" and not content["location"] == "null"\
                and not content["summary"] == "null": # and not content["time"] == "null"
            return content
        else:
            return -1
    except KeyError:
        return -1

def process_json(intput_filepath, output_filepath):
    print("Processing json in ", intput_filepath)
    json_file = json_fn.read_json(intput_filepath)

    print(str(len(json_file)), " json_file")
    processed_posts = []

    for response in json_file:
        processed_post = process_post(response)
        if not processed_post == -1:
            processed_posts.append(processed_post)


    json_fn.write_json(output_filepath, processed_posts)

    print("Completed processing " + intput_filepath  + " and outputted into " +output_filepath + "!")



def main():
    
    responses = json_fn.read_json("../files/chatgpt_posts/batch1_results.jsonl")
    processed_posts = []
    for response in responses:
        processed_post = process_post(response)
        if not processed_post == -1:
            processed_posts.append(processed_post)

    json_fn.write_json("../files/event_posts/posts00.json", processed_posts)
    # print(posts[5]["image_texts"])
    # print(processed_posts)
    # image_to_text("https://instagram.fyzd1-3.fna.fbcdn.net/v/t39.30808-6/433139615_18326318554189325_4150010369888308604_n.jpg?stp=dst-jpg_e15_fr_s1080x1080&_nc_ht=instagram.fyzd1-3.fna.fbcdn.net&_nc_cat=105&_nc_ohc=FRrbw1mNPwsQ7kNvgFgq62k&edm=AOQ1c0wAAAAA&ccb=7-5&ig_cache_key=MzMzMTExMTUxOTUyOTE3MTE5NA%3D%3D.2-ccb7-5&oh=00_AYDiRay80ssYPau5nTSllU81bTnVFRGsJoVazXmUcmmJmg&oe=668E15B3&_nc_sid=8b3546")
    print("Complete!")

    


if __name__ == '__main__':
    main()