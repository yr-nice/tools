
function countAllStock()
{
	countAllStockTrade();
	var objArr = getStoTradeObjArr();

	countStockObjArrRlt(objArr);
	sumStockRtl();
}

function countStockObjArrRlt(objArr)
{
	for(var i=0; i<gStockNames.length; i++)
	{
		var stoCode = gStockNames[i].value;
		var buyNo, sellNo, buyAmount, sellAmount,broFee,curPrice,broker,curRate,currency;
		buyNo=sellNo=buyAmount=sellAmount=broFee=curPrice=broker=curRate=currency=0;

		for(var j=0; j<objArr.length; j++)
		{
			var obj = objArr[j]
			//alert(cells[0].value)
			//alert(stoCode)
			if(obj.name == stoCode)
			{
				curPrice = curPrice || parseFloat(gStockNames[i].curPrice)*obj.rate;
				broker = broker || obj.broker
				curRate = curRate || obj.rate;
				currency = getBrokerCurrency(obj.broker)!="sgd"? "sgd":"";
				//alert(obj.brokerFee);
				var sgd = obj.currency=="sgd";
				var rate = obj.rate;
				broFee += sgd? obj.brokerFee: obj.brokerFee*rate
				if(obj.action=="buy")
				{
					buyNo += obj.shareNo;
					buyAmount += sgd? obj.amount: obj.amount*rate;
				}
				else if(obj.action=="sell")
				{
					sellNo += obj.shareNo;
					sellAmount += sgd? obj.amount: obj.amount*rate;
				}
			}
		}
		if(buyNo||sellNo)
		{
			var objRlt = countAllTradsForOneStock(stoCode, buyNo, sellNo, buyAmount, sellAmount,broFee, broker,curPrice, curRate, currency, objArr);
			/*var tmp = countRltCurPft(stoCode, objArr);
			objRlt.curProfit = tmp.profit
			objRlt.curProfitPer = tmp.porfitRate*/
			log(">>>>>>>objRlt.curProfitPer = "+objRlt.curProfitPer);
			addNewStockResult(objRlt);
		}



	}

}

function countAllTradsForOneStock(stoCode, buyNo, sellNo, buyAmount, sellAmount,broFee, broker, curPrice, curRate, currency, arr)
{
	var obj={}
	obj.name = getStoNameByValue(stoCode);
	obj.buyNo = buyNo
	obj.sellNo = sellNo
	obj.buyAmount = formatFloat(buyAmount, 2)
	obj.sellAmount = formatFloat(sellAmount, 2)
	obj.broFee = formatFloat(broFee, 2)
	obj.holdNo = buyNo-sellNo;
	obj.aveBPrice = formatFloat(buyAmount/buyNo, 3)
	obj.aveSPrice = formatFloat(sellAmount/sellNo, 3)
	if(document.getElementById("fixPreTrd").checked)
	{
		var tmp = countRltCurPft(stoCode, arr)
		obj.balance = obj.holdNo>0? formatFloat(tmp.sellAmt-buyAmount, 2):0
		obj.buyAmount = obj.balance*(-1)
		obj.aveBPrice = formatFloat(obj.buyAmount/obj.holdNo, 3)||0
		obj.curProfit = tmp.profit;
		obj.curProfitPer = tmp.porfitRate;
		//log("tmp.sellAmt = "+tmp.sellAmt);
		//log("buyAmount="+buyAmount)

	}
	else
	{
		obj.balance = formatFloat(sellAmount - buyAmount, 2)
		obj.curProfit = formatFloat(obj.sellAmount-obj.aveBPrice*obj.sellNo, 3);
		obj.curProfitPer =formatFloat(obj.curProfit*100/(obj.aveBPrice*obj.sellNo), 2);
	}
	obj.breakEven = ""
	if(obj.balance<0 && obj.holdNo>0)
	{
		obj.breakEven = guessTgtPrice(obj.holdNo, obj.balance*(-1));
	}
	obj.curPrice = formatFloat(curPrice,2);

	if(obj.holdNo)
	{
		obj.mktValue = formatFloat(obj.curPrice*obj.holdNo,2);
		var tmp = {action:"sell", price:curPrice, broker:broker, shareNo:obj.holdNo, currency:currency, rate:curRate};
		obj.change = countAmount(tmp).amount + obj.balance;
		obj.change = formatFloat(obj.change,2);
	}
	else
	{
		obj.mktValue = 0;
		obj.change = 0;
	}

	for(var i in obj) !obj[i]? obj[i]=0:"";
	return obj;
}

