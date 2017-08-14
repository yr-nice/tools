/********************* init **************************/
function initStoTrade()
{
	for(var i=0; i<gStoTrade.length; i++)
	{
		var cells = newStockTrade(-1)
		countAmount(gStoTrade[i])
		updateStockResult(cells, gStoTrade[i])
	}
	countTrdPft()
	tryShowText()
}

function loadSetting()
{
	gConf = readFile("config.js");
	//arrStoCode = content.replace(/\r/, "").split("\n")
	//gStoTrade = eval(gConf);
	//alert(gConf)
	eval(gConf);
	//alert(bx);
	//alert(arrStoCode[0].name);
}



/********************* create **************************/
function newStockTrade(pos, page)
{
	page = page||1;
	var row = document.getElementById("stockTbl").insertRow(pos);
	for(var i=0; i<gCells.length; i++)
		row.insertCell()
	//alert(gCells.length)
	for(var i=0; i<gCells.length; i++)
		row.cells[i].innerHTML = gCells[i].html;
	//alert(row.cells[0].firstChild.tagName)
	initNameSelect(row.cells[1].childNodes[0])
	row.cells[5].innerHTML = getBrokerSelectStr();
	row.cells[row.cells.length-2].firstChild.value = (new Date()).format("yyyy-mm-dd")
	row.filterShow = true;

	updateTotalPage()
	moveToPage(page);

	//alert(row.cells[0].firstChild.innerHTML)
	return row.cells
}

function createCopyStoTraRow(element)
{
	var row = element.parentNode.parentNode
	var cells = row.cells;
	var cur = parseInt(document.getElementById("curPage").innerHTML) || 1
	var newCells = newStockTrade(row.rowIndex+1, cur);
	var obj=formatCountObj(cells)
	updateStockResult(newCells, obj);
	cells[0].firstChild.checked = true;
	newCells[0].firstChild.checked = true;
	for(var i=0; i<newCells.length-1; i++)
		newCells[i].firstChild.style.background = "#FCE0DF";
}



function initNameSelect(elt)
{
	for(var i=0; i<gStockNames.length; i++)
	{
		elt.options[i+1] = new Option(gStockNames[i].label, gStockNames[i].value);
	}
	return elt
}

function getBrokerSelectStr()
{
	//<select><option value=ocbc>iOCBC</option><option value=ocbcus>iOCBC US</option></select>
	var str = "<select onchange='changeBroker(this)'>"
	for(var i=0; i<gBrokerList.length; i++)
		str +=String.format("<option value=%s>%s</option>", gBrokerList[i].value, gBrokerList[i].label)
	str +="</select>"
	str +="<span style='display:none'><select onchange='changeTradeCurrency(this)'><option value=usd>USD</option><option value=sgd>SGD</option></select></span>"
	str +="<span style='display:none'><input size=1></span><span></span>"
	return str;

}


/************************ update ********************/
function formatCountObj(cells)
{
	var obj={}
	for(var i=1; i<gCells.length-1; i++)
	{
		obj[gCells[i].attr] = cells[i].firstChild.value? cells[i].firstChild.value:cells[i].firstChild.innerHTML;
	}
	obj["rate"] = cells[5].getElementsByTagName("input")[0].value
	obj["rate"] = parseFloat(obj["rate"]) || 1;
	obj["currency"] = cells[5].firstChild.nextSibling.firstChild.value || "sgd";

	return formatStoObj(obj)
}

