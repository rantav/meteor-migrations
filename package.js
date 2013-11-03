Package.describe({
  summary: "A package for meteor database migrations"
});

Package.on_use(function (api, where) {
  api.add_files('lib/migrations.js', ['server']);
});

Package.on_test(function (api) {
  api.use(['tinytest', 'test-helpers'], ['server']);
  api.add_files('lib/migrations.js', ['server']);
  api.add_files('tests/migrations_tests.js', ['server']);
});
