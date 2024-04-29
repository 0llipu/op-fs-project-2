Full Stack Course Project 2

In this project we create 5 routes for a Node.js/Express API. We connect to a MongoDB database with these routes and perform basic CRUD-actions to the database. We find information, read it, create new, update the existing and also delete entries that are not needed.

Firstly we construct the server.js file which connects itself to a specific MongoDB database and then to a specific Collection in that database. Then we define a api.js file for the five different routes for the CRUD operations. Also needed is a Schema by the birds are stored to the MongoDB database and the collection birds.

I built this whole API to be a birdwatcher app where the user can add sightings of different birds with details.

First route is named /api/getall and it returns all documents from the database and it's collection. In this case it returns every bird from the collection.

Second route is named /api/:id and it returns one document (one bird object with details) with a specific ID from the collection of the birds.

Third route is named /api/add, it's used to create/add a new bird with a specific schema to the database bird collection.

Fourth route is named /api/update/:id it's used to update a certain bird with a specific ID. New details for the bird are stored via this route.

Fifth and the last route is named /api/delete/:id and it is used to delete a certain bird with a specific ID.

To all these routes I also made a frontend so that the user can view a list of birds, more details for one bird and add, update or delete birds aswell. Next steps could be to construct some login environment for the user and do some snazzy modern frontend with a real frontend library.

Link for this project on render is: https://op-fs-project-2.onrender.com/
