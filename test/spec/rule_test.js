describe("rule", function () {
  describe("_ruleForWeixin()", function () {
    it("1.假如用户当日支付超过3次，将不能使用任何折扣功能", function ( done ) {
      var result = _ruleForWeixin(1000, true);
      expect(result).equal("您今天的3次人品已经被你用完了，实付1000元");
      done();
    });
    it("2-1.此店没有Coupon，当原价小于最低消费时，无法享受随机折扣", function ( done ) {
      var result = _ruleForWeixin(4, false, false, 5, 5);
      expect(result).equal("支付金额5元以上才有折扣哦");
      done();
    });
    it("2-2.此店没有Coupon，当原价等于最低消费时，无法享受随机折扣", function ( done ) {
      var result = _ruleForWeixin(5, false, false, 5, 5);
      expect(result).equal("支付金额5元以上才有折扣哦");
      done();
    });
    it("2-3.此店没有Coupon，当原价大于最低消费时，享受随机折扣", function ( done ) {
      var result = _ruleForWeixin(1000, false, false, 5, 5);
      expect(result).equal("人品爆发！本次优惠5元，实付995元");
      done();
    });
    it("3-1.此店有Coupon，当折扣价小于最低消费时，无法享受随机折扣", function ( done ) {
      var result = _ruleForWeixin(8, false, true, 5, 5, 0.5);
      expect(result).equal("折扣金额5元以上才有折扣哦");
      done();
    });
    it("3-2.此店有Coupon，当折扣价等于最低消费时，无法享受随机折扣", function ( done ) {
      var result = _ruleForWeixin(10, false, true, 5, 5, 0.5);
      expect(result).equal("折扣金额5元以上才有折扣哦");
      done();
    });
    it("3-3.此店有Coupon，当折扣价大于最低消费时，享受随机折扣", function ( done ) {
      var result = _ruleForWeixin(1000, false, true, 5, 5, 0.5);
      expect(result).equal("5折立减500元，随机立减5元，实付495元");
      done();
    });
  });
  describe("_ruleForAlipay()", function () {
    it("1.假如用户当日支付超过3次，将不能使用任何折扣功能", function ( done ) {
      var result = _ruleForAlipay(1000, true);
      expect(result).equal("您今天的3次人品已经被你用完了，实付1000元");
      done();
    });
    it("2.此店有Coupon，微信支付不享受随机折扣，只享受优惠", function ( done ) {
      var result = _ruleForAlipay(1000, false, true, 0.5);
      expect(result).equal("5折立减500元，实付500元");
      done();
    });
  });
});