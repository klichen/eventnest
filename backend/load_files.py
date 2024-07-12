import os
import insta_loader
import image_text

FILETYPE = ".json"

def extract_i(fileName, prefix, fileType):
    '''
    all parameters are strings
    fileName requires a str in a [prefix][int][.filetype] format
    '''
    return int(fileName.split(prefix)[1].split(fileType)[0])



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

    for file in os.listdir(directory):
        filename = os.fsdecode(file)
        if filename.endswith(FILETYPE) : 
            # for every json file in the files/clubs/ folder, check if there is a corresponding files/posts/ file with the same index. 
            # if no then load the posts for those club profiles
            print(filename)
            try:
                i = extract_i(filename, input_prefix, FILETYPE)
                target_filename = target_prefix + str(i) + FILETYPE

                if not file_exists(cwd, target_folder, target_filename):
                    print(cwd + input_folder + filename, cwd + target_folder + target_filename)
                    function(cwd + input_folder + filename, cwd + target_folder + target_filename)

            except IndexError:
                print("ignoring " + filename + ", does not contain prefix " +input_prefix)
                


def main():
    # function_for_files("files/clubs/", "clubs", "files/posts/", "posts", insta_loader.load_club_posts)
    function_for_files("/files/posts/", "posts", "/files/processed_posts/", "posts", image_text.process_posts)

    


if __name__ == '__main__':
    main()