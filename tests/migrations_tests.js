;(function () {
  var migrations = Meteor.Migrations._collection;

  function reset () {
    migrations.remove({})
  }


  Tinytest.add(
    'list/get - empty migrations', 
    function (test) {
      reset();
      test.equal(Meteor.Migrations.list().fetch(), [], 'should be an emty array when there is no data');
      test.equal(typeof Meteor.Migrations.get('1'), 'undefined');
    });

  Tinytest.add(
    'list/get - with migrations', 
    function (test) {
      reset();
      Meteor.Migrations.add('mig1', function(log){log.info('hello')});
      var migs = Meteor.Migrations.list().fetch();
      test.equal(migs.length, 1);
      test.isTrue(Meteor.Migrations.get('mig1').loglines.length > 0);
    });

  Tinytest.add(
    'add - the real thing. run a simple migration', 
    function (test) {
      reset();
      var done = false;
      Meteor.Migrations.add('mig', function(log){
        done = true;
      });
      test.isTrue(done);
      test.equal(Meteor.Migrations.get('mig').status, 'DONE', 'status should be DONE');
    });

  Tinytest.add(
    'add - with throws', 
    function (test) {
      reset();
      var done = false;
      test.throws(function(){
        Meteor.Migrations.add('mig', function(log){
          throw new Meteor.Error('Oh no!');
          done = true;
        });
      });
      test.isFalse(done);
      test.equal(Meteor.Migrations.get('mig').status, 'ERROR', 'status should be ERROR');
    });

  Tinytest.add(
    'add - runs only once per migration ID', 
    function (test) {
      reset();
      var runs = 0;
      Meteor.Migrations.add('mig', function(log){
        ++runs;
      });
      test.equal(runs, 1);

      Meteor.Migrations.add('mig', function(log){
        ++runs;
      });
      test.equal(runs, 1);
    });

  Tinytest.add(
    'add - runs once per different migration ID', 
    function (test) {
      reset();
      var runs = 0;
      Meteor.Migrations.add('mig1', function(log){
        ++runs;
      });
      test.equal(runs, 1);

      Meteor.Migrations.add('mig2', function(log){
        ++runs;
      });
      test.equal(runs, 2);
    });

  Tinytest.add(
    'list - filter by status', 
    function (test) {
      reset();
      test.throws(function(){
        Meteor.Migrations.add('mig1', function(log){
          throw new Meteor.Error('Oh no!');
        });
      });
      Meteor.Migrations.add('mig2', function(log){
        // OK
      });

      test.equal(Meteor.Migrations.list().fetch().length, 2);
      test.equal(Meteor.Migrations.list('DONE').fetch().length, 1);
      test.equal(Meteor.Migrations.list('ERROR').fetch().length, 1);
      

    });

}());