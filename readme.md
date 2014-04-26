## Employee Directory ##

### Sample Application built with Backbone.js and Twitter Bootstrap using 2 data adapters viz. in-memory store and [Appacitive](http://www.appacitive.com) for persistences ###

"Backbone Directory" is a simple Employee Directory application built with [Backbone.js](http://backbonejs.org) and [Twitter Bootstrap] (http://twitter.github.io/bootstrap/).

Refer to [this blog post]() for more information about the application.

The application runs out-of-the-box with an in-memory data store or Appacitive.

- [directory-appacitive](https://github.com/chiragsanghvi/employee-directory/tree/master/js/models/model-appacitive-com.js) (Appacitive persistence implementation)
- [directory-in-memory](https://github.com/chiragsanghvi/employee-directory/tree/master/js/models/model-in-memory.js) (In-memory store implementation)

To run this application you'll need a web server as the templates are fetched using AJAX calls. 

For MAC OS you can simply use [Anvil](http://anvilformac.com/). For
For others, you can either use apache or [static node.js server](https://gist.github.com/rpflorence/701407)

This sample has been forked from [ccoenraets/directory-backbone-bootstrap](https://github.com/ccoenraets/directory-backbone-bootstrap).
