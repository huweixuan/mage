describe("mage", function(){
    describe("mage.my_method()", function(){
        it("should return 1", function(done){
            _use('mage@latest', function(exports) {
                expect('my_method' in exports);
                done();
            });
        });
    });
});