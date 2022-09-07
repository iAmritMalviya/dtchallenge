# dtchallenge
Event handling

Users can enter details at http://localhost:3000/ or at the root, on submitting user will get uid.


GET /events 
  user can see all events in JSON form or in card form (both created)


GET /events?type=latest&limit=5&page=1:
Pagination is working on changing the query, type = ‘older’ will get old first 


POST /events  
Postman > Body > x-www-form-urlencoded, input key and values which will be uploaded as post request 


PUT /events/:id
Postman > Body > x-www-form-urlencoded, input key and values which will be updated as Put request with uid


DELETE /events/:id
It will delete the event.

for uploading pic: used Multer + fs npm packages

MongoDB native library used with no schema, using objectID as uid
