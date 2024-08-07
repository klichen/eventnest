import mysql.connector
from  os import getenv
from dotenv import load_dotenv

load_dotenv() 
HOST = getenv("DBHOST")
USER = getenv("DBUSER")
PASSWORD = getenv("DBPASSWORD")
DB = getenv("DB")




def get_insta_posts():
    pass


def runCommand(sql_command):
    cnx = mysql.connector.connect(host=HOST,user=USER,
                    password=PASSWORD,database=DB)
    cursor = cnx.cursor()
    cursor.execute(sql_command)
    myresult = cursor.fetchall()
    

    for x in myresult:
        print(x)


def main():
    pass
    runCommand("""DESCRIBE clubclubgo_event;""")

    # sort database by last updated (reverse chronological)
        # check if there is an instagram or hh acc
        # check for null or oldest dates 
            # pull profile 
            # if last updated is null, pull last 3 posts 
            # if exists check for posts until post date <=  last updated 
            # get image to text for post 
            # time.sleep(random.randint(12, 121))
            # if no errors from pulling from profile then we can change the club last_upadted field to today :) 
            # [EDGE CASE: they post after we pull from their profile.... which is why we check if the post_id exists in the db before entering...]
            # inefficient but whats a girl to do..  
            # save to a json and send to kevin.. 
            # time.sleep(random.randint(100, 350))
            # if there is an error.. we should stop everything, save posts to a json and send to kevin. 
            # we can do up to 10 clubs if not ? 
            # questions: 
                # what if the instagram account does not exist anymore? -> what error does that give
                # !!! being able to differentiate between login required and being rate limited  
                # because once we hit a rate limit we have to go to sleep...
    posts = get_insta_posts()
    # save to a json and send to kevin.. 
    




    # send json to kevin 

    # chatgpt json -> process + filter 
    # processed post -> db 
        # check if post id exists in event table?????? [see event link]
        # if it doesnt exist we can add it to the db :thumbsup:



if __name__ == '__main__':
    main()
