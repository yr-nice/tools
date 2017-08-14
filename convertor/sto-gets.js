function getFirstRateByStoName(name)
{
	for(var i=0; i<gStockNames.length; i++)
		if(gStockNames[i].label == name)
			name = gStockNames[i].value;
	var arr = getStoTradeObjArr();
	for(var i =0; i<arr.length; i++)
		if(arr[i].name == name)
			return arr[i].rate;
}

function getBrokerCurrencyByStoName(name)
{
	var value = getBrokerByStoName(name);
	return getBrokerCurrency(value);
}


function getBrokerByStoName(name)
{
	var rows = document.getElementById("stockTbl").rows;
	for(var i=0; i<gStockNames.length; i++)
		if(gStockNames[i].label == name)
			name = gStockNames[i].value;

	for(var i=1; i<rows.length; i++)
	{
		if(rows[i].cells[1].firstChild.value == name)
			return rows[i].cells[5].firstChild.value;
	}
	return ""
}


function getBrokerCurrency(value)
{
	for(var i=0; i<gBrokerList.length; i++)
		if(gBrokerList[i].value == value)
			return gBrokerList[i].currency;
}

function getStoNameByValue(stoCode)
{
	for(var i=0; i<gStockNames.length; i++)
	{
		if(gStockNames[i].value==stoCode)
			return gStockNames[i].label;
	}
	return stoCode;
}

function getStoCodeByValue(value)
{
	for(var i=0; i<gStockNames.length; i++)
	{
		if(gStockNames[i].value==value)
			return gStockNames[i].code;
	}
	return "";
}

function getStoPriceByValue(value)
{
	for(var i=0; i<gStockNames.length; i++)
	{
		if(gStockNames[i].value==value)
			return gStockNames[i].curPrice;
	}
	return "";
}

//1 means latest->oldest, -1 means oldest->last, null or 0 means no sort
function getStoTradeObjArr(sort, sortBy)
{
	var rows = document.getElementById("stockTbl").rows
	var arr = [];
	for(var i=1; i<rows.length; i++)
		arr.push(formatCountObj(rows[i].cells))
	if(sort==1)
	{
		for(var i=0; i<arr.length; i++ )
		{
			for(var j=i+1; j<arr.length; j++)
				if(arr[i][sortBy]<arr[j][sortBy])
				{
					var tmp = arr[i];
					arr[i] = arr[j];
					arr[j] = tmp;
				}
		}

	}
	else if(sort==-1)
	{
		for(var i=0; i<arr.length; i++ )
		{
			for(var j=i+1; j<arr.length; j++)
				if(arr[i][sortBy]>arr[j][sortBy])
				{
					var tmp = arr[i];
					arr[i] = arr[j];
					arr[j] = tmp;
				}
		}
	}
	return arr;
}

function getSelectedStockRowObj()
{
	var rows = document.getElementById("stockTbl").rows
	var re=[]
	for(var i=1; i<rows.length; i++)
	{
		//if(rows[i].style.display=="none") continue;
		if(rows[i].cells[0].firstChild.checked)
		{
			var obj=formatCountObj(rows[i].cells)
			re.push(obj)
		}
	}
	return re;
}

