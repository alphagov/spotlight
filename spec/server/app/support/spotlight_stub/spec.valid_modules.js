define(['fs', 'jsonschema'], function(fs, jsonschema) {
    describe('spotlight modules', function() {
        var module_schema = JSON.parse(fs.readFileSync('spec/module-schema.json'));
        var modules = fs.readdirSync('app/support/stagecraft_stub/responses/student-finance');
        modules.forEach(function(fileName) {
            describe('student-finance module ' + fileName, function() {
                xit('should conform to the schema definition', function() {
                    var module_to_test = JSON.parse(fs.readFileSync(path.join('app/support/stagecraft_stub/responses/student-finance', fileName)));
                    var result = jsonschema.validate(module_to_test, module_schema);
                    expect(result.errors).toBeFalsy();
                });

            });
        });
    });
});
