function fix ( num ) {
  return Math.ceil( num * 100 ) / 100;
}
function rule ( originalAmount ) {
  var isGreedyUser = ${isGreedyUser}, 
    hasCouponOffer = ${hasCouponOffer}, 
    minLotteryAmount = ${minLotteryAmount}, 
    discountAmount = ${discountAmount}, 
    discountRate = ${discountRate};
  return _ruleForWeixin ( originalAmount, isGreedyUser, hasCouponOffer, minLotteryAmount, discountAmount, discountRate);
}
function _ruleForWeixin ( originalAmount, isGreedyUser, hasCouponOffer, minLotteryAmount, discountAmount, discountRate ) {  
  if ( hasCouponOffer ) {
    var realAmount = originalAmount * discountRate;
    if ( isGreedyUser || realAmount <= minLotteryAmount) {
      return fix( discountRate * 10 ) + '折立减' + fix( originalAmount - realAmount ) + '元，实付' + fix( realAmount ) + '元';
    }
    return fix( discountRate * 10 ) + '折立减' + fix( originalAmount - realAmount ) + '元，随机立减' + discountAmount + '元，实付' + fix( realAmount - discountAmount ) + '元';
  }
  if ( originalAmount <= minLotteryAmount ) {
    return '支付金额' + minLotteryAmount + '元以上才有折扣哦';
  }
  if ( isGreedyUser ) {
    return '您今天的3次人品已经被你用完了，实付' + originalAmount + '元';
  }
  return '人品爆发！本次优惠' + discountAmount + '元，实付' + fix( originalAmount - discountAmount ) + '元';
}