function addNewStockResult(obj)
{
	var row = document.getElementById("stockRstTbl").insertRow();
	for(var i=0; i<gRlt.length; i++)
		row.insertCell()
	//alert(row.cells[0])
	row.cells[gRlt.name].innerHTML = obj.name
	row.cells[gRlt.name].className = "nowrap";
	row.cells[gRlt.bNo].innerHTML = obj.buyNo
	row.cells[gRlt.sNo].innerHTML = obj.sellNo
	row.cells[gRlt.hNo].innerHTML = obj.holdNo
	row.cells[gRlt.bAmt].innerHTML = obj.buyAmount
	row.cells[gRlt.sAmt].innerHTML = obj.sellAmount
	row.cells[gRlt.balance].innerHTML = obj.balance
	row.cells[gRlt.aBP].innerHTML = obj.aveBPrice
	row.cells[gRlt.aSP].innerHTML = obj.aveSPrice
	row.cells[gRlt.broFee].innerHTML = obj.broFee
	row.cells[gRlt.brkEn].innerHTML = obj.breakEven
	//log("<<<<<<<obj.curProfitPer="+obj.curProfitPer)
	row.cells[gRlt.curPft].innerHTML = obj.curProfit + " ("+obj.curProfitPer+"%)";
	row.cells[gRlt.curPft].className = "nowrap";
	row.cells[gRlt.curPrc].innerHTML = obj.curPrice||""
	row.cells[gRlt.mktVal].innerHTML = obj.mktValue||""

	if(obj.change)
	{
		var a = obj.change;
		row.cells[gRlt.change].innerHTML  = String.format("%s (%s%)", formatFloat(a,2)
													, formatFloat(a*100/obj["buyAmount"],2))
	}
	row.cells[gRlt.change].className = "nowrap";
	row.cells[gRlt.tPft].innerHTML = "<input size=2>"
	row.cells[gRlt.tPer].innerHTML = "<input size=2>"
	row.cells[gRlt.tPrc].innerHTML = "<input size=2>"
	row.cells[gRlt.count].innerHTML = "<input type=button value='count' onclick='countTgt(this)'>";
	return row.cells

}

function countTgt(element)
{
	//alert(2)
	var cells = element.parentNode.parentNode.cells;
	var no = parseInt(cells[gRlt.hNo].innerHTML);
	var balance = parseFloat(cells[gRlt.balance].innerHTML);
	var b = parseFloat(cells[gRlt.bAmt].innerHTML);
	if(!no)return;
	var tgtProfile = parseFloat(cells[gRlt.tPft].firstChild.value);
	var tgtPer = parseFloat(cells[gRlt.tPer].firstChild.value)
	var tgtPrice = parseFloat(cells[gRlt.tPrc].firstChild.value)
	var name = cells[gRlt.name].innerHTML
	//alert(name)
	var broker = getBrokerByStoName(name)
	var rate = getFirstRateByStoName(name)
	var currency = getBrokerCurrencyByStoName(name)!="sgd"? "sgd":""
	//alert(broker)

	if(tgtProfile||tgtProfile==0)
	{
		cells[gRlt.tPer].firstChild.value = formatFloat(tgtProfile*100/b, 2);
		cells[gRlt.tPrc].firstChild.value = guessTgtPrice(no, (balance*(-1)+tgtProfile))
	}
	else if(tgtPer||tgtPer==0)
	{
		cells[gRlt.tPft].firstChild.value = formatFloat(b*tgtPer/100, 2);
		cells[gRlt.tPrc].firstChild.value = guessTgtPrice(no, (balance*(-1)+b*tgtPer/100))
	}
	else if(tgtPrice||tgtPrice==0)
	{
		var obj = {action:"sell", price:tgtPrice, broker:broker, shareNo:no, rate:rate, currency:currency};
		var sellAmount = countAmount(obj).amount + parseFloat(cells[gRlt.sAmt].innerHTML)
		cells[gRlt.tPft].firstChild.value = formatFloat(sellAmount-b, 2);
		cells[gRlt.tPer].firstChild.value = formatFloat((sellAmount-b)*100/b, 2);
	}

	updateSumTgt(element.parentNode.parentNode)
}

