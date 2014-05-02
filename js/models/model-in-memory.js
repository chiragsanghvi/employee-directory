directory.Employee = Backbone.Model.extend({

    initialize:function () {
        this.reports = new directory.ReportsCollection();
        this.reports.parent = this;
    },

    sync: function(method, model, options) {
        if (method === "read") {
            directory.store.findById(parseInt(this.id), function (data) {
                options.success(data);
            });
        }
    },

    getId: function() {
        return this.get('id');
    }
});

directory.EmployeeCollection = Backbone.Collection.extend({

    model: directory.Employee,

    sync: function(method, model, options) {
        if (method === "read") {
            directory.store.findByName(options.data.name, function (data) {
                options.success(data);
            });
        }
    }

});

directory.ReportsCollection = Backbone.Collection.extend({

    model: directory.Employee,

    sync: function(method, model, options) {
        if (method === "read") {
            directory.store.findByManager(this.parent.id, function (data) {
                options.success(data);
            });
        }
    }

});

directory.MemoryStore = function (successCallback, errorCallback) {

    this.findByName = function (searchKey, callback) {
        var employees = this.employees.filter(function (element) {
            var fullName = element.firstName + " " + element.lastName;
            return fullName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
        });
        callLater(callback, employees);
    }

    this.findByManager = function (managerid, callback) {
        var employees = this.employees.filter(function (element) {
            return managerid === element.managerid;
        });
        callLater(callback, employees);
    }

    this.findById = function (id, callback) {
        var employees = this.employees;
        var employee = null;
        var l = employees.length;
        for (var i = 0; i < l; i++) {
            if (employees[i].id === id) {
                employee = employees[i];
                break;
            }
        }
        callLater(callback, employee);
    }

    // Used to simulate async calls. This is done to provide a consistent interface with stores that use async data access APIs
    var callLater = function (callback, data) {
        if (callback) {
            setTimeout(function () {
                callback(data);
            });
        }
    }

    this.employees = [
        {"id": 1, "firstname": "James", "lastname": "King", "managerid": 0, "managername": "", "title": "President and CEO", "department": "Corporate", "cellphone": "617-000-0001", "officephone": "781-000-0001", "email": "jking@fakemail.com", "city": "Boston, MA", "pic": "/pics/james_king.jpg", "twitterid": "@fakejking", "blog": "http://coenraets.org"},
        {"id": 2, "firstname": "Julie", "lastname": "Taylor", "managerid": 1, "managername": "James King", "title": "VP of Marketing", "department": "Marketing", "cellphone": "617-000-0002", "officephone": "781-000-0002", "email": "jtaylor@fakemail.com", "city": "Boston, MA", "pic": "/pics/julie_taylor.jpg", "twitterid": "@fakejtaylor", "blog": "http://coenraets.org"},
        {"id": 3, "firstname": "Eugene", "lastname": "Lee", "managerid": 1, "managername": "James King", "title": "CFO", "department": "Accounting", "cellphone": "617-000-0003", "officephone": "781-000-0003", "email": "elee@fakemail.com", "city": "Boston, MA", "pic": "/pics/eugene_lee.jpg", "twitterid": "@fakeelee", "blog": "http://coenraets.org"},
        {"id": 4, "firstname": "John", "lastname": "Williams", "managerid": 1, "managername": "James King", "title": "VP of Engineering", "department": "Engineering", "cellphone": "617-000-0004", "officephone": "781-000-0004", "email": "jwilliams@fakemail.com", "city": "Boston, MA", "pic": "/pics/john_williams.jpg", "twitterid": "@fakejwilliams", "blog": "http://coenraets.org"},
        {"id": 5, "firstname": "Ray", "lastname": "Moore", "managerid": 1, "managername": "James King", "title": "VP of Sales", "department": "Sales", "cellphone": "617-000-0005", "officephone": "781-000-0005", "email": "rmoore@fakemail.com", "city": "Boston, MA", "pic": "/pics/ray_moore.jpg", "twitterid": "@fakermoore", "blog": "http://coenraets.org"},
        {"id": 6, "firstname": "Paul", "lastname": "Jones", "managerid": 4, "managername": "John Williams", "title": "QA Manager", "department": "Engineering", "cellphone": "617-000-0006", "officephone": "781-000-0006", "email": "pjones@fakemail.com", "city": "Boston, MA", "pic": "/pics/paul_jones.jpg", "twitterid": "@fakepjones", "blog": "http://coenraets.org"},
        {"id": 7, "firstname": "Paula", "lastname": "Gates", "managerid": 4, "managername": "John Williams", "title": "Software Architect", "department": "Engineering", "cellphone": "617-000-0007", "officephone": "781-000-0007", "email": "pgates@fakemail.com", "city": "Boston, MA", "pic": "/pics/paula_gates.jpg", "twitterid": "@fakepgates", "blog": "http://coenraets.org"},
        {"id": 8, "firstname": "Lisa", "lastname": "Wong", "managerid": 2, "managername": "Julie Taylor", "title": "Marketing Manager", "department": "Marketing", "cellphone": "617-000-0008", "officephone": "781-000-0008", "email": "lwong@fakemail.com", "city": "Boston, MA", "pic": "/pics/lisa_wong.jpg", "twitterid": "@fakelwong", "blog": "http://coenraets.org"},
        {"id": 9, "firstname": "Gary", "lastname": "Donovan", "managerid": 2, "managername": "Julie Taylor", "title": "Marketing Manager", "department": "Marketing", "cellphone": "617-000-0009", "officephone": "781-000-0009", "email": "gdonovan@fakemail.com", "city": "Boston, MA", "pic": "/pics/gary_donovan.jpg", "twitterid": "@fakegdonovan", "blog": "http://coenraets.org"},
        {"id": 10, "firstname": "Kathleen", "lastname": "Byrne", "managerid": 5, "managername": "Ray Moore", "title": "Sales Representative", "department": "Sales", "cellphone": "617-000-0010", "officephone": "781-000-0010", "email": "kbyrne@fakemail.com", "city": "Boston, MA", "pic": "/pics/kathleen_byrne.jpg", "twitterid": "@fakekbyrne", "blog": "http://coenraets.org"},
        {"id": 11, "firstname": "Amy", "lastname": "Jones", "managerid": 5, "managername": "Ray Moore", "title": "Sales Representative", "department": "Sales", "cellphone": "617-000-0011", "officephone": "781-000-0011", "email": "ajones@fakemail.com", "city": "Boston, MA", "pic": "/pics/amy_jones.jpg", "twitterid": "@fakeajones", "blog": "http://coenraets.org"},
        {"id": 12, "firstname": "Steven", "lastname": "Wells", "managerid": 4, "managername": "John Williams", "title": "Software Architect", "department": "Engineering", "cellphone": "617-000-0012", "officephone": "781-000-0012", "email": "swells@fakemail.com", "city": "Boston, MA", "pic": "/pics/steven_wells.jpg", "twitterid": "@fakeswells", "blog": "http://coenraets.org"}
    ];

    callLater(successCallback);

}

directory.store = new directory.MemoryStore();