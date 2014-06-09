	//页面初始化
	window.addEventListener('DOMContentLoaded',function(){
		//隐藏微信工具栏
		document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
			WeixinJSBridge.call('hideToolbar');
		});
		initPageRange();
		if(_isIOS){
            _q("#Menu section article").style.overflowY ="scroll";
        }
		//初始化分类列表
        //initCategory(appid, openid, outletid, outletMenuId);
	});
	//页面纵横切换
    window.addEventListener('orientationchange', function(){
        initPageRange();
    });
    //窗口大小改变
    window.onresize = function(){
    	setTimeout(function(){
    		initPageRange();
    	},100);
    };
    //滚动加载更多
    function infoSectionScroll(categoryId, openid, outletid, outletMenuId, pageNow){
    	var infoSection = document.getElementById('infoSection');
    	var pInfo = document.getElementById('pInfo');
    	//元素的高度，=可见部分
    	var clientHeight = document.documentElement.clientHeight;
    	var offsetHeight = pInfo.offsetHeight;
		//alert(offsetHeight+' ' + clientHeight + ' ' + pageNow+' '+infoSection.scrollTop);
		var testDiv = document.getElementById('testScroll');
    	infoSection.onscroll = function(){
    		//元素内容的高度，=可见部分+不可见部分
    		offsetHeight = pInfo.offsetHeight;
    		var scrollTop = infoSection.scrollTop;
    		var left = offsetHeight - clientHeight - scrollTop;
    		if(testDiv != null){
    			testDiv.innerHTML = left;
    		}
    		var scrollFlag = false;
    		if(left < 50){
    			scrollFlag = true;
    		}
			if(scrollFlag){
				var loadMore = document.getElementById('load_more');
				if(loadMore != null){
					loadMore.parentNode.removeChild(loadMore);
					initCategoryListMenuAsyncPage(categoryId, openid, outletid, outletMenuId, 'load_more', pageNow);
				}
			}
    	};
    }
    //初始化更多按钮
    function initLoadMore(categoryId, openid, outletid, outletMenuId, pageNow){
    	var loadMore = document.getElementById('load_more');
    	if(loadMore != null){
			loadMore.onclick=function(){
				loadMore.parentNode.removeChild(loadMore);
				initCategoryListMenuAsyncPage(categoryId, openid, outletid, outletMenuId, 'load_more', pageNow);
			};
    	}
    }
	//计算窗口页面高度
    function initPageRange(){
    	//页面高度
        var pageHeight = document.documentElement.clientHeight +"px";
        document.getElementById("navBar").style.height =  pageHeight;
        document.getElementById("infoSection").style.height =  pageHeight;
    }
   //初始化分类数据，菜单数据
	function initCategory(appid, openid, outletid, outletMenuId){
		var navBar = document.getElementById("navBar");
		navBar.innerHTML = '';
		var params = {
			"omId": outletMenuId,
			"outlet":outletid
		}
		_doAjax('caipin_cate.php', 'GET', params, function(ret){
			navBar.innerHTML = ret;
			initDishTotal(openid,appid);
	        initSelectedCategory(openid, outletid, outletMenuId);
		},false);
	}
	    //初始化菜品总数
    function initDishTotal(openid,appid){
		_doAjax('dishNum_json.php?t=a&openid='+openid+'&outletCode='+outletCode, 'GET', '', function(ret){
			initDishOrderData(ret,openid,appid);
			var totalNumber = parseInt(ret['totalNumber']);
			updateTotal(totalNumber, 'add', ret['totalPrice']);
		},true);
    }
    //ajax处理异步更新菜单信息
    function initSelectedCategory(openid,outletid, outletMenuId){
        var ddTags = _qAll('#navBar dd');
        var article = _q("#infoSection article");
        _forEach(ddTags, function(ele, idx, ddTags) {
    		var currentDdTag = ddTags[idx];
    		if(currentDdTag.className == 'active'){
    			initCategoryListMenuAsync(currentDdTag.getAttribute('categoryId'), openid,outletid, outletMenuId);
    		}
            currentDdTag.onclick = function(){
                _q('.active').className = null;
                this.className = "active";
                initCategoryListMenuAsync(currentDdTag.getAttribute('categoryId'), openid,outletid, outletMenuId);
            }
        });
    }

	//加载菜单列表数据
	function initCategoryListMenu(categoryId, openid, outletid, outletMenuId, result, divTagId){
		var itemList = result['data'];
		var categoryId = result['categoryId'];
		var pageNow = result['pageNow'];
		var totalPage = result['totalPage'];
		var div = document.getElementById('pInfo');
		var str = '';
		//初始化第一页
		var firstPage = pageNow <= 1?true:false;
		if(firstPage){
			str += '<div style="height:1px"></div>';
			div.innerHTML = '';
		}else{
			str = div.innerHTML;
		}
		for(key in itemList) {
			//项目信息
			var item = itemList[key];
			//项目id
			var itemid = item['itemid'];
			//项目名称
			var name = item['name'];
			//项目价格
			var priceValue = item['price'];
			//priceValue = parseFloat(priceValue).toFixed(2) * 100/100;
			//项目描述
			var desc = item['desc'];
			//已点数量
			var qty = item['qty'];
			//项目图片
			var img = item['img'];
			//缩图
			var imgThum = '/gmmenu_upload/';
			imgThum = img.substring(imgThum.length);
			imgThum = '/gmmenu_upload/resize/100X100f/'+imgThum;
            var hotHtml = '';
            var attrList = " price='"+priceValue+"' itemid='"+itemid+"' name='"+name+"' desc='"+desc+"' ";
              str += "<dl "+attrList+"><dt><nobr>"+name+"</nobr></dt><dd><a href='javascript:void(0)' class='dataIn'><img original='" + imgThum + "' src='" + imgThum + "' alt='img' title='' />"+hotHtml+"</a></dd><dd>"+priceValue+"</dd><dd class='btn'><button class='minus'><strong></strong></button><i>"+qty+"</i><button class='add'><strong></strong></button></dd></dl>";
        }
        if(pageNow < totalPage){
        	str += "<div id='load_more'>加载中...</div>";
        }
        if (_q('.active').getAttribute('categoryId') == categoryId) {
            div.innerHTML = str;
            if(firstPage){//第一页时滚动1PX，解决按钮不可点bug
            	_q('#infoSection').scrollTop = 1;
            }
            clickAddMinButton();
            popItemDetailMsg();
        }
	}
	//异步加载菜单列表
	function initCategoryListMenuAsync(categoryId, openid, outletid, outletMenuId){
		initCategoryListMenuAsyncPage(categoryId, openid, outletid, outletMenuId, '', 1);
	}

	//异步加载菜单列表
	function initCategoryListMenuAsyncPage(categoryId, openid, outletid, outletMenuId, divTagId, pageNow){
		var params = {
			"cid":categoryId,
			"openid":openid,
			"omId": outletMenuId,
			"outlet":outletid,
			"outletCode":outletCode,
			"pn":pageNow
		}
		if(pageNow == 1){
			MLoading.show('菜单加载中');
		}
		_doAjax('caipin_json.php', 'GET', params, function(ret) {
			if(pageNow == 1){
				MLoading.hide();
			}
			initCategoryListMenu(categoryId, openid, outletid, outletMenuId, ret, divTagId);
			//alert(ret['pageNow'] +' '+ ret['totalPage']);
			if(ret['pageNow'] < ret['totalPage']){
            	infoSectionScroll(categoryId, openid, outletid, outletMenuId, pageNow+1);
            }
		}, true);
	}

	//更新菜单总数
    function updateTotal(newNumber, operation, newPrice){
        var totalNumObj = _q('.footFix .num');
        var totalNumText = totalNumObj.innerHTML;
        var totalNumOrg = parseInt(totalNumText);
        var newTotal = totalNumOrg;
        var totalPriceObj = _q('#totalPrice');
        var totalPriceText = totalPriceObj.innerHTML;
        var totalPriceOrg = parseFloat(totalPriceText);
        var newTotalPrice = totalPriceOrg;
        var newPriceFloat = parseFloat(newPrice);
        if(operation == 'add'){
	        newTotal = newTotal + newNumber;
	        newTotalPrice = newTotalPrice + newPriceFloat;
        }else if(operation == 'min'){
        	newTotal = newTotal - newNumber;
        	if(newTotal < 0){
        		newTotal = 0;
        	}
        	newTotalPrice = newTotalPrice - newPriceFloat;
        	if(newTotalPrice < 0){
        		newTotalPrice = 0;
        	}
        }
        totalNumObj.innerHTML = newTotal;
        totalPriceObj.innerHTML = newTotalPrice;
    }
    //选择菜品按钮样式
    function clickAddMinButton(){
        var btn = _qAll("article dl .btn");
        var btnIndex = 0,btnLength = btn.length;
        for(btnIndex;btnIndex<btnLength;btnIndex++){
            var countNumText=parseInt(btn[btnIndex].children[1].innerHTML),
                btnAdd=btn[btnIndex].children[2],
                btnMin=btn[btnIndex].children[0];

            btnShowHide(countNumText,btn[btnIndex]);

            var originalNum,
                beforeRemoveDish=false,
                beforeAddDish=false;

            btnAdd.addEventListener(_movestartEvt,function(){
                var _self = this;
                originalNum = parseInt(_self.parentNode.children[1].innerHTML, 10);
                countNumText =  originalNum +1;
                if (countNumText == 1) {
                    _self.parentNode.children[1].innerHTML = 1;
                    btnShowHide(1, _self.parentNode);
                } else {
                    _self.parentNode.children[1].innerHTML = countNumText;
                    btnShowHide(countNumText,_self.parentNode);
                }
            })

            btnAdd.addEventListener(_moveendEvt,function(){
                var _self = this;
                var countNumText =  parseInt(_self.parentNode.children[1].innerHTML, 10);
                var itemid = _self.parentNode.parentNode.getAttribute('itemid');
                var itemPrice = _self.parentNode.parentNode.getAttribute('price');
				modifyItemByAjax(itemid, countNumText, 'add', function(){
					//提交成功，更新总数
   					updateTotal(1, 'add', itemPrice);
				}, function() {
	                _self.parentNode.children[1].innerHTML = originalNum;
	                btnShowHide(originalNum, _self.parentNode);
                });
            })

            btnMin.addEventListener(_movestartEvt,function(){
                var _self = this;
                originalNum = parseInt(_self.parentNode.children[1].innerHTML, 10);
                countNumText =  originalNum -1;
                if(countNumText <= 0 ){
                    _self.parentNode.children[1].innerHTML = 1;
                    beforeRemoveDish = true;
                    return;
                }else{
                    _self.parentNode.children[1].innerHTML = countNumText;
                }
            })

            btnMin.addEventListener(_moveendEvt,function(){
                var _self = this;
                var countNumText =  parseInt(_self.parentNode.children[1].innerHTML, 10);
                var itemid = _self.parentNode.parentNode.getAttribute('itemid');
                var name = _self.parentNode.parentNode.getAttribute('name');
                var itemPrice = _self.parentNode.parentNode.getAttribute('price');
                if (beforeRemoveDish) {
                     _self.parentNode.children[1].innerHTML = 0;
                    btnShowHide(0, _self.parentNode);
                    removeItemByAjax(itemid, function(){
                    	//更新总数
						updateTotal(1, 'min', itemPrice);
                    }, function() {
                        _self.parentNode.children[1].innerHTML = originalNum;
                        btnShowHide(originalNum, _self.parentNode);
                    });
                    beforeRemoveDish = false;
                } else {
                    modifyItemByAjax(itemid, countNumText, 'min', function(){
                    	//更新总数
   						updateTotal(1, 'min', itemPrice);
                    }, function() {
	                    _self.parentNode.children[1].innerHTML = originalNum;
	                    btnShowHide(originalNum, _self.parentNode);
	                });
                }
            }) // btnMin.addEventListener
        } // for

		//移除项目，并异步更新至服务器
        function modifyItemByAjax(itemid, qty, operation, successCallback, errorCallback) {
            var params = modifyOrder(itemid, operation);
            var url = 'order_op.php?m=a';
            var orderId = params['orderId'];
            if(orderId != '' && orderId > 0){
            	url = 'order_op.php?m=e';
            }
            url = url + '&outletCode=' + document.getElementById('OutletCode').getAttribute('value');
            console.log('modifyItemByAjax ', url, JSON.stringify(params));
            MLoading.show('更新中');
			_doAjax(url, 'GET', params, function(ret){
				var tmp = '';
				if(ret['orderId'] != undefined){
					if (console && console.log){
						console.log('提交订单成功，order id is ',ret['orderId'], url, tmp);
					}
					document.getElementById('OrderId').setAttribute('value', ret['orderId']);
					successCallback();
				}else{
					alert('提交失败:'+ret['error']);
					if (console && console.log){
						console.log('提交订单失败，error： ',ret['error'], url, tmp);
					}
					errorCallback();
				}
				MLoading.hide();
			}, true);

        }
		//移除项目，并异步更新至服务器
        function removeItemByAjax(itemid, successCallback, errorCallback) {
			var params = modifyOrder(itemid, 'min');
            //alert('remove');
            var orderId = params['orderId'];
            var url = 'order_op.php?m=e';
            url = url + '&outletCode=' + document.getElementById('OutletCode').getAttribute('value');
            MLoading.show('更新中');
			_doAjax(url, 'GET', params, function(ret){
				var tmp = JSON.stringify(ret);
				if(ret['orderId'] != undefined){
					if (console && console.log){
						console.log('提交订单成功，order id is ',ret['orderId'], url, tmp);
					}
					successCallback();
				}else{
					alert('提交失败:'+ret['error']);
					if (console && console.log){
						console.log('提交订单失败，error： ',ret['error'], url, tmp);
					}
					errorCallback();
				}
				MLoading.hide();
			}, true);

        }
    }
	//加减按钮的显示与隐藏
    function btnShowHide(num,btns){
        if (num <= 0) {
            btns.children[0].style.display ="none";
            btns.children[1].style.display ="none";
        }else{
            btns.children[0].style.display ="inline-block";
            btns.children[1].style.display ="inline-block";
        };
    }

    //点击促发弹层事件
    function popItemDetailMsg(){
        var links = _qAll(".dataIn"), i=0;
        var imgSource = '';
        for(i;i<links.length;i++){
            links[i].onclick=function(event){
                event.stopPropagation();
                // dl
                var parentDl = this.parentNode.parentNode;
                var childImg = this.childNodes[0]
                if(childImg.nodeType == 3){
                    childImg = this.childNodes[1];
                }
                imgSource = childImg.src;
                imgSource = imgSource.replace('resize/100X100f/', '');
                popPic(imgSource, parentDl.getAttribute('name'), parentDl.getAttribute('price') + '');
            }
        }
    }
    //调用自定义弹层，参数可自行扩展
    function popPic(imgUrl,title,price){
        var _title = title,
            _price = price;
        var hotHtml = '';
            _tmpHtml = "<div class='content'>"+hotHtml+"<img src='"+imgUrl+"' alt='' title=''><h2>"+_title;
			_tmpHtml += "<i>"+_price+"</i>"
            _tmpHtml += '</div>';
        MDialog.popupCustom(_tmpHtml,true,true);
    }
    //订单详情
	function initDishOrderData(ret,openid, appid){
		var OrderId = document.getElementById("OrderId");
		OrderId.setAttribute("value", ret['orderId']);
		var PhoneNo = document.getElementById("PhoneNo");
		PhoneNo.setAttribute("value", ret['phoneNo'] == undefined?'':ret['phoneNo']);
		var Member = document.getElementById("Member");
		Member.setAttribute("value", openid);
		var ItemList = document.getElementById("ItemList");
		ItemList.setAttribute("value", ret['ItemList']);
		var myMenuButton = document.getElementById("btn_change");
		myMenuButton.setAttribute("onClick", "submitAndJump('"+openid+"','"+outletCode+"');");
	}
	function submitAndJump(openid, outletCode){
		/*
		var params = {
			"orderId" : document.getElementById('OrderId').getAttribute('value'),
			"phone" : document.getElementById('PhoneNo').getAttribute('value'),
			"member":document.getElementById('Member').getAttribute('value'),
			"remark":document.getElementById('Remark').getAttribute('value'),
			"itemlist":document.getElementById('ItemList').getAttribute('value')
        };
        var url = 'order_op.php?m=a';
        var orderId = params['orderId'];
        if(orderId != '' && orderId > 0){
        	url = 'order_op.php?m=e&orderId='+orderId;
        }
        MLoading.show('更新中');
		_doAjax(url, 'POST', params, function(ret){
			MLoading.hide();
			var tmp = '';
			if(ret['orderId'] != undefined){
				if (console && console.log){
					console.log('提交订单成功，order id is ',ret['orderId'], url, tmp);
				}
				location.href='menu.php?openid=<?php echo $wxOpenIdFromWxPlatform ?>&appid=<?php echo $appId ?>';
				//document.getElementById('OrderId').setAttribute('value', ret['orderId']);
				//successCallback();
			}else{
				alert('提交失败:'+ret['error']);
				if (console && console.log){
					console.log('提交订单失败，error： ',ret['error'], url, tmp);
				}
				//errorCallback();
			}

		}, true);
		*/
		var totalNumObj = _q('.footFix .num');
		var num = totalNumObj.innerHTML;
		//alert(num);
		if(num  == '' || num == 0 || num == '0'){
			MDialog.alert('菜单空空的，先点菜吧', null, null, '知道了', null, null, null, false, true);
			return;
		}
		location.href='menu.php?openid='+openid+'&outlet='+outletCode;
	}