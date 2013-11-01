Package.describe({
  summary: "A package for meteor database migrations"
});

Package.on_use(function (api, where) {
  api.add_files('migrations.js', ['server']);
});

Package.on_test(function (api) {
  api.use('migrations');

  api.add_files('migrations_tests.js', ['server']);
});
