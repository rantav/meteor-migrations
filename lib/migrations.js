// Inspiration and prior work: 
// https://github.com/SachaG/Telescope/blob/master/server/migrations.js
// http://stackoverflow.com/questions/10365496/meteor-how-to-perform-database-migrations


/*

Optional statuses: NOT_STARTED, STARTED, DONE, ERROR
*/
var Migrations = function() {
  var migrations = new Meteor.Collection('migrations');

  var createLogger = function(migrationId) {
    return {
      info: function(msg) {log(migrationId, 'info', msg);},
      warn: function(msg) {log(migrationId, 'warn', msg);},
      error: function(msg) {log(migrationId, 'error', msg);}
    };
  };

  var log = function(id, level, msg) {
    var ts = new Date();
    console[level]('migration[' + id + ', ' + ts + '] ' + msg);
    migrations.update({_id: id}, {
      $push: {
        loglines: {
          ts: ts, 
          level: level, 
          line: msg
        }
      }
    });
  };

  var add = function(id, migrationFunction, options) {
    check(id, String);
    check(migrationFunction, Function);
    var force = options && options.force
    var migration = migrations.findOne({_id: id});
    if (migration) {
      if (force) {
        console.log('Migration ' + id + ' already exists, but options.force is true. Will rerun');
      } else {
        console.log('Migration "' + id + '" already run. OK.')
        return;        
      }
    }
    if (!migration) {
      migrations.insert({_id: id, status: 'NOT_STARTED', loglines: []});
    }
    var log = createLogger(id);
    log.info('Starting migration ' + id);
    try {
      migrations.update({_id: id}, {$set: {status: 'STARTED'}});
      migrationFunction(log);
      migrations.update({_id: id}, {$set: {status: 'DONE'}});
    } catch(e) {
      log.error('Error when running migration ' + id + '. Error: [' + e + ']')
      migrations.update({_id: id}, {$set: {status: 'ERROR'}});
      throw e;
    }
    log.info('Finished migration ' + id);
  };

  var get = function(id) {
    check(id, String);
    return migrations.findOne({_id: id});    
  };

  // List all migrations.
  // opt_status: filter by status. 
  var list = function(opt_status) {
    if (opt_status) {
      return migrations.find({status: opt_status});
    } else {
      return migrations.find();
    }
  };

  return {
    add: add,
    get: get,
    list: list,
    _collection: migrations
  };
};

Meteor.Migrations = new Migrations();