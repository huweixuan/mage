function checkMenu () {
  var list = _q('#checkMenu');
  var mask = _q('#mask');
  if (list.style.display == 'none') {
    list.style.display = 'block';
    mask.style.display = 'block';
  } else {
    list.style.display = 'none';
    mask.style.display = 'none';
  }
}