function formatStoObj(obj)
{
	obj["shareNo"] = parseInt(obj["shareNo"]) ? parseInt(obj["shareNo"]):0
	obj["price"] = parseFloat(obj["price"]) ? parseFloat(obj["price"]):0
	obj["amount"] = parseFloat(obj["amount"]) ? parseFloat(obj["amount"]):0
	obj["breakEven"] = parseFloat(obj["breakEven"]) ? parseFloat(obj["breakEven"]):0
	//obj["profit"] = parseFloat(obj["profit"]) ? parseFloat(obj["profit"]):0
	//obj["profitPer"] = parseFloat(obj["profitPer"]) ? parseFloat(obj["profitPer"]):0
	obj["brokerFee"] = parseFloat(obj["brokerFee"]) ? parseFloat(obj["brokerFee"]):0
	obj["curPrice"] = parseFloat(obj["curPrice"]) ? parseFloat(obj["curPrice"]):0
	obj["mktValue"] = parseFloat(obj["mktValue"]) ? parseFloat(obj["mktValue"]):0
	obj["change"] = parseFloat(obj["change"]) ? parseFloat(obj["change"]):0

	return obj
}


function updateStockResult(cells, obj)
{
	cells[1].firstChild.value = obj["name"]
	cells[2].firstChild.value = obj["action"];
	cells[2].firstChild.onchange();
	cells[3].firstChild.value = obj["shareNo"];
	cells[4].firstChild.value = formatFloat(obj["price"],3);
	cells[5].firstChild.value = obj["broker"];
	if(cells[5].firstChild.style.display!="none")
		cells[5].firstChild.onchange();
	cells[5].firstChild.nextSibling.firstChild.value = obj.currency;
	cells[5].getElementsByTagName("input")[0].value = formatFloat(obj["rate"], 3);
	cells[6].firstChild.value = formatFloat(obj["brokerFee"],2) + "  ("+formatFloat(obj["brokerFee"]*100/obj["amount"],2)+"%)";
	cells[7].firstChild.value = formatFloat(obj["amount"],2);
	cells[8].firstChild.value = obj["breakEven"]? formatFloat(obj["breakEven"],3):"";
	cells[9].firstChild.innerHTML = obj["curPrice"]? formatFloat(obj["curPrice"],2): ""
	cells[10].firstChild.innerHTML = obj["mktValue"]? formatFloat(obj["mktValue"],2): ""
	if(obj["change"])
	{
		var a = obj["change"]
		cells[11].firstChild.innerHTML = String.format("%s (%s%)", formatFloat(a,2)
		    											, formatFloat(a*100/obj["amount"],2))
	}
	cells[11].className="nowrap"
	cells[12].firstChild.value = obj["date"]

}









/**************************remove*********************/
function removeStockRow()
{
	var table = document.getElementById("stockTbl")
	var rows = table.rows
	for(var i=1; i<rows.length; i++)
	{
		//alert(rows[i].cells[0].innerHTML)
		if(rows[i].cells[0].firstChild.checked)
		{
			table.deleteRow(i)
			i--;
		}
	}
	updateTotalPage()
	var cur = parseInt(document.getElementById("curPage").innerHTML) || 1
	moveToPage(cur);
	return re;
}



/************************** save *********************/
function saveSto()
{
	var str = saveStoSettings() + saveAllStockRows()
	writeFile(str, getFolder()+"config.js");
}
function saveStoSettings()
{
	var re = "gStoCfg = "+dojo.toJson(gStoCfg) + "\n"
	re += String.format("gTradePerPage=%s;\n", document.getElementById("tradesPerPage").value);
	return re;
}

function saveAllStockRows()
{
	var rows = document.getElementById("stockTbl").rows
	var arr=[];
	for(var i=1; i<rows.length; i++)
	{
		var obj=formatCountObj(rows[i].cells)
		arr.push(obj)
	}
	var str="gStoTrade=[";
	for(var i=0; i<arr.length; i++)
	{
		str+=String.format("\n{name:'%s', action:'%s', shareNo:%s, price:%s, broker:'%s', date:'%s', rate:'%s', currency:'%s' },",
							arr[i].name, arr[i].action, arr[i].shareNo, arr[i].price, arr[i].broker, arr[i].date, arr[i].rate, arr[i].currency);
	}
	str = str.slice(0, -1)+"\n];\n";
	return str;
}


