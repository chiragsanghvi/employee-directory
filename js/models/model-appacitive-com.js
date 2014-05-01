
Appacitive.initialize({
    apikey: 'kLICDfoSbyuxeQiw36qpcZJv7zeUxNte0sp1hr3oi8U=',
    appId: '57178692622877665',
    env: 'sandbox'
});

directory.Employee = Appacitive.Object.extend("employees", {

    defaults: {
        managerid: null,
        managedname: ''
    },

    constructor: function(attrs) {
        // Hack to set id property from __id as Appacitive doesn't support id directly and vice-versa
        if (attrs.id) attrs.__id = attrs.id
        else if (attrs.__id) attrs.id = attrs.__id;

        // Invoke base constructor
        Appacitive.Object.apply(this, arguments);
    },

    // Return id of this object
    getId: function() {
        return this.id();
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
        var query = new Appacitive.Queries.GraphProjectQuery('manages', [this.id()]);
        
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
                self.set('managerid', managedBy[0].id());
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

directory.EmployeeCollection = Appacitive.Collection.extend(({

    model: directory.Employee,

    // Override base fetch function to set filters
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

        // Call base fetch function with these arguments
        Appacitive.Collection.prototype.fetch.apply(this, arguments);
    }

}));

directory.ReportsCollection = Appacitive.Collection.extend(({

    model: directory.Employee,

    // Override fetch function to avoid making any calls
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
