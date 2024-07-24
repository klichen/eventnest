from MySQLdb import _mysql

# TODO load from settings.py
db=_mysql.connect(host="b7n3yx0oplrx3fektmdw-mysql.services.clever-cloud.com",user="ue6crgij3j651go4",
                  password="gYuvqMA63YtXmi8NuN0B",database="b7n3yx0oplrx3fektmdw")

db.query("""INSERT INTO clubclubgo_event
         VALUES ();""")
r=db.store_result()

db.query("""SELECT * FROM clubclubgo_event;""")
r=db.store_result()

print(r.fetch_row(maxrows=0))


# db.commit()
# db.close()