/********************* count **************************/
function countAmount(obj)
{
	//obj["price"]=obj["price"];
	//obj["brokerFee"] = countBrokerFee(obj["shareNo"]*obj["price"]);
	countTradeBrokerFee(obj)
	if(obj["action"]=="buy")
	{

		obj["amount"] = formatFloat(obj["shareNo"]*obj["price"] + obj["brokerFee"], 2);
		//obj["brokerFee"] = obj["brokerFee"] + "  ("+formatFloat(obj["brokerFee"]/obj["amount"],2)+"%)"
		//log(String.format("amount=%s, no=%s, price=%s, fee=%s",
		                   //obj["shareNo"]*obj["price"] + obj["brokerFee"], obj["shareNo"], obj["price"], obj["brokerFee"]));
		countBreakEven(obj);
		//log(String.format("amount=%s, no=%s, price=%s, fee=%s",
		                   //obj["amount"], obj["shareNo"], obj["price"], obj["brokerFee"]));
	}
	else if(obj["action"]=="sell")
	{
		obj["amount"] = obj["shareNo"]*obj["price"] - obj["brokerFee"];
		//obj["brokerFee"] = obj["brokerFee"] + "  ("+formatFloat(obj["brokerFee"]/obj["amount"],2)+"%)"
	}
	return obj;
}

function countTradeBrokerFee(obj)
{
	var re = 0;
	var amount = obj["shareNo"]*obj["price"];
	if(getBrokerCurrency(obj.broker)!="sgd" && obj.currency == "sgd")
		amount /= obj.rate;
	if(obj.broker=="ocbc")
	{
		re = amount>100000? amount*0.002 : amount*0.00275;
		re < 25? re=25: "";
		re = (re + amount*0.0004 + amount*0.000075)*1.07;
	}
	else if(obj.broker=="ocbcus")
	{
		re = amount>60000? amount*0.002 : amount*0.00275;
		re < 14? re=14: "";
		re = (re + amount*0.0004 + amount*0.000075)*1.07;
	}

	if(getBrokerCurrency(obj.broker)!="sgd" && obj.currency == "sgd")
		re *= obj.rate;

	obj.brokerFee = re;
	return re;
}


function countBreakEven(obj)
{
	var a ={}
	for(var i in obj)
		a[i] = obj[i];
	a["action"] = "sell"
	//a["price"] =0;
	//countStockObj(a, "price", 0.005);
	countStockObjAttr(a, "price", "amount", 0.005, obj["amount"])

	obj.breakEven = a.price;
}

function countStockRow(element)
{
	cells = element.parentNode.parentNode.cells;
	//alert(cells.length)
	var obj=formatCountObj(cells)
	if(!validateCountObj(obj))
	{
		alert(obj.name)
		alert("Insufficient Info, Can't Proceed!")
		return;
	}

	if(!obj["shareNo"] && obj["price"] && obj["breakEven"]&&!obj["amount"])
	{
		var breakEven = obj["breakEven"]
		obj["shareNo"] = parseInt(60/(breakEven-obj["price"]))
		countStockObjAttr(obj, "shareNo", "breakEven", 1, breakEven)
	}
	else if(!obj["shareNo"])
	{
		obj["shareNo"] = parseInt(obj["amount"]/obj["price"])
		countStockObjAttr(obj, "shareNo", "amount", 1, obj["amount"])
		//countStockObj(obj, "shareNo", 1)
	}
	else if(!obj["price"])
	{
		obj["price"] = formatFloat(obj["amount"]/obj["shareNo"], 2)
		//alert(obj["price"]);
		countStockObjAttr(obj, "price", "amount", 0.005, obj["amount"])
	}
	else
	{
		countAmount(obj);

	}

	updateStockResult(cells, obj)
	countTrdPft();

}

