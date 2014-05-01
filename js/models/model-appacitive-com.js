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
        //Hack to set id property from __id as Appacitive doesn't support id directly and vice-versa
        if (attrs.id) attrs.__id = attrs.id
        else if (attrs.__id) attrs.id = attrs.__id;

        Appacitive.Object.apply(this, arguments);
    },

    getId: function() {
        return this.id();
    },

    name: function() {
        return this.get('firstname') + ' ' + this.get('lastname');
    },

    initialize: function() {
        this.reports = new directory.ReportsCollection();

        //override fetch method 
        this.fetch = this.fetchAllDetails;
    },

    //use projection query to fetch employee details and all employees who report to him as well as to whom he reports
    fetchAllDetails: function(options) {
        var self = this;
        var query = new Appacitive.Queries.GraphProjectQuery('manages', [this.id()]);
        var promise = Appacitive.Promise.buildPromise(options);
        
        query.fetch().then(function(employees) {
            self.copy(employees[0].toJSON(), true);
            self.children = employees[0].children;

            var reports = self.children.reports;
            var manages = self.children.managedby;
            if (manages.length > 0) {
                self.set('managerid', manages[0].id());
                self.set('managername', manages[0].name());
            }
            self.reports.add(reports);

            promise.fulfill.apply(promise, [self, reports]);
        }, function() {
            promise.reject.apply(promise, arguments);
        });

        return promise;
    }

});

directory.EmployeeCollection = Appacitive.Collection.extend(({

    model: directory.Employee,

    fetch: function(options) {
        console.log('custom fetch');
        if (options.data && options.data.name) {
            var firstNameFilter = Appacitive.Filter.Property('firstname').match(options.data.name);
            var lastNameFilter = Appacitive.Filter.Property('lastname').match(options.data.name);
            this.query().filter(Appacitive.Filter.Or(firstNameFilter, lastNameFilter));
        } else {
            this.query().filter('');
        }

        Appacitive.Collection.prototype.fetch.apply(this, arguments);
    }

}));

directory.ReportsCollection = Appacitive.Collection.extend(({

    model: directory.Employee,

    fetch: function(options) {
        var promise = Appacitive.Promise.buildPromise(options);
        var self = this;
        setTimeout(function() {
            promise.fulfill(self.models);
        }, 0);
        return promise;
    }

}));
