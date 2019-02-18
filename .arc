@app
blog

@aws
region eu-central-1
profile blog

@domain
ekblog.de

@static
staging ek-blog-media-fldxladcw-staging
production ek-blog-media-fldxladcw

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
get /api/media/:uid

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
resize-image
finish-image-upload

@tables
blog
  kind *String
  createdAt **String

@plugins
ek-blog/install-sharp-bindings