function countStockObjAttr(obj, changeAttr, compareAttr, offset, goal)
{

	//alert(obj[compareAttr])
	var a = Math.abs(countAmount(obj)[compareAttr]-goal);
	//alert(obj[compareAttr])
	obj[changeAttr] += offset;
	var b = Math.abs(countAmount(obj)[compareAttr]-goal);
	//alert("a="+a+", b="+b)
	if(b>a) offset*=-1
	a=b;
	while(1)
	{
		//alert(obj[compareAttr])
		var tmp=obj[changeAttr]
		//alert(obj[changeAttr])
		obj[changeAttr] += offset;
		//alert("tmp="+tmp + ", obj[attr]="+obj[attr])
		a = Math.abs(countAmount(obj)[compareAttr]-goal)
		//alert("a="+a+", b="+b)
		if(!a||a==b||a==0)
		{
			break;
		}
		else if(a>b)
		{
			obj[changeAttr] =tmp
			break;
		}
		b=a;

	}
	countAmount(obj);
}

function countAllStockTrade()
{
	var rows = document.getElementById("stockTbl").rows
	for(var i=1; i<rows.length; i++)
	{
		var cells = rows[i].cells;
		//alert(cells.length)
		var button = cells[cells.length-1].firstChild;
		button.onclick(button);
	}

}

function countSelectedStoTrade()
{
	var rows = document.getElementById("stockTbl").rows
	for(var i=1; i<rows.length; i++)
	{
		//if(rows[i].style.display=="none") continue;
		var cells = rows[i].cells;
		if(cells[0].firstChild.checked)
		{
			var button = cells[cells.length-1].firstChild;
			button.onclick(button);
		}
	}

}


function countTrdPft()
{
	var arr = getStoTradeObjArr()
	var rows = document.getElementById("stockTbl").rows
	for(var i=0; i<arr.length; i++)
	{
		if(arr[i].action=="sell")
		{
			var sum = countRltCurPft(arr[i].name, arr, arr[i].date)
			date = dateFormat.toDate(arr[i].date, "yyyy-mm-dd")
			log("date="+date)
			log(date)
			date.setDate( date.getDate()-1 )
			log(date.format("yyyy-mm-dd"))
			var last = countRltCurPft(arr[i].name, arr, date.format("yyyy-mm-dd"))
			log(String.format("sum.profit=%s, last.profit=%s", sum.profit,last.profit))
			arr[i].profit = sum.profit - last.profit;
			rows[i+1].cells[8].childNodes[0].value = rows[i+1].cells[8].childNodes[1].innerHTML = arr[i].profit;
		}
	}
}
/********************* event handler **************************/
function changeStockAction(obj)
{
	var row = obj.parentNode.parentNode;
	if(obj.value=="sell")
	{
		row.cells[8].firstChild.value = "NA";
	}
	else
	{
		//alert(row.cells[8].firstChild.style)
		row.cells[8].firstChild.value = "";
	}

	//obj.parentNode.parentNode.style.background = obj.value=="buy"? "#e5e5e5" : "white"
	//obj.parentNode.parentNode.style.border="1px #e5e5e5 solid"
}

function changeTradeCurrency(obj)
{
	var cur = obj.parentNode.nextSibling.getElementsByTagName("input")[0].value;
	cur = parseFloat(cur)||1;
	//alert(cur)
	var cells = obj.parentNode.parentNode.parentNode.cells;
	var sto = formatCountObj(cells)
	//alert(sto.currency)
	if(obj.value == "sgd")
	{
		sto.price *= cur;
		sto.brokerFee *= cur;
		sto.amount *= cur;
		sto.breakEven *= cur;
		sto.curPrice *= cur;
		sto.mktValue *= cur;
		sto.change *= cur;
		//obj.parentNode.nextSibling.disabled = true
	}
	else
	{
		sto.price /= cur;
		sto.brokerFee /= cur;
		sto.amount /= cur;
		sto.breakEven /= cur;
		sto.curPrice /= cur;
		sto.mktValue /= cur;
		sto.change /= cur;
		//obj.parentNode.nextSibling.disabled = false;
	}
	formatStoObj(sto);
	updateStockResult(cells, sto)

}

