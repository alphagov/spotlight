define(['fs', 'jsonschema'], function (fs, jsonschema) {
  describe('spotlight modules', function () {
    var moduleSchema = JSON.parse(fs.readFileSync('spec/module-schema.json'));
    var modules = fs.readdirSync('app/support/stagecraft_stub/responses/student-finance');
    modules.forEach(function (fileName) {
      describe('student-finance module ' + fileName, function () {
        xit('should conform to the schema definition', function () {
          var moduleToTest = JSON.parse(fs.readFileSync(path.join('app/support/stagecraft_stub/responses/student-finance', fileName)));
          var result = jsonschema.validate(moduleToTest, moduleSchema);
          expect(result.valid).toBeTruthy();
        });

      });
    });
  });
});
