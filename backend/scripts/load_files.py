import os
import insta_loader
import image_text
import time
import random
import json

FILETYPE = ".json"

def extract_i(fileName, prefix, fileType):
    '''
    all parameters are strings
    fileName requires a str in a [prefix][int][.filetype] format
    '''
    try:
        return int(fileName.split(prefix)[1].split(fileType)[0])
    except IndexError:
        print(fileName + " does not contain " + prefix)
        return -1



def file_function(folderName, filetype, function):
    
    print(os.getcwd() + (folderName))
    directory = os.fsencode(os.getcwd() + folderName)
    print(directory)
    
    for file in os.listdir(directory):
        filename = os.fsdecode(file)
        if filename.endswith(filetype) : 
            # print(os.path.join(directory, filename))
            print(filename)
            function(filename, filetype, function)
            
            continue
        else:
            continue


def file_exists(cwdpath, subfolder, target_filename):
    '''
    all parameters are str
    '''
    directory = os.fsencode(cwdpath + "/" + subfolder)
    # print("files exists directory: " + directory)
    
    for file in os.listdir(directory):
        filename = os.fsdecode(file)
        if filename == target_filename : 
            return True
            
    return False



def function_for_files(input_folder, input_prefix, target_folder, target_prefix, function):
    cwd =  os.getcwd() 
    # print(cwd + "/files/clubs")
    directory = os.fsencode(os.getcwd() + input_folder)
    print(directory)
    API_CALLS = 100


    for file in os.listdir(directory):
        filename = os.fsdecode(file)
        # if API_CALLS <= 0:
        #     time.sleep(random.randint(112, 255))
        #     API_CALLS = 100
        
        if filename.endswith(FILETYPE) : 
            # for every json file in the files/clubs/ folder, check if there is a corresponding files/posts/ file with the same index. 
            # if no then load the posts for those club profiles
            print(filename)
            try:
                i = extract_i(filename, input_prefix, FILETYPE)
                if i > -1:
                    # if i == 15:
                    #     break
                    target_filename = target_prefix + str(i) + FILETYPE

                    if not file_exists(cwd, target_folder, target_filename):
                        return_val = function(cwd + input_folder + filename, cwd + target_folder + target_filename)
                        if return_val == -1:
                            pause = random.randint(610, 2001)
                            print("Pausing for ..........", pause/30, "minutes")
                            time.sleep(pause)
                            
                        print(cwd + input_folder + filename, "to",cwd + target_folder + target_filename)
                        # API_CALLS -= 15
                        # time.sleep(random.randint(61, 201))
                        

            except IndexError:
                pass

def merge_JsonFiles():
    filenames = []
    cwd =  os.getcwd()
    for i in range(77):
        if i != 8 and i != 9:
            filenames.append(f"{cwd}/files/posts/posts{i}.json")

    result = []
    for f1 in filenames:
        with open(f1, 'r') as infile:
            result.extend(json.load(infile))

    with open(f'{cwd}/files/posts/all_posts.json', 'w') as output_file:
        json.dump(result, output_file)
                


def main():
    parse = input("club/post?:")

    if parse.startswith("c"):
        function_for_files("/files/clubs/", "clubs", "/files/posts/", "posts", insta_loader.load_club_posts)
    elif parse.startswith("m"):
        merge_JsonFiles()
    elif parse.startswith("t"):
        cwd =  os.getcwd()
        image_text.process_posts(f"{cwd}/files/posts/all_posts.json", f"{cwd}/files/processed_posts/all_posts.json")
    else: 
        function_for_files("/files/posts/", "posts", "/files/processed_posts/", "posts", image_text.process_posts)

    


if __name__ == '__main__':
    main()