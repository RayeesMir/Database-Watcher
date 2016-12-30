# Database-Watcher

### What is this repository for? ###

* Database Watcher watches any changes made to your database collections and sends notification to the subscribers of the collections.
* Version 1.0
### Requirements ###
 * Node
 * MongoDB
### How do I get set up? ###

* Clone Repo.
* Run npm install 
* Run bower install commands
* Database configuration : 
    * Run mongo in shell.
    * Run use dbwatcher. 
    * Run db.setProfilingLevel(2).
    * START node index.js;
* Optional: if u want to use ur database name 
    * Run mongo in shell.
    * Run use "Database name". 
    * Run db.setProfilingLevel(2).
    * change database name in config.js in 'dev' mode as well.
    * Run Index.js server will start on port 3000
* Front End 
   * open any web browser and browser to localhost.
   * create use
   * sigin to the system 
   * follow any collections or create any number collection using mongo shell so that you can follow them in frontend.
   * To Check system is working change any of the collection(s) subscribed.

### Who do I talk to? ###

* mail me on mirrayees859@gmail.com
* feel free to raise issue
