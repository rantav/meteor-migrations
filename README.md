meteor-migrations
=================

A meteor package for database migrations.  

[![Build Status](https://travis-ci.org/rantav/meteor-migrations.png?branch=master)](https://travis-ci.org/rantav/meteor-migrations)

Datebase migrations are "administrative" updates to your collections, for example iteration over all Items and add a status attribute if the status doesn't already exist.  
A migration is typically run when refactoring code, for example if the status attribute is a new attribute and it doesn't exist in old Items then you might want to iterate over all items to add this attribute (instead of checking for its existence at runtime). This can make the codebase cleaner and easier to read. It's not always the right solution, but many times it is. 

This package adds simple instrumentation to this process.

* Run all not previously run migrations at startup
* If a migration was already run, don't run it again
* Provides a useful log object that logs to the console as well as to the migration item in the database
* Records the result of all migrations, so if for example at error was thrown if gets logged and the migration status is set to ERROR (and then throws)
* Provides an easy way to introspect previous migrations.

# Installation
```
mrt add migrations
```

This package creates a collection named migrations and adds status and log lines to the collection. 


# Usage
```
// Add a migration. Usually you want to add it at server startup.
Meteor.startup(function(){
  Meteor.Migrations.add('1', function(log) {
    // log writes to the console as well as to the database. 
    log.info("Adding the attribute status to all items that don't have it");
    Items.find({status: {$exists : false}}).forEach(function (item) {
      log.info("Adding status to " + item._id);
      Items.update(item._id, {$set: {status: 'CREATED'}});
    });
  });
});

// Get migration by ID
var migration = Meteor.Migrations.get('1');
console.log(migration);

// List all migrations (returns a cursor)
var list = Meteor.Migrations.list();
console.log(list.fetch());


// List only error migrations
var errors = Meteor.Migrations.list('ERROR');
console.log(errors.fetch());

```

## The log 
The function passed to `Meteor.Migrations.add` accepts a log object. 
This object has three methods: `log.info`, `log.warn` and `log.error`. 
These methods write both to the console as well as to the loglines array of the migration item in the database, so when you need to retrive old loglines per migration it's easy to do this via the mongo console: `db.migrations.findOne({_id: 'migration-id'})`

You can also get a migration item in Meteor, not in the mongo console,  using `Meteor.Migrations.get('migration-id')`. This will provide the status and loglines.

## The migrations collection
This package logs the migrations status using the collection `migrations`. So this assumes you don't use this collecgion for other purposes. 
The IDs of the objects in this collecgion are the migration IDs you specify to the function `Meteor.Migrations.add`.
