## Employee Directory ##

### Sample Application built with Backbone.js and Twitter Bootstrap using 2 data adapters viz. localstorage and [Appacitive](http://www.appacitive.com) as data store ###

"Employee Directory" is a simple application built with [Backbone.js](http://backbonejs.org) and [Twitter Bootstrap] (http://twitter.github.io/bootstrap/).

Refer to [this tutorial](http://devcenter.appacitive.com/javascript/samples/employee-directory) for more information about the application.

You can view the live application hosted on Appacitive <a href="http://emp-directory.appacitive.com">here<a>.

The application runs out-of-the-box with an in-memory or Appacitive data store.

- [directory-appacitive](https://github.com/chiragsanghvi/employee-directory/tree/master/js/models/model-appacitive-com.js) (Appacitive persistence implementation)
- [directory-in-memory](https://github.com/chiragsanghvi/employee-directory/tree/master/js/models/model-in-memory.js) (In-memory store implementation)

To run this application you'll need a web server as the templates are fetched using AJAX calls. 

For MAC OS you can simply use [Anvil](http://anvilformac.com/). 

For others, just install [nodejs](http://nodejs.org) and then run this command in your app's directory

```javascript
node server.js 8000
```

This sample has been forked from [ccoenraets/directory-backbone-bootstrap](https://github.com/ccoenraets/directory-backbone-bootstrap).