function updateSumTgt(row)
{
	//find the start
	//alert(1)
	var start = row
	while(1)
	{
		//alert(start.innerHTML)
		if(!start.previousSibling || start.sum)
			break;
		start = start.previousSibling
	}

	var next = start
	var a = 0;
	while(1)
	{
		//alert(next.nextSibling.innerHTML)
		if(!next.nextSibling || next.nextSibling.sum)
			break;
		next = next.nextSibling
		//alert(next.cells[12].innerHTML||0)
		a += (parseFloat(next.cells[gRlt.tPft].firstChild.value)||0)
	}
	var sumRow = next.nextSibling;
	//parseFloat(sumRow.cells[12].innerHTML)||0
	//a = a-orig+current;
	sumRow.cells[gRlt.tPft].innerHTML = formatFloat(a,2);
	var b = parseFloat(sumRow.cells[gRlt.bAmt].innerHTML);
	sumRow.cells[gRlt.tPer].innerHTML = formatFloat(a*100/b,2);

}

function guessTgtPrice(no, tgtAmount)
{
	var o={};
	o.action = "sell";
	o.shareNo = no;
	o.price = tgtAmount/no;
	countStockObjAttr(o, "price", "amount", 0.005, tgtAmount)
	return formatFloat(o.price,3)

}


function recountAllStockRlt()
{
	clearStockRlt()
	countAllStock();

}

function countSelectStockRlt()
{
	countSelectedStoTrade()
	var arr = getSelectedStockRowObj();
	countStockObjArrRlt(arr);
	sumStockRtl()
}

function clearStockRlt()
{
	var table = document.getElementById("stockRstTbl");
	table.style.display = "none";
	while(table.rows.length>1)
		table.deleteRow(1);
}

function sumStockRtl()
{
	var table = document.getElementById("stockRstTbl");
	//alert(table.style.display)
	table.style.display = "";
	//alert(table.style.display)

	var rows = table.rows
	var bNo, sNo, hNo, bAmt, sAmt, blc, aveBPri, aveSPri, bFee, curProfit, change, mktValue;
	bNo= sNo= hNo= bAmt= sAmt= blc= aveBPri= aveSPri= bFee= curProfit=change=mktValue=0;
	for(var i=1; i<rows.length; i++)
	{
		var c = rows[i].cells
		if(rows[i].sum)
		{
			bNo= sNo= hNo= bAmt= sAmt= blc= aveBPri= aveSPri= bFee= curProfit=change=mktValue=0;
			continue;
		}
		bNo += parseInt(c[gRlt.bNo].innerHTML);
		sNo += parseInt(c[gRlt.sNo].innerHTML);
		hNo += parseInt(c[gRlt.hNo].innerHTML);
		bAmt+= parseFloat(c[gRlt.bAmt].innerHTML);
		sAmt+= parseFloat(c[gRlt.sAmt].innerHTML);
		blc += parseFloat(c[gRlt.balance].innerHTML);
		bFee+= parseFloat(c[gRlt.broFee].innerHTML);
		curProfit += parseFloat(c[gRlt.curPft].innerHTML);
		//alert(c[13].innerHTML)
		mktValue += parseFloat(c[gRlt.mktVal].innerHTML)||0
		change += parseFloat(c[gRlt.change].innerHTML)||0
	}
	//aveBPri= formatFloat(bAmt/bNo, 2);
	//aveSPri= formatFloat(sAmt/sNo, 2);
	bAmt = formatFloat(bAmt, 2);
	sAmt = formatFloat(sAmt, 2);
	blc = formatFloat(blc, 2);
	curProfit=formatFloat(curProfit,2)
	//curProfit=formatFloat(sAmt-sNo*aveBPri, 2);

	var row = table.insertRow();
	for(var i=0; i<gRlt.length; i++)
		row.insertCell()
	row.sum = true;
	row.style.fontWeight = "bold";
	//row.style.whitSpace = "nowrap";

	row.cells[gRlt.name].innerHTML = "Sum";
	row.cells[gRlt.bNo].innerHTML = bNo;
	row.cells[gRlt.sNo].innerHTML = sNo;
	row.cells[gRlt.hNo].innerHTML = hNo;
	row.cells[gRlt.bAmt].innerHTML = formatFloat(bAmt,2);
	row.cells[gRlt.sAmt].innerHTML = formatFloat(sAmt,2);
	row.cells[gRlt.balance].innerHTML = formatFloat(blc,2);
	//row.cells[7].innerHTML = aveBPri;
	//row.cells[8].innerHTML = aveSPri;
	row.cells[gRlt.broFee].innerHTML = bFee;
	//row.cells[11].innerHTML = curProfit+" ("+formatFloat(curProfit*100/(sNo*aveBPri), 2)+"%)";
	row.cells[gRlt.curPft].innerHTML = curProfit;
	row.cells[gRlt.mktVal].innerHTML = mktValue;
	row.cells[gRlt.change].innerHTML = formatFloat(change,2) +" ("+formatFloat(change*100/bAmt,2)+"%)";
	for(var i=0; i<row.cells.length; i++)
		row.cells[i].className = "nowrap"
}




