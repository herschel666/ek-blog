@app
ddb_test

@aws
region eu-central-1
profile ddb_test

@http
get /
get /blogposts/:blogpost
get /categories
get /categories/:category

post /create/blogpost
post /create/category

@tables
ddb_data
  kind *String
  createdAt **String

@indexes
ddb_data
  kind *String
  params **String
