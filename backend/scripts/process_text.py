from openai import OpenAI
from dotenv import load_dotenv, find_dotenv
import os
import json
import time


class OpenAIBatchProcessor:
    def __init__(self, api_key):
        client = OpenAI(api_key=api_key)
        self.client = client

    def _simplify_image_txt(self, image_text_json):
        # text_info = json.loads(image_text_json)
        text_info = image_text_json
        if not text_info:
            return ''

        lines = []
        cur_y1 = text_info[0]['bounding_box']['y1']
        cur_line = []
        for t in text_info:
            y1 = t['bounding_box']['y1']
            text = t['text']
            if abs(y1 - cur_y1) < 20:
                cur_line.append(text)
            else:
                lines.append(' '.join(cur_line))
                cur_line = [text]
                cur_y1 = y1
        
        if cur_line:
            lines.append(' '.join(cur_line))

        result = '\n'.join(lines)
        return result

    def create_input_file(self, info_file):
        
        extract_info_prompt = '''Based on the provided JSON containing the text of an Instagram event post and its caption, extract the following information: date (in mm-dd-yyyy format), location, and time of the event. Additionally, summarize the event and create an appropriate title. Format this information as a JSON object. If any of the date, location, or time information is not available, return that field as null in the JSON output.'''

        tasks = []

        f = open(info_file)
        data = json.load(f)

        for idx, event in enumerate(data):
            club_name = event['username']
            image_texts = ''
            caption = event['caption']
            post_id = event['post_id']

            for img_text in event['image_texts']:
                # remove bounding box values
                simplified_text = self._simplify_image_txt(img_text)
                if image_texts == '':
                    image_texts = simplified_text
                else:
                    image_texts = image_texts + '\n' + simplified_text

            info_input = image_texts + '\n' + 'Caption: ' + caption

            task = {
                "custom_id": post_id,
                "method": "POST",
                "url": "/v1/chat/completions",
                "body": {
                    # "model": "gpt-3.5-turbo-0125",
                    "model": "gpt-4o-mini",
                    "temperature": 0.1,
                    "response_format": { 
                        "type": "json_object"
                    },
                    "messages": [
                        {
                            "role": "system",
                            "content": extract_info_prompt
                        },
                        {
                            "role": "user",
                            "content": info_input
                        }
                    ],
                    "max_tokens": 500
                }
            }

            tasks.append(task)
            f.close()

        # Creating the batch jsonl file

        # file_name = "data/batch1_gpt4o_input.jsonl"
        info_file_name = info_file.split('/')[-1].replace('.json', '')
        file_name = f'files/chatgpt_input_files/batch_input_{info_file_name}.jsonl'

        with open(file_name, 'w') as file:
            for obj in tasks:
                file.write(json.dumps(obj) + '\n')
        
        return file_name

    def upload_input_file(self, file_name):
        batch_file = self.client.files.create(
            file=open(file_name, "rb"),
            purpose="batch"
        )

        return batch_file

    def create_batch_job(self, batch_file):
        batch_job = self.client.batches.create(
            input_file_id = batch_file.id,
            # input_file_id = batch_file,
            endpoint = "/v1/chat/completions",
            completion_window="24h"
        )
        
        return batch_job
    
    def check_status_retrieve(self, batch_job, batch_file_name = ''):
        cur_batch_job = batch_job
        while cur_batch_job.status not in ["completed", "failed", "cancelled"]:
            time.sleep(5)  # Wait for 30 seconds before checking the status again
            print(f"Batch job status: {batch_job.status}...trying again in 5 seconds...")
            cur_batch_job = self.client.batches.retrieve(batch_job.id)
        
        # Download and save the results
        if cur_batch_job.status == "completed":
            result_file_id = cur_batch_job.output_file_id
            result = self.client.files.content(result_file_id).content

            # batch_name = batch_file_name.split('_')[-1].replace('.jsonl', '')

            result_file_name = f'files/chatgpt_output_files/all_posts_results.jsonl'

            with open(result_file_name, 'wb') as file:
                file.write(result)

        else:
            print(f"Batch job failed with status: {batch_job.status}")
            return None
    
    def download_output_file(self, batch_id, output_file_name):
        batch_job = self.client.batches.retrieve(batch_id)

        result_file_id = batch_job.output_file_id
        result = self.client.files.content(result_file_id).content

        # result_file_name = "results/batch1_results.jsonl"

        with open(output_file_name, 'wb') as file:
            file.write(result)

    def get_batch_job(self, batch_id):
        batch_job = self.client.batches.retrieve(batch_id)
        return batch_job
        

# get API key and start openai client
load_dotenv(find_dotenv())
openai_api_key = os.getenv("OPENAI_API_KEY")
# client = OpenAI(api_key=openai_api_key)

processor = OpenAIBatchProcessor(api_key=openai_api_key)

# change name to corresponding processed post json file
# batch_file_name = processor.create_input_file('files/processed_posts/all_posts.json')

batch_file_name = 'files/chatgpt_input_files/batch_input_all_posts.jsonl'
batch_file = processor.upload_input_file(batch_file_name)
batch_job = processor.create_batch_job(batch_file)


# batch_job = processor.get_batch_job('batch_HV4ChQpM4zPEIClwW8PANdGn')
# processor.check_status_retrieve(batch_job)

# ---------------------------------------------------------
# download batch result file using batch_id
batch_job_id = "batch_XyB9qgToYhJqQYXawB2VBv3h"
output_file_name = 'files/chatgpt_output_files/all_posts.jsonl'
batch_job = processor.download_output_file(batch_job_id, output_file_name)


