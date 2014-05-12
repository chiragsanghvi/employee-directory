

// Initialize Appacitive SDK
Appacitive.initialize({
    apikey: '',
    appId: '',
    env: 'sandbox'
});

// Employee Model
// ----------

// Our basic **Employee** model.
// To use Appacitive as data store
directory.Employee = Appacitive.Object.extend({

    //type name to which this model binds on Appacitive
    typeName: "employee",

    // Default attributes for the emplyee
    defaults: {
        managerid: null,
        managedname: ''
    },

    // Returns name formed by concatinating firstnamr and lastname
    name: function() {
        return this.get('firstname') + ' ' + this.get('lastname');
    },

    // To initialize reports collection
    // And override default fetch function
    // To call fetchDetails
    initialize: function() {
        this.reports = new directory.ReportsCollection();

        //override fetch method 
        this.fetch = this.fetchAllDetails;
    },

    // Use projection query to fetch employee details for this employee
    // Returns all employees who report to this employee as well as to whom this employee reports
    fetchAllDetails: function(options) {
        var self = this;

        // Create grpah projection query by pass employee id
        var query = new Appacitive.Queries.GraphAPI('manages', [this.id]);
        
        // Create a promise
        var promise = Appacitive.Promise.buildPromise(options);
        
        // Call fetch
        query.fetch().then(function(employees) {

            // As we've overrided fetch function we'll need to copy 
            // employee attributes in existing object
            self.copy(employees[0].toJSON(), true);
            
            // Contains all employees who're connected to this employee by manages relationship
            self.children = employees[0].children;

            
            // reports contains employees with label `employee` in relation
            // Basically reports contains all employees who report directly to this employee
            var reports = self.children.reports;

            // managedBy contains employees with label `manager` in relation
            // Basically managedBy contains employee to whom this employee directly reports
            var managedBy = self.children.managedby;
            
            // If this employee is managed by any other employye 
            // Then we set managerid and managername property in this e,ployee
            if (managedBy.length > 0) {
                self.set('managerid', managedBy[0].id);
                self.set('managername', managedBy[0].name());
            }

            // Add reports to reports collection of this object
            self.reports.add(reports);

            // Fulfill the promise
            promise.fulfill.apply(promise, [self, reports]);
        }, function() {
            // Reject the promise
            promise.reject.apply(promise, arguments);
        });

        // Return promise
        return promise;
    }

});

// Employee Collection
// ---------------

// The collection of employees is backed by *Appacitive*
directory.EmployeeCollection = Appacitive.Collection.extend(({

    // Reference to this collection's model.
    model: directory.Employee,

    // Override base fetch function to set filters in query when called
    fetch: function(options) {
        console.log('custom fetch');
        // If options contain name then only define filters else set filter as empty
        if (options.data && options.data.name) {
            // Filter on firstname
            var firstNameFilter = Appacitive.Filter.Property('firstname').match(options.data.name);
            
            // Filter on firstname
            var lastNameFilter = Appacitive.Filter.Property('lastname').match(options.data.name);
            
            // Combine both the filters by Oring them
            var filter = Appacitive.Filter.Or(firstNameFilter, lastNameFilter);

            // Set filter for this collection 
            this.query().filter(filter);
        } else {
            // Set empty filter
            this.query().filter('');
        }

        // Call base fetch function with all arguments
        Appacitive.Collection.prototype.fetch.apply(this, arguments);
    }

}));

// ReportsCollection Collection
// ---------------

// The collection of employees who report to another employee
directory.ReportsCollection = Appacitive.Collection.extend(({

    // Reference to this collection's model.
    model: directory.Employee,

    // Override fetch function to avoid making any API calls
    // As projection query from employee fetches and adds employees to this collection
    fetch: function(options) {
        var promise = Appacitive.Promise.buildPromise(options);
        var self = this;
        setTimeout(function() {
            promise.fulfill(self.models);
        }, 0);
        return promise;
    }

}));
