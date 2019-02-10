@app
blog

@aws
region eu-central-1
profile blog

@static
staging ek-blog-media-flDXLaDcW-staging
production ek-blog-media-flDXLaDcW

@http
get /
get /posts/:slug
get /categories
get /categories/:slug
get /feed.xml
get /robots.txt
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

@queues
delete-media-file

@tables
blog
  kind *String
  createdAt **String

@indexes
blog
  kind *String
  params **String
