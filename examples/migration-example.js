Meteor.startup(function(){
  Meteor.Migrations.add('1', function(log) {
    // log writes to the console as well as to the database. 

  });
});

var migration = Meteor.Migrations.get('1');
console.log(migration);

var list = Meteor.Migrations.list();
console.log(list);
