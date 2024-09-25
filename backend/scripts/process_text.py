from openai import OpenAI
from dotenv import load_dotenv, find_dotenv
import os
import json
import time
from load_files import run_all_tasks
from generate_final_data import extract_content


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

    def create_input_file(self, info_file="files/processed_posts/all_posts.json"):
        """Create the input file for the batch process."""

        extract_info_prompt = '''Given an Instagram event post's text and caption, extract the following details:
        - date: Provide the event date in mm-dd-yyyy format. If the post mentions a relative date (e.g., "this Friday"), calculate the exact date based on the provided `date_posted`.
        - location: Extract the location of the event.
        - time: Extract the event's time.
        Also, summarize the event and create an appropriate title. 
        Return the information as a JSON object with the fields `date`, `location`, `time`, `summary`, and `title`. If any of these fields are missing, return them as `null`.'''

        tasks = []
        post_ids = set() # handling duplicate ids

        with open(info_file) as f:
            data = json.load(f)

        for event in data:
            image_texts = ''
            caption = event['caption']
            post_id = event['post_id']
            date_posted = event['date_posted']

            if post_id in post_ids:
                # check for duplicates
                continue
            
            post_ids.add(post_id)
            for img_text in event['image_texts']:
                # remove bounding box values
                simplified_text = self._simplify_image_txt(img_text)
                if image_texts == '':
                    image_texts = simplified_text
                else:
                    image_texts = image_texts + '\n' + simplified_text

            info_input = image_texts + '\n' + 'Caption: ' + caption + '\n' + 'Date posted: ' + date_posted

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

        # Creating the batch jsonl file
        info_file_name = info_file.split('/')[-1].replace('.json', '')
        file_name = f'files/chatgpt_input_files/batch_input_{info_file_name}.jsonl'

        with open(file_name, 'w') as file:
            for obj in tasks:
                file.write(json.dumps(obj) + '\n')
        
        return file_name

    def upload_input_file(self, file_name):
        """Upload the input file to OpenAI."""
        try:
            with open(file_name, "rb") as f:
                batch_file = self.client.files.create(file=f, purpose="batch")
            return batch_file
        except Exception as e:
            print(f"Failed to upload file: {e}")
            return None


    def create_batch_job(self, batch_file):
        """Create a batch job."""
        try:
            batch_job = self.client.batches.create(
                input_file_id = batch_file.id,
                endpoint = "/v1/chat/completions",
                completion_window = "24h"
            )
            return batch_job
        except Exception as e:
            print(f"Failed to create batch job: {e}")
            return None
    
    def monitor_batch_job(self, batch_job):
        """Monitor the batch job until completion."""
        wait_time = 30
        while batch_job.status not in ["completed", "failed", "cancelled"]:
            time.sleep(wait_time)
            print(f"Batch job status: {batch_job.status}... retrying in {wait_time} seconds...")
            batch_job = self.client.batches.retrieve(batch_job.id)

        if batch_job.status == "completed":
            return self.download_output_file(batch_job.output_file_id)
        else:
            print(f"Batch job failed with status: {batch_job.status}")
            return None

    def download_output_file(self, batch_result_file_id, output_file_name = 'files/chatgpt_output_files/all_posts.jsonl'):
        """Download the result file."""
        try:
            result = self.client.files.content(batch_result_file_id).content
            with open(output_file_name, 'wb') as file:
                file.write(result)
            print(f"Results saved to {output_file_name}")
            return 0
        except Exception as e:
            print(f"Failed to download result file: {e}")
            return None

    def get_batch_job(self, batch_id):
        batch_job = self.client.batches.retrieve(batch_id)
        return batch_job
    
    def fetch_and_process_post_data(self, fetch = True):
        """Run the entire data process."""
        info_file="files/processed_posts/all_posts.json"
        # Step 0: Run all tasks from load_files.py
        if fetch:
            run_all_tasks()

        # Step 1: Create Input File
        batch_file_name = self.create_input_file(info_file)

        # Step 2: Upload Input File
        batch_file = self.upload_input_file(batch_file_name)
        if not batch_file:
            return

        # Step 3: Create Batch Job
        batch_job = self.create_batch_job(batch_file)
        if not batch_job:
            return

        # Step 4: Monitor the Batch Job
        result = self.monitor_batch_job(batch_job)

        # Step 5: Once batch job is completed, extract the contents and finalize the data
        if result == 0:
            extract_content()
            print('Final data can be found at: files/chatgpt_posts/all_posts_final_data.json')


if __name__ == '__main__':
    load_dotenv(find_dotenv())
    openai_api_key = os.getenv("OPENAI_API_KEY")

    processor = OpenAIBatchProcessor(api_key=openai_api_key)
    processor.fetch_and_process_post_data(fetch=False)

    # download batch result file using batch_file id

    # batch_file_id = "batch_XyB9qgToYhJqQYXawB2VBv3h"
    # batch_job = processor.download_output_file(batch_file_id)