function ConfigSto()
{
	var a = dojo.toJson(gStoCfg);
	var str = prompt("Input the Attribute", a)
	gStoCfg = dojo.fromJson(str);
}


function toggleRltTgt()
{
	var rows = document.getElementById("stockRstTbl").rows;
	var show = rows[0].cells[gRlt.tPft].style.display == "none"
	for(var i=0; i<rows.length; i++)
	{
		rows[i].cells[gRlt.bNo].style.display= show? "":"none";
		rows[i].cells[gRlt.sNo].style.display= show? "":"none";
		rows[i].cells[gRlt.bAmt].style.display= show? "":"none";
		rows[i].cells[gRlt.sAmt].style.display= show? "":"none";
		rows[i].cells[gRlt.aBP].style.display= show? "":"none";
		rows[i].cells[gRlt.aSP].style.display= show? "":"none";
		rows[i].cells[gRlt.broFee].style.display= show? "":"none";

		rows[i].cells[gRlt.tPft].style.display= show? "":"none";
		rows[i].cells[gRlt.tPer].style.display= show? "":"none";
		rows[i].cells[gRlt.tPrc].style.display= show? "":"none";
		rows[i].cells[gRlt.count].style.display= show? "":"none";
	}

}

function countWay2()
{
	countAllStockTrade();
	var arr = getStoTradeObjArr();
	for(var i=0; i<gStockNames.length; i++)
	{
		var obj = countRltCurPft(gStockNames[i].value, arr)
	}

}

function countRltCurPft(name, arr, date)
{
	date = date||(new Date()).format("yyyy-mm-dd");
	date = searchLastSell(name, arr, date);
	var buyNo, sellNo, buyAmount, sellAmount,broFee,curPrice,broker,curRate,currency;
	buyNo=sellNo=buyAmount=sellAmount=broFee=curPrice=broker=curRate=currency=0;

	var obj={};
	obj.name = name;
	obj.holdAmt=0;
	var start=false;
	for(var i=0; i<arr.length; i++)
	{
		if(arr[i].name!=name) continue;
		/*if(arr[i].date>date)
		{
			if(arr[i].action=="buy")
			{
				obj.holdAmt+=arr[i].amount
				log("obj.holdAmt="+obj.holdAmt)
			}
 			continue;
		}*/
		if(arr[i].date>date) continue;
		//if(!start && arr[i].action=="buy") continue;
		//start=true;
		var rate = arr[i].rate||1;
		var sgd = arr[i].currency=="sgd";
		if(arr[i].action=="buy")
		{
			buyNo += arr[i].shareNo;
			buyAmount += sgd? arr[i].amount: arr[i].amount*rate;
		}
		else if(arr[i].action=="sell")
		{
			sellNo += arr[i].shareNo;
			sellAmount += sgd? arr[i].amount: arr[i].amount*rate;
		}
	}

	var aveBPrice = formatFloat(buyAmount/buyNo, 3)||0
	log("buyAmount="+buyAmount)
	log("buyNo="+buyNo)
	obj.profit = formatFloat(sellAmount-aveBPrice*sellNo, 2)||0
	obj.porfitRate = formatFloat(obj.profit*100/(aveBPrice*sellNo), 2)||0
	obj.sellAmt = aveBPrice*sellNo||0;
	/*obj.holdNo = buyNo - sellNo;
	//obj.holdAmt = obj.holdNo==0? 0: formatFloat(buyAmount - aveBPrice*sellNo, 2);
	obj.holdAmt += obj.holdNo==0? 0: formatFloat(buyAmount - aveBPrice*sellNo, 2)
	*/
	log(String.format("avP=%s, bAmt=%s, bNo=%s, sNo=%s, sAmt=%s, hNo=%s, hAmt=%s, rate=%s",
	                   aveBPrice,buyAmount,buyNo,sellNo,sellAmount,obj.holdNo,obj.holdAmt,obj.porfitRate))
	return obj;

}

function searchLastSell(name, arr, date)
{
	date = date||(new Date()).format("yyyy-mm-dd");
	var re = ""
	for(var i=0; i<arr.length; i++)
	{
		if(arr[i].name!=name) continue;
		if(arr[i].date>date) continue;
		if(arr[i].action=="sell" && arr[i].date>re) re=arr[i].date;
	}
	return re;
}