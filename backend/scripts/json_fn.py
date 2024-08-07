import json
from django.core.serializers.json import DjangoJSONEncoder
import math
import jsonlines



def read_json(fileName):
    suffix = fileName.split(".")
    print(suffix)
    if suffix[-1] == "json":
        with open(fileName, 'r') as openfile:
    
            # Reading from json file
            json_object = json.load(openfile)
    elif suffix[-1] == "jsonl":
        with jsonlines.open(fileName) as reader:
            json_object = [obj for obj in reader]
    else:
        print("is this a json? " + suffix[-1])
    
    print("File Content ex: \n_______________________")
    print(json_object[:5])
    print("_______________________")
    # print(type(json_object))
    return json_object

def write_json(fileName, dict_list):
    # Serializing json
    json_object = json.dumps(dict_list, indent=4, cls=DjangoJSONEncoder)

    # print(json_object)
    # Writing to sample.json
    with open(fileName, "w") as outfile:
        outfile.write(json_object)


def split_json():
    with open('files/clubs.json', 'r') as openfile:
 
        # Reading from json file
        json_object = json.load(openfile)
    
    print(json_object)
    # print(type(json_object))
    num_files = math.floor(len(json_object)/10)
    for i in range (num_files):
        print(i*10,(i+1)*10)
        write_json("files/clubs/clubs"+str(i), json_object[i*10:(i+1)*10])

    print(num_files*10, len(json_object))
    write_json("files/clubs/clubs"+ str(num_files), json_object[i*10:len(json_object)])






