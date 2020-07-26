# CIS450 Final Project
Our capstone project for CIS450 (Database and Information Systems) uses the EPA vehicle emissions and the US Energy Information Administration's powerplant dataset. Our tool allows users to plan out commutes, compare vehicles, and calculate the emission results of electric cars based on region.

In the process, we learned to design the schema ourselves, clean and ingest the data, and got to use the Google Maps API within React.js

Our techstack involves an Oracle DB hosted with AWS, an express/node API and a React.js interface.

## Setting up the db
Create a .env file in the server. Create environment variables using the dotenv syntax. Need to define:
- NODE_ORACLEDB_USER
- NODE_ORACLEDB_PASSWORD
- NODE_ORACLEDB_CONNECTIONSTRING
- externalAuth
- dbusername (the username for MongoDB)
- pwd (password for admin of MongoDB)

For info as to what these mean: https://github.com/oracle/node-oracledb/blob/master/examples/dbconfig.js
