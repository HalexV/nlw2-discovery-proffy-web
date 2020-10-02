# nlw2-discovery-proffy-web
An app developed on the next level week event by Rocketseat. The app approaches students and teachers who wants to study or give classes on-line.

# Running the project
After cloning or downloading the project, enter the project folder and run: npm install. This will install the project's dependencies.

Now It's needed to create the database. Run the command on your terminal: nodejs src/database/db.js. This will create the database.

To the authentication system work properly create the following folder and file in src/config/auth.json.
The auth.json must contain a JSON object with the key "secret" and a string hash md5 string value.

{
  "secret": "your secret key"
}

You can generate your secret key here https://www.md5hashgenerator.com/.

Finally into your project folder run the command: npm run dev. This will run the project. Access It at localhost:5500.

:)
