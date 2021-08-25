# to run
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

# installing passport
> There are 3 separate npm modules. 
> run npm install in 3 folders

```
npm install
```
./passport/
./src/oauth_server/
./public/oauth_client/src/