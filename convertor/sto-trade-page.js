/************************ page ************************************/
function initStoTradePg()
{
	updateTotalPage()
	var rows = document.getElementById("stockTbl").rows
	for(var i=gTradePerPage+1; i<rows.length; i++)
		rows[i].style.display = "none"
	document.getElementById("curPage").innerHTML = 1;
	document.getElementById("stoFilterName").value = "kinds";
	document.getElementById("stoFilterName").onchange();
}

function updateTotalPage()
{
	//gTradePerPage = gTradePerPage||5;
	document.getElementById("tradesPerPage").value = gTradePerPage;
	var table = document.getElementById("stockTbl");
	var len = 0;
	for(var i=1; i<table.rows.length; i++)
		table.rows[i].filterShow? len++ : ""

	var total = Math.ceil(len/gTradePerPage);
	gTotalPage =total
	document.getElementById("totalPages").innerHTML = total;

	/*if(total<2)
		document.getElementById("pages").style.display="none"
	else
	{
		document.getElementById("pages").style.display="";

	}	*/
}

function movePage(i)
{
	var cur = parseInt(document.getElementById("curPage").innerHTML) || 1
	var to = cur+i<=gTotalPage? cur+i:1;
	to = to>0? to:gTotalPage
	moveToPage(to);
}

function moveToPage(to)
{
	var rows = document.getElementById("stockTbl").rows
	var arr=[];
	for(var i=1; i<rows.length; i++)
	{
		rows[i].style.display = "none"
		if(rows[i].filterShow) arr.push(rows[i])
	}

	for(var i=(to-1)*gTradePerPage; i<to*gTradePerPage && i<arr.length; i++)
		arr[i].style.display = ""
	document.getElementById("curPage").innerHTML = to;
}


function updateTradesPerPage()
{
	var cur = document.getElementById("tradesPerPage").value;
	if(cur && cur != gTradePerPage)
	{
		gTradePerPage = cur;
		updateTotalPage();
		var a = parseInt(document.getElementById("curPage").innerHTML) || 1
		moveToPage(a);
	}
}

/************************ sort ************************************/

function sortStoTrade(sortBy, order)
{
	order = order||"up";
	var rows = document.getElementById("stockTbl").rows
	var arr = getStoTradeObjArr();
	if(order=="down")
	{
		for(var i=0; i<arr.length; i++ )
		{
			for(var j=i+1; j<arr.length; j++)
				if(arr[i][sortBy]<arr[j][sortBy])
				{
					var tmp = arr[i];
					arr[i] = arr[j];
					arr[j] = tmp;
					rows[i+1].swapNode(rows[j+1])
				}
		}
	}
	else
	{
		//alert(arr[1].name);
		for(var i=0; i<arr.length; i++ )
		{
			for(var j=i+1; j<arr.length; j++)
			{
				if(arr[i][sortBy]>arr[j][sortBy])
				{
					var tmp = arr[i];
					arr[i] = arr[j];
					arr[j] = tmp;
					rows[i+1].swapNode(rows[j+1])
				}
			}
		}
	}
	//var tmp = rows[0];
	//rows[1].swapNode(rows[2]);
	//rows[1] = tmp;
}

function attachSortEventStoTrade()
{
	var cells = document.getElementById("stockTbl").rows[0].cells
	for(var i=1; i<gCells.length-1; i++)
	{
		//alert(cells[i])
		cells[i].attr=gCells[i].attr;
		cells[i].sort="";
		cells[i].onclick=clickStoTradeTitle;
	}

}

function clickStoTradeTitle()
{
	sortStoTrade(this.attr, this.sort);
	this.sort = this.sort == "down" ? "up":"down"
	var cur = parseInt(document.getElementById("curPage").innerHTML) || 1
	moveToPage(cur);
}








/*********************** filter ***************/

function changeFilterName(elt)
{
	var rows = document.getElementById("stockTbl").rows
	var subFilter = document.getElementById("subFilter");
	var inputFilter = document.getElementById("inputFilter")
	var statusFilter = document.getElementById("statusFilter")
	var a = elt.value;
	subFilter.style.display = "none"
	inputFilter.style.display = "none"
	statusFilter.style.display = "none"
	toggleStoTradeSelection(false)
	if(a == "all")
	{
		for(var i=1; i<rows.length; i++)
			rows[i].filterShow = true
	}
	if(a == "selected")
	{
		for(var i=1; i<rows.length; i++)
			rows[i].filterShow = rows[i].cells[0].firstChild.checked
	}
	else if(a == "unselected")
	{
		for(var i=1; i<rows.length; i++)
			rows[i].filterShow = !rows[i].cells[0].firstChild.checked
	}
	else if(a == "name")
	{
		//alert(subFilter);
		subFilter.style.display = ""
		subFilter.options[0] = new Option("All", "all")
		for(var i=0; i<gStockNames.length; i++)
		{
			subFilter.options[i+1] = new Option(gStockNames[i].label, gStockNames[i].value);
		}
	}
	else if(a == "action")
	{
		subFilter.innerHTML=""
		subFilter.style.display = ""
		subFilter.options[0] = new Option("All", "all")
		subFilter.options[1] = new Option("Buy", "buy");
		subFilter.options[2] = new Option("Sell", "sell");
	}
	else if(a == "date")
	{
		inputFilter.style.display = ""
		var inputs = inputFilter.getElementsByTagName("input")
		var date = new Date()
		inputs[1].value=date.format("yyyy-mm-dd")
		date.setMonth(date.getMonth()-1)
		inputs[0].value=(date).format("yyyy-mm-dd")
	}
	else if(a == "kinds")
	{
		for(var i=1; i<rows.length; i++)
			rows[i].filterShow = false;
		for(var j=0; j<gStockNames.length; j++)
		{
			for(var i=1; i<rows.length; i++)
			{
				if(rows[i].cells[1].firstChild.value==gStockNames[j].value)
				{
					rows[i].filterShow = true;
					break;
				}
			}
		}
	}
	updateTotalPage();
	moveToPage(1);
}

function filterStoTrade(elt)
{
	var rows = document.getElementById("stockTbl").rows
	var a = elt.value;
	var b = document.getElementById("stoFilterName").value
	//log(elt.previousSibling.tagName)
	log(b)
	if(a == "all")
	{
		for(var i=1; i<rows.length; i++)
			rows[i].filterShow = true
	}
	else if( b == "name")
	{
		//alert(1)
		for(var i=1; i<rows.length; i++)
			rows[i].filterShow = (rows[i].cells[1].firstChild.value==a)
	}
	else if(b == "action")
	{
		for(var i=1; i<rows.length; i++)
			rows[i].filterShow = (rows[i].cells[2].firstChild.value==a)
	}
	updateTotalPage();
	moveToPage(1);

}

function filteDate()
{
	var inputFilter = document.getElementById("inputFilter")
	var inputs = inputFilter.getElementsByTagName("input")
	var from = inputs[0].value||""
	var to = inputs[1].value||(new Date()).format("yyyy-mm-dd")
	var rows = document.getElementById("stockTbl").rows
	for(var i=1; i<rows.length; i++)
	{
		var tmp = rows[i].cells[gTrd.date].firstChild.value
		rows[i].filterShow = (tmp<=to && tmp>=from)
	}
	updateTotalPage();
	moveToPage(1);
}