function changeBroker(obj)
{
	var broker = obj.value
	var a;
	for(var i=0; i<gBrokerList.length; i++)
	{
		if(broker == gBrokerList[i].value)
			a = gBrokerList[i];
	}
	obj.nextSibling.firstChild.value = a.currency
	if(a.currency!="sgd")
	{
		obj.nextSibling.style.display = ""
		obj.nextSibling.nextSibling.style.display = ""
	}
	else
	{
		obj.nextSibling.style.display = "none"
		obj.nextSibling.nextSibling.style.display = "none"
	}
}

function selectSimilarStoTrade(value)
{
	//alert(value)
	var rows = document.getElementById("stockTbl").rows
	for(var i=1; i<rows.length; i++)
	{
		var obj=formatCountObj(rows[i].cells)
		if(obj.name == value)
			rows[i].cells[0].firstChild.checked = true;
	}
}

function toggleStoTradeTbl()
{
	var table = document.getElementById("stockTbl");
	table.style.display = table.style.display == "" ? "none":"";
}


function toggleStoTradeSelection(checked)
{
	var rows = document.getElementById("stockTbl").rows
	for(var i=1; i<rows.length; i++)
	{
		if(rows[i].filterShow)
			rows[i].cells[0].firstChild.checked = checked
	}
}


/********************* live price **********************/
function updateStoPrice()
{
	try{
	//alert(1)
	//var path = (gStoCfg.priceFile + "\\logs\\").replace(/\\\\/, "\\");
	var path = "C:\\Project\\Code\\SelfCreatedTool\\stock\\logs\\";
	var fileName = (new Date()).format("yyyy-mm-dd")+".txt"
	for(var i=0; i<gStockNames.length; i++)
	{
		if(gStockNames[i].code)
		{
			var filePath = path + gStockNames[i].code +"\\" + fileName
			//alert(path);
			gStockNames[i].curPrice = getCurPrice(filePath, 1, 5)
		}
	}

	var rows = document.getElementById("stockTbl").rows;
	for(var i=1; i<rows.length; i++)
	{
		//alert(i)
		var obj=formatCountObj(rows[i].cells)
		var price = getStoPriceByValue(obj.name);
		//alert(price)
		if(price && obj.curPrice != parseFloat(price))
		{
			//alert(obj.currency);
			obj.curPrice = obj.currency!="sgd"? parseFloat(price): parseFloat(price)*obj.rate;
			//alert(obj.curPrice);
			obj.mktValue = obj.curPrice*obj.shareNo
			obj.change = countCurProfit(obj, obj.curPrice);
			//alert(obj.curPrice)
			updateStockResult(rows[i].cells, obj);
		}

	}

	}catch(e){}
}

function getCurPrice(path, index, backupIndex)
{
	//alert(path)
	index = index||1;
	backupIndex = backupIndex || 1;
	var rows = readFile(path).split(/\n/);
	var cells = rows[rows.length-1].split(/\t/);
	//alert(cells[index]);
	var re = parseFloat(cells[index])||parseFloat(cells[backupIndex])
	return re;
}

function countCurProfit(obj, price)
{
	var newObj = {}
	for(var i in obj)
		newObj[i] = obj[i]
	//if(obj)
	newObj.action= newObj.action=="buy" ? "sell": "buy";
	newObj.price = price;
	var a = obj.action=="buy" ? 1: -1;

	if(newObj.action=="buy")
	{
		//alert(newObj.price);
		//alert(newObj.shareNo);

	}

	return formatFloat(a*(countAmount(newObj).amount - obj.amount), 2);
}

