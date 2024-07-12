from openai import OpenAI
from dotenv import load_dotenv
import os
import json
import time


class OpenAIBatchProcessor:
    def __init__(self, api_key):
        client = OpenAI(api_key=api_key)
        self.client = client

    def create_input_file(self, info_file = 'events_info.json'):
        
        extract_info_prompt = '''Based on the provided JSON containing the text of an Instagram event post and its caption, extract the following information: date, location, and time of the event. Additionally, summarize the event and create an appropriate title. Format this information as a JSON object. If any of the date, location, or time information is not available, return that field as null in the JSON output.'''

        tasks = []

        f = open(info_file)
        data = json.load(f)

        for idx, event in enumerate(data['events_info']):
            club_name = event['username']
            image_texts = ''
            caption = event['caption']

            for img_text in event['image_text']:
                if image_texts == '':
                    image_texts = img_text
                else:
                    image_texts = image_texts + '\n' + img_text

            info_input = image_texts + '\n' + 'Caption: ' + caption

            task = {
                "custom_id": f"task-{club_name}-{idx}",
                "method": "POST",
                "url": "/v1/chat/completions",
                "body": {
                    "model": "gpt-3.5-turbo-0125",
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
                    "max_tokens": 350
                }
            }

            tasks.append(task)

        # Creating the batch jsonl file

        file_name = "data/events_batch_input.jsonl"

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
            endpoint = "/v1/chat/completions",
            completion_window="24h"
        )
        
        return batch_job
    
    def check_status_retrieve(self, batch_job):
        cur_batch_job = batch_job
        while batch_job.status not in ["completed", "failed", "cancelled"]:
            time.sleep(30)  # Wait for 30 seconds before checking the status again
            print(f"Batch job status: {batch_job.status}...trying again in 30 seconds...")
            cur_batch_job = self.client.batches.retrieve(batch_job.id)
        
        # Download and save the results
        if cur_batch_job.status == "completed":
            result_file_id = cur_batch_job.output_file_id
            result = self.client.files.retrieve(result_file_id).decode("utf-8")

            result_file_name = "data/batch_job_results_events.jsonl"
            with open(result_file_name, "wb") as file:
                file.write(result)

            # Load data from the saved file
            # results = []
            # with open(result_file_name, "r") as file:
            #     for line in file:
            #         json_object = json.loads(line.strip())
            #         results.append(json_object)

            # return results
        else:
            print(f"Batch job failed with status: {batch_job.status}")
            return None
        

# get API key and start openai client
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
# client = OpenAI(api_key=openai_api_key)

processor = OpenAIBatchProcessor(openai_api_key)

batch_file_name = processor.create_input_file()
batch_file = processor.upload_input_file(batch_file_name)
batch_job = processor.create_batch_job(batch_file)
processor.check_status_retrieve(batch_job)

# print(batch_job.id)

# batch_job_id = "batch_4OmnVcmHooYCOgRroVSQ7Uzo"
# batch_job = client.batches.retrieve(batch_job_id)

# result_file_id = batch_job.output_file_id
# result = client.files.content(result_file_id).content

# result_file_name = "data/batch_job_results_events.jsonl"

# with open(result_file_name, 'wb') as file:
#     file.write(result)

