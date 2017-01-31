# Loopback-Basic-Auth
Simple loopback app that accepts login credentials. 

Using the RxJS and bcrypt libraries, Loopback-Basic-Auth accepts/rejects login attempts using a simple username/password JSON.  

* Clone, npm install, node .
* Navigate to localhost:3000/explorer and explorer the AppUser api.
* At POST /login:
 - use a JSON object with the following syntax - {"username":"admin","password":"admin"}
 - Submit the post
* The App will reject request that:
 - do not have a username or password field
 - contain an invalid username or password
* The App will respond with a 500 for internal fails.
* To add a new user use the explorer api (POST /users)
 - build the body with the following key:value pairs - {"username":"user", "password":"test"}
 - submit the post

Notice: When a user is created, the data contains two added fields: modified and created.  These two fields are added to the AppUser model Within the /common/models/app-user.json.  The datasource is a file residing in /data/app-users.json.  

This is a very basic implmentation that should not be used.  It is only for educational purposes.  However, to extend the functionality of the app, I have left a final .map withing the /common/models/auth/login.js file: for now it returns an AppUser instance, but could return an access token.  

Additionally, bcrypt is used to hash passwords before they enter the database.  The salt is set to a low number now, so it should increased in the future.  

Lastly, there is a basic NG module residing within the /client directory.
