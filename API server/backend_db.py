import sqlite3

connection = sqlite3.connect('data.db')

cursor = connection.cursor()

# cursor.execute("CREATE TABLE apps (id char(36) not NULL UNIQUE, name text)")
# cursor.execute("CREATE TABLE testSuite (id char(36) not NULL UNIQUE, parentId char(36) not NULL, name text)")
# cursor.execute("CREATE TABLE testCase (id char(36) not NULL UNIQUE, parentId char(36) not NULL, name text)")
# cursor.execute("CREATE TABLE step (id char(36) not NULL UNIQUE, parentId char(36), stepOrder int, action char(36), expectedBehaviourId char(36) not NULL)")
# cursor.execute("CREATE TABLE expectedBehaviour (id char(36) not NULL UNIQUE, parentId char(36) not NULL, image text, selectionTop int, selectionLeft int, selectionWidth int,  selectionHeight int)")
# test
cursor.execute("insert into 'apps' (id, name) values ('123', 'abc')")
print (list(cursor.execute("select * from apps")))