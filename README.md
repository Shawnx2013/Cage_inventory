# cage-inventory
Cage inventory system for ISTE Senior Project

Team: Sarah Irons, Kevin Liu, Shawn Xu, Harsh Mathur, Mike Vasile, Alex K

---

### Local API setup
**(Assuming that MySQL is installed)**
1. navigate to /backend/db and run schema.sql and dummy_data.sql (must run them in order)
2. Add a .env file which contains the following:
     >
     ``` 
      DB_HOST= *your db host name
      DB_USER= *your db user name* 
      DB_PASSWORD= *your db password* 
      DB_SCHEMA=cagedb 
      SERVER_HOST=*your hose name, should be localhost if running locally* 
      SERVER_PORT=*3000 or change to any port if desired* 
      EMAIL_USER= email address for gmail
      EMAIL_PASS= email password
      ```
3. run `npm install` under the /backend directory
4. run `npm start` or `npm run devStart` to start up the API. The latter option starts up nodemon.
