import json

def extract_post_id():
    with open('data/posts.json') as f:
        posts = json.load(f)
        for post in posts:
            post.pop('username')
            post.pop('date_posted')
            post.pop('image_urls')
            post.pop('caption')
            post.pop('image_texts')

    with open('data/post_ids.json', 'w') as file:
        json.dump(posts, file)

def update_image_urls():
    with open('files/posts/all_posts.json', 'r') as f:
        posts = json.load(f)
        for post in posts:
            new_image_url = f"https://www.instagram.com/p/{post['post_id']}/media"
            post['image_urls'] = [new_image_url]
    
    with open('files/posts/all_posts.json', 'w') as f:
        json.dump(posts, f)

def update_custom_id():
    id_list = []
    with open('data/post_ids.json') as f:
        ids = json.load(f)
        for id in ids:
            id_list.append(id['post_id'])

    res_file = open('results/batch1_results_new.json', 'a')


    with open('results/batch1_gpt4o_results.jsonl') as file:
        id_index = 0
        for line in file:
            data = json.loads(line)
            data['custom_id'] = id_list[id_index]
            id_index += 1

            res_file.write(json.dumps(data) + '\n')


    res_file.close()
    

def create_base_data(info_file = 'data/posts.json'):
    data = {}
    with open(info_file) as f:
        posts = json.load(f)
        for post in posts:
            post_id = post['post_id']
            info_dict = {
                'post_id': post_id,
                'username': post['username'],
                'date_posted': post['date_posted'],
            }
            data[post_id] = info_dict

        return data
            


def extract_content(postsStr = 'all_posts'):
    info_file = f'files/processed_posts/{postsStr}.json'
    chatgpt_output_file = f'files/chatgpt_output_files/{postsStr}_results.jsonl'
    final_result_file = f'files/chatgpt_posts/{postsStr}_final_data.json'
    full_data = []
    base_data = create_base_data(info_file)
    with open(chatgpt_output_file) as f:
        for line in f:
            data = json.loads(line)
            content = data['response']['body']['choices'][0]['message']['content']
            post_id = data['custom_id']
            data_dict = json.loads(content)

            if post_id in base_data:
                # print('POST ID IN BASE DATA')
                res_dict = data_dict | base_data[post_id]
                full_data.append(res_dict)
        
    with open(final_result_file, 'w') as file:
        file.write(json.dumps(full_data, indent=4))


# update_image_urls()
extract_content()
# create_base_data()
# extract_post_id()
# update_custom_id()