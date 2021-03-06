function fix ( num ) {
  return Math.ceil( num * 100 ) / 100;
}
function rule ( originalAmount ) {
  var hasCouponOffer = ${hasCouponOffer},
    discountRate = ${discountRate};
  return _ruleForAlipay( originalAmount, hasCouponOffer, discountRate );
}
function _ruleForAlipay ( originalAmount, hasCouponOffer, discountRate ) {
  if ( hasCouponOffer ) {
    var realAmount = originalAmount * discountRate;
    return fix( discountRate * 10 ) + '折立减' + fix( originalAmount - realAmount ) + '元，实付' + fix( realAmount ) + '元';
  }
  return '实付' + fix( originalAmount ) + '元';
}
