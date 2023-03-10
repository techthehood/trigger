# TRIGGER notes

IMPORTANT: 3 things have to be running
server.js
io_server.js
mongodb

GOTCHA: if using a shared mongodb db make sure triggerCnx has

#### trigger alias'
```
  alias trigger='cd-node; cd trigger'
  alias trigger-c='trigger; cd public/oauth_client/src/'
  alias trigger-s='trigger; nodemon src/server.js -e .hbs,.js,.scss'
  alias trigger-io='trigger; nodemon src/io_server.js -e .hbs,.js,.scss'
```

#### to run
```
  // install all the dependencies
  npm install

  // then run
  npx nodemon path-to/server.js
```
> npx http-server -o path-to/server.js fails

[nodemon to track changes to extensions](https://github.com/remy/nodemon)
use -e or --ext to track extensions
```
  nodemon path-to/server.js -e hbs,js,css
```

#### running the socket.io server

```
  nodemon src/io_server.js
```
up on port 3002

### installing passport
> There are 3 separate npm modules. 
> run npm install in 3 folders

```
npm install
```
./passport/
./src/oauth_server/
./public/oauth_client/src/
