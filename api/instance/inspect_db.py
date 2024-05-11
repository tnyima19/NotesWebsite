import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect('users.db')
cursor = conn.cursor()

# List tables in the database
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print("Tables in the database:")
for table in tables:
    print(table[0])

# Show the schema of the User table
cursor.execute("PRAGMA table_info(User);")
columns = cursor.fetchall()
print("\nColumns in the User table:")
for column in columns:
    print(column)

# Display data from the User table
cursor.execute("SELECT * FROM User;")
users = cursor.fetchall()
print("\nData in the User table:")
for user in users:
    print(user)

# Close the connection
conn.close()
