@app
blog

@aws
region eu-central-1
profile blog

@http
get /
get /posts/:slug
get /categories
get /categories/:slug
get /feed.xml
get /assets/:file
get /admin
get /api/posts
get /api/posts/:uid
get /api/categories
get /api/media

post /admin
post /api/posts
post /api/categories
post /api/media

put /api/posts/:uid
put /api/categories/:uid

delete /api/posts/:uid
delete /api/categories/:uid
delete /api/media/:uid

@tables
blog
  kind *String
  createdAt **String

@indexes
blog
  kind *String
  params **String
