Package.describe({
  summary: "A package for meteor database migrations"
});

Package.on_use(function (api, where) {
  api.add_files('meteor-migrations.js', ['server']);
});

Package.on_test(function (api) {
  api.use('meteor-migrations');

  api.add_files('meteor-migrations_tests.js', ['server']);
});
