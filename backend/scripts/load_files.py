import os
import insta_loader
import image_text
import time
import random
import json
import argparse
import re

FILETYPE = ".json"

def extract_index_from_filename(file_name: str, prefix: str, file_type: str) -> int:
    """
    Extract the integer index from the file name in the format [prefix][int][.filetype].

    :param file_name: The file name as a string.
    :param prefix: The prefix to look for in the file name.
    :param file_type: The file extension.
    :return: The integer index from the file name or -1 if not found.
    """
    try:
        return int(file_name.split(prefix)[1].split(file_type)[0])
    except IndexError:
        print(f"{file_name} does not contain {prefix}")
        return -1


def file_exists(cwdpath, subfolder, target_filename):
    """
    Check if a file exists in a subfolder.

    :param cwd_path: Current working directory.
    :param subfolder: Subfolder where the file might exist.
    :param target_filename: The target file name to check for.
    :return: True if the file exists, False otherwise.
    """
    directory = os.fsencode(cwdpath + "/" + subfolder)
    # print("files exists directory: " + directory)
    
    for file in os.listdir(directory):
        filename = os.fsdecode(file)
        if filename == target_filename : 
            return True
            
    return False


# Custom sorting function to extract numbers and sort numerically
def numerical_sort_key(filename):
    # Use regex to find the number in the filename, if present
    numbers = re.findall(r'\d+', filename)
    return int(numbers[0]) if numbers else 0

def retrieve_club_posts():
    """
    Fetch and load club posts for profiles without corresponding data files in /files/posts.
    """
    input_folder = "/files/clubs/"
    target_folder = "/files/posts/"
    cwd =  os.getcwd() 
    directory = os.fsencode(cwd + input_folder)

    print(directory)
    file_counter = 0

    files = [file.decode('utf-8') for file in os.listdir(directory)]
    # print(files)
    sorted_files = sorted(files, key=numerical_sort_key)
    for file in sorted_files:
        print(file)

        filename = os.fsdecode(file)
        
        if filename.endswith(FILETYPE) : 
            # for every json file in the files/clubs/ folder, check if there is a corresponding files/posts/ file with the same index. 
            # if no then load the posts for those club profiles
            print(filename)
            try:
                index = extract_index_from_filename(filename, "clubs", FILETYPE)
                if index > -1:
                    target_filename = f"posts{index}{FILETYPE}"
                    # check if corresponding posts{index}.json file exists
                    if not file_exists(cwd, target_folder, target_filename):
                        clubs_file_path = cwd + input_folder + filename
                        posts_file_path = cwd + target_folder + target_filename
                        result = insta_loader.load_club_posts(clubs_file_path, posts_file_path)
                        file_counter += 1
                        if result == -1:
                            pause = random.randint(33333,77777)
                            print("There was an error with instaloader - Pausing for .....", pause/60, "minutes")
                            time.sleep(pause)
                        else:
                            print(f"posts{index}.json success")             
            except IndexError:
                pass


def merge_posts_files():
    """
    Merge all files/posts# files into one JSON file.
    """
    cwd =  os.getcwd() 
    posts_folder = "/files/posts/"
    directory = os.fsencode(cwd + posts_folder)
    posts_len = len(os.listdir(directory)) - 1

    filenames = []

    for i in range(posts_len):
        # if i != 8 and i != 9:
        if i not in range(55, 67):
            filenames.append(f"{cwd}/files/posts/posts{i}.json")

    result = []
    for f1 in filenames:
        with open(f1, 'r') as infile:
            result.extend(json.load(infile))

    with open(f'{cwd}/files/posts/all_posts.json', 'w') as output_file:
        json.dump(result, output_file)


def extract_text_from_images():
    """
    Process images and extract text data.
    """
    cwd = os.getcwd()
    input_file = f"{cwd}/files/posts/all_posts.json"
    output_file = f"{cwd}/files/processed_posts/all_posts.json"
    image_text.process_posts(input_file, output_file)


def run_all_tasks():
    """
    Run all tasks sequentially: club posts fetching, merging, and image processing.
    """
    print("Running all tasks sequentially...")

    # Process club files
    retrieve_club_posts()

    # Merge JSON files
    print("Merging JSON files...")
    merge_posts_files()

    # Process images
    print("Processing images...")
    extract_text_from_images()

    print("All tasks completed.")

        
def main():
    # Run desired task with corresponding arg in the command line
    # Example: python load_files.py --task all
    parser = argparse.ArgumentParser(description="Process club post data.")
    parser.add_argument('--task', choices=['fetch', 'merge', 'process', 'all'], required=True, help="Specify the task to run.")

    args = parser.parse_args()

    if args.task == 'fetch':
        retrieve_club_posts()
    elif args.task == 'merge':
        merge_posts_files()
    elif args.task == 'process':
        extract_text_from_images()
    elif args.task == 'all':
        run_all_tasks() 


if __name__ == '__main__':
    main()