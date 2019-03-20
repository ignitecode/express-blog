# Intro to express and express-routing

### Objectives
*After this lesson, students will be able to:*

- Use and configure middleware like body-parser to handle form submissions
- Write out the skeleton of a RESTful API
- Review what JSON is and why we're using JSON as the format for our data
- Interact with HTTP verbs using CURL or an app
- Identify the HTTP verbs we'll be using for an API

### Preparation
*Before this lesson, students should already be able to:*

- Explain HTTP requests/responses
- Explain MVC
- Write and explain basic javascript

## Recapping Node and Intro to Express - Intro (5 mins)

#### First let's review

* What is Node?

Node is a low-level, non-blocking, event-driven platform which allows you to write JavaScript on the server-side.

* What is npm?

npm is Node's package manager. It's used to manage dependencies.

#### What is express.js?

Express.js is a simple web framework for Node.js.

It's biggest highlights are:

- extremely lightweight/minimalistic (gives you the power to have more control over your application)
- easy to create routes
- very simple to apply middleware

## Let's create blogging app using Node and Express - Codealong (15 mins)

Get to it:

1. `mkdir express-blog`
2. `cd express-blog`
3. `npm init` (Hit enter to accept the defaults and see the new [package.json](https://docs.npmjs.com/cli/init) file
4. `npm install express --save` (The `--save` option adds the module as a dependency in your package.json file. This allows anyone looking at your app (i.e. a dev team member) to be able to see what your app is "made of" and if they clone your app and run `npm i` all dependencies will be installed.
5. `touch app.js` in express-blog directory


Check out the package.json file:

```json
"dependencies": {
  "express": "^4.16.3"
}
```

Let's start coding!

```javascript
// app.js

var express = require('express');
var app     = express();
var port    = process.env.PORT || 3000;

app.listen(port);
console.log('Server started on ' + port);
```

Notice the get verb here - this can also be post, put, delete, etc. Then run the app using:

```bash
node app.js
```

Navigate to `http://localhost:3000` and voila!

Now this is pretty awesome (isn't it?) but it doesn't really do anything. Plus, what if we want to start creating pages instead of just using sending text?

## Nodemon

Before we go any further let's install a handy server package that will automatically refresh our app each time we save a file. It's called [Nodemon](https://nodemon.io/). Run `npm install -g nodemon` to install it globally. We can now start our app with `nodemon app.js`. 

#### Custom npm scripts

Additionally, to get some practice creating our own custom scripts, let's add a "start" script to our `package.json` like so:

```js
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon app.js"
  },
```

Now we can also start our server with `npm run start`. Other examples of scripts could be "build" or "deploy".

## Routing in Express - Intro (5 mins)

Let's look at routes and handler callback functions in Express routes:

```javascript
app.get('/', function(req, res) {
  res.send('homepage');
});
```

Routes in Express are created using methods named after HTTP verbs. In the example above, we created a route to respond to GET requests at the root of the app. You will have a corresponding method on the app object for all the HTTP verbs.  In this example, we'll send back the `homepage` view as a response.

## Templates in Express - Codealong (10 mins)

For Unit 2, we'll use a templating engine called [EJS](http://ejs.co/) (Embedded JavaScript). This library will "bake" javascript logic and data into an HTML document that is sent to the browser from the server. This is considered *server-side* rendering. We'll get into *client-side* rendering in Unit 3 with React. 

Instead of sending some text when we hit our site let's have it serve an ejs index page.

#### Install ejs

We'll have a full lesson dedicated to this topic later in the course, but for now, we need to get our app up and running.

First we need to install the ejs package with npm:

```bash
npm install ejs --save
```

You can uninstall from a project with:

```bash
npm uninstall ejs --save
```

#### Setting up ejs and render the index

Again, we'll use EJS, at least in the beginning, because the syntax has a gentle learning curve (very similar to ERB). To change your rendering engine you'll need to edit your apps configuration in `app.js`. We also have to change what happens when a user GETs '/'. Let's get it to render our index template instead of sending 'Hello World'.

```javascript
app.set('views', './views');
app.set('view engine', 'ejs');


app.get('/', function(req, res) {
    res.render('index');
});

app.listen(port);
console.log('Server started on ' + port);
```

#### Rendering the index

In order to render a template, we need to change what happens when a user makes a GET request to '/'. Let's get it to render our index template instead of sending 'Hello World'.

```javascript
// app.js

app.get('/', function(req, res) {
  res.render('index');
});
```

#### Creating views in Express

How about an ejs index page:

```bash
mkdir views
touch views/index.ejs
```

And add this code:

```html

<!doctype html>
<html lang="en">
<head>
  <title>Welcome to Express!</title>
</head>

<body>
  <h1>Introduction to Express</h1>
  <div class="container">
    <p> This is a paragraph of text. Yay! </p>
  </div>
</body>

```

#### Logging in Express with Middleware - Codealong (10 mins)

Middleware is simply code that can be executed anywhere between a request and a response.

In our Hello World app we are logging out the server port once it has started - that is it. We get no other information about requests or errors. We can use _Middleware_ to achieve this.

Add the following to your app.js file:

```javascript
// app.js
.
.
.
app.set('view engine', 'ejs');


// Middleware
app.use(function(req, res, next) {
  console.log('%s request to %s from %s', req.method, req.path, req.ip);

  next();
});

app.get('/', function(req, res) {
.
.
.
```

Let's go through this: After setting up the `view engine` for our app, we use a new method of app called `use`. As an argument to `use` we pass in a function that performs some executables, log some data and fire a callback named `next`. This function, this block of code, is our middleware and `use` is a method given to us by Express whose purpose is to simply implement any middleware we pass to it.

In this example, we are simply logging out the request method ('GET'), the request path ('/') and the request IP ('127.0.0.1' - localhost). `next()` is just a callback function used for the purpose of allowing the app to continue on to other processes once this middleware is done executing. You can think of the `next()` function as telling the app to "move on."

The order of these arguments is crucial: request is always first, response is always second and the callback is always third.

## Adding Routes to our app - Codealong (15 mins)

Let's add some routes. This should all be familiar but let's go through it.

[ExpressJS 4.0](https://expressjs.com/en/guide/routing.html) comes with an Express Router module. Router is like a mini Express application. It doesn’t bring in views or settings but provides us with the routing APIs like `.use`, `.get`, `.param`, and `route`.

First we define our _router_. This is what handles our routing. It's normally better to use this way of doing routes (and extracting them into their own files) as it makes applications more modular, and you won't have a 500 line app.js.

```javascript
var express = require('express');
var router  = express.Router();
```

This needs to be under the definition of `var app`!  Then we add our routes.

```javascript
router.get('/', function(req, res) {
  res.render('index', { header: 'index!'});
});

router.get('/contact', function(req, res) {
  res.render('index', { header: 'contact!'});
});

router.get('/about', function(req, res) {
  res.render('index', { header: 'about!'});
});
```

At the bottom of the page add:

```javascript
app.use('/', router);
```

Here we are rendering our template and then passing in a local variable (_header_) to use in our template. We can insert the variable in our `index.ejs` file like this:

```ejs
<h1><%= header %></h1>
```


#### Creating a router module


Let's move this router into another file to separate it from our `app.js`

```bash
$ mkdir config
$ touch config/routes.js
```

Inside this `routes.js` file we need to move all of our route handlers and at the end of the file, we need to export our router:

```javascript
// config/routes.js

var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
  res.render('index', { header: 'index!'});
});

router.get('/contact', function(req, res) {
  res.render('index', { header: 'contact!'});
});

router.get('/about', function(req, res) {
  res.render('index', { header: 'about!'});
});

module.exports = router;
```

Now inside our `app.js`, let's require this router at the top:

```javascript
var router = require("./config/routes");
```

## Restful Routing - Intro (10 mins)

We will use the RESTful standard to build our web apps. At the moment, we've just covered how to handle GET requests, but we can create callbacks for all types of requests. For example, if we want to create a restful controller for the resource posts, we can add this into our `config/routes.js` file:

```javascript
router.get('/posts', function(req, res) {
  console.log("index");
  res.send("INDEX");
});

router.get('/posts/new', function(req, res) {
  console.log("new");
  res.send("NEW");
});

router.get('/posts/:id', function(req, res) {
  console.log("show");
  res.send("SHOW");
});

router.post('/posts', function(req, res) {
  console.log("create");
  res.send("CREATE");
});

router.get('/posts/:id/edit', function(req, res) {
  console.log("edit");
  res.send("EDIT");
});

router.put('/posts/:id', function(req, res) {
  console.log("update");
  res.send("UPDATE");
});

router.delete('/posts/:id', function(req, res) {
  console.log("delete");
  res.send("DELETE");
});
```

We can namespace our endpoints by adding a first argument to `.use()`, in this case "/posts". Likewise, we could've further namespaced our api with "/api/posts". Dev teams namespace their APIs with "/api" to help clearly define if an endpoint is meant for clients or other devs.

Anyway, the code above will create these 7 routes:


```javascript
GET    /posts
GET    /posts/:id
GET    /posts/new
POST   /posts
GET    /posts/:id/edit
PUT    /posts/:id
DELETE /posts/:id
```

If we want, we might create a dedicated router for this resource and namespace the routes like this:

```javascript
app.use("/posts", postsRouter)
```

On a side note, just like how we use `.use()` to integrate middleware into our app, express has a middleware method specifically for routes, `.param()`.

## BodyParser and handling params/JSON - Intro (5 mins)

When data is sent to the server via a POST request, the content of the request is passed as a string, but we want to access it as if it was a JSON object:

Let's create a new view file, `views/posts/new.ejs`, and inside add a form like this:

```html
<h1>New Post</h1>

<form method="post" action="/posts">
  <label>Title</label><br>
  <input type="text" name="post[title]"><br>

  <label>Author</label><br>
  <input type="text" name="post[author]"><br>

  <label>Content</label><br>
  <textarea name="post[content]"></textarea><br>

  <button>Go go gadget Postmaker</button><br>
</form>
```

Inside our new action, we then need to render this page:

```javascript
router.get('/posts/new', function(req, res) {
  res.render("posts/new");
});
```

Inside our create action, we need to logout the body of the HTTP request:

```js
router.post('/posts', function(req, res) {
  console.log(req.body)
})
```

Once this form is submitted, by default we this body will show was `undefined`. In order for it to be used, we need to use a package called `body-parser`.

## Configure your app to use body-parser - Codealong (10 mins)

First add the package to your `package.json` dependencies:

```bash
$ npm install body-parser --save
```

Now in `app.js`, add:

```javascript
var bodyParser = require("body-parser");
```

and also:

```javascript
app.use(bodyParser.urlencoded({
  extended: true
}));
```

The params passed with a request will be "decoded" automatically, allowing you to use dot notation when working with JavaScript objects.

```
{ post: { title: 'asdad', author: 'asdasd', content: 'asdadas' } }
```

If you are writing an api, meant to receive and send JSON, you would change the line above to:

```javascript
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
```

Now the app will decode all JSON received in the body of a client request.


## Independent Practice (15 minutes)

> ***Note:*** _This can be a pair programming activity or done independently._

In the same file, try to create the 7 Restful Routes for the resource "author". Every method should return some text saying the HTTP Verb, which URI has been used to do the request and which REST action it corresponds to.

Example, for a POST request to `/authors` the text sent back should be:

```
POST request to /authors, this is the CREATE action
```

Also, test your application with `cURL` requests to each of the RESTful endpoints.

## Conclusion (5 mins)
A framework can be overwhelming at the start, after a couple of days you will see how it makes your life easier.  We will work more on how to make RESTful controllers, this is just an introduction.

- What is Middleware and why is it helpful in Express?
- Explain how body-parser helps decode information in your application.
- Identify some similarities and differences between Express and Sinatra.

## Additional Links

- [Express Router Tutorial](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes)