function changeCurPriceOption(elt)
{
	var value = elt.value;
	var rows = document.getElementById("stockTbl").rows
	if(value == "none")
	{
		rows[0].cells[9].style.display = "none"
		rows[0].cells[10].style.display = "none"
		rows[0].cells[11].style.display = "none"
	}
	else
	{
		rows[0].cells[9].style.display = ""
		rows[0].cells[10].style.display = ""
		rows[0].cells[11].style.display = ""
	}
	for(var i=1; i<rows.length; i++)
	{
		if(value == "all" || rows[i].cells[2].firstChild.value == value)
		{
			rows[i].cells[9].style.display = ""
			rows[i].cells[10].style.display = ""
			rows[i].cells[11].style.display = ""
			rows[i].cells[9].firstChild.style.display = ""
			rows[i].cells[10].firstChild.style.display = ""
			rows[i].cells[11].firstChild.style.display = ""
		}
		else if(value == "none")
		{
			rows[i].cells[9].style.display = "none"
			rows[i].cells[10].style.display = "none"
			rows[i].cells[11].style.display = "none"
		}
		else
		{
			rows[i].cells[9].style.display = ""
			rows[i].cells[10].style.display = ""
			rows[i].cells[11].style.display = ""
			rows[i].cells[9].firstChild.style.display = "none"
			rows[i].cells[10].firstChild.style.display = "none"
			rows[i].cells[11].firstChild.style.display = "none"
		}

	}

}

/********************* misc **************************/
function validateCountObj(obj)
{
	if(!obj["shareNo"] && obj["price"] && obj["breakEven"]&&!obj["amount"])
	return true;

	//for(var i in obj)alert(obj[i])
	var i=0;
	if(!obj["shareNo"]) i++
	if(!obj["price"])i++
	if(!obj["amount"])i++
	if(i>1)
		return false;
	else
		return true;
}
function configStoTraRow(elt)
{
	var test = {"fsd":231321}
	//alert(dojo.toJson(test));
	var row = elt.parentNode.parentNode
	var a = dojo.toJson(row.status)
	var str = prompt("Input the Attribute", a)
	row.status = dojo.fromJson(str);
	//alert(str)
}

function tryShowText()
{
	var rows = document.getElementById("stockTbl").rows
	for(var i=1; i<rows.length; i++)
	{
		var cells = rows[i].cells
		for(var j=0; j<cells.length-1; j++)
		{
			if(cells[j].childNodes[0].style.display=="none")
			{
				if(j==5)
				{
					var a = cells[j].childNodes
					a[0].style.display=a[1].style.display=a[2].style.display=""
					a[3].style.display="none"

				}
				else if(cells[j].childNodes[1] && cells[j].childNodes[1].tagName.toLowerCase()=="span")
				{
					cells[j].childNodes[0].style.display=""
					cells[j].childNodes[1].style.display="none"
					//log(String.format("childNodes[1]=%s",cells[j].childNodes[1].innerHTML))
				}
			}
			else
			{
				if(j==5)
				{
					var a = cells[j].childNodes
					a[0].style.display=a[1].style.display=a[2].style.display="none"
					a[3].innerHTML = getDropdownText(cells[j].childNodes[0])||cells[j].childNodes[0].value||cells[j].childNodes[0].innerHTML||""
					a[3].style.display=""

				}
				else if(cells[j].childNodes[1] && cells[j].childNodes[1].tagName.toLowerCase()=="span")
				{
					cells[j].childNodes[0].style.display="none"
					cells[j].childNodes[1].innerHTML = getDropdownText(cells[j].childNodes[0])||cells[j].childNodes[0].value||cells[j].childNodes[0].innerHTML||""
					cells[j].childNodes[1].style.display=""
				}
			}
		}
	}
}

function getDropdownText(elt)
{
	if(elt.tagName.toLowerCase() != "select") return
	var w = elt.selectedIndex;
	return elt.options[w].text;
}