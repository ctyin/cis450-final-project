# CIS450 Final Project
Our capstone project for CIS450 (Database and Information Systems) uses the EPA vehicle emissions and the US Energy Information Administration's powerplant dataset. Our tool allows users to plan out commutes, compare vehicles, and calculate the emission results of electric cars based on region.

In the process, we learned to design the schema ourselves, clean and ingest the data, and optimized our SQL query performance (up to a factor of 12x). Full writeup is available here: https://drive.google.com/file/d/1gPxWotMnLKhNc0FlDLnZnaPXE4mQcAcL/view?usp=sharing

Our techstack involves an Oracle DB hosted with AWS, an express/node API and a React.js interface. We stored the user accounts in a NoSQL database (MongoDB) and used JSON Web Tokens and Bcrypt to manage login/logout.

Google Maps API key for DirectionsService is also a required dependency for this project.

## Setting up the db
Create a .env file in the server. Create environment variables using the dotenv syntax. Need to define:
- NODE_ORACLEDB_USER
- NODE_ORACLEDB_PASSWORD
- NODE_ORACLEDB_CONNECTIONSTRING
- externalAuth
- dbusername (the username for MongoDB)
- pwd (password for admin of MongoDB)

For info as to what these mean: https://github.com/oracle/node-oracledb/blob/master/examples/dbconfig.js
