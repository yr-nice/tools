var gTabs = [{label:"Estate", elementId:"mainbg"},
 	     {label:"BMI",elementId:"bmiContainer"},
		 {label:"Stock", elementId:"stockContainer"}];

var gCells = [
			{attr:"checked", html:"<input type='checkbox'>"},
			{attr:"name", html:"<select ondblclick='selectSimilarStoTrade(this.value)'></select><span></span>"},
			{attr:"action", html:"<select onchange='changeStockAction(this)'><option value=buy>Buy</option><option value=sell>Sell</option></select><span></span>"},
			{attr:"shareNo", html:"<input type=text value=1000 size=4><span></span>"},					//shares no
			{attr:"price", html:"<input type=text size=3><span></span>"},								// Price
			{attr:"broker", html:""},	// broker
			{attr:"brokerFee", html:"<input type=text size=11 readonly><span></span>"},														//broker fee
			{attr:"amount", html:"<input type=text size=8><span></span>"},							//amount
			{attr:"breakEven", html:"<input type=text size=4><span></span>"},								//break even
			{attr:"curPrice", html:"<span></span>"},
			{attr:"mktValue", html:"<span></span>"},
			{attr:"change", html:"<span></span>"},								//break even
			{attr:"date", html:"<input type=text size=8><span></span>"},	//date
			//{attr:"profit", html:"<input type=text size=7>"},	//profit
			//{attr:"profitPer", html:"<input type=text size=4>%"},
			//<input type=button size=7 value=Config onClick=configStoTraRow(this)>
			{attr:"count", html:"<input type=button size=7 value=Count onClick=countStockRow(this)><input type=button size=7 value=Copy onClick=createCopyStoTraRow(this)>"}	//count

		  ]

var gRlt = {length:19, name:0, bNo:1, sNo:2,hNo:3, bAmt:4, sAmt:5, balance:6, aBP:7, aSP:8, broFee:9, brkEn:10,
			curPft:11, curPrc:12, mktVal:13, change:14, tPft:15, tPer:16, tPrc:17, count:18};
var gTrd = {date:12};
var gStockNames = [
				{label:"STI Etf" , value:"stietf", code:"STI ETF" },
				{label:"DBS" , value:"dbs", code:"DBS" },
				{label:"Kepland" , value:"kepland", code:"kepland" },
				{label:"L Cmmdy" , value:"lcmmdy", code:"Lyxor Cmdty" },
				{label:"L China" , value:"lchina", code:"Lyxor China" },
				{label:"Qianhu" , value:"qianhu", code:"QianHu" }
			  ]
var gBrokerList = [
				{label:"iOCBC", value:"ocbc", currency:"sgd"},
				{label:"iOCBC US", value:"ocbcus", currency:"usd"}
					];


var gConf = "";
//var gTradePerPage = 5;
var gTotalPage = 1;
var gStoCfg="";
var fso = new ActiveXObject("Scripting.FileSystemObject");

var TwoLevel_nCnt = 100;
function TwoLevel_IESetup() {
  var aTmp2, i, j, oLI, oTmp;
  var aTmp = xGetElementsByClassName("twolevel", document, "ul");
  if (aTmp.length) {
    for (i=0;i<aTmp.length;i++) {
      aTmp2 = aTmp[i].getElementsByTagName("li");
      for (j=0;j<aTmp2.length;j++) {
        oLI = aTmp2[j];
        if (oTmp = oLI.getElementsByTagName("ul")) {
          oLI.UL = oTmp[0];
          oLI.onmouseenter = function() {
            this.className += " twolevelhover";
          };
          oLI.onmouseleave = function() {
            this.className = this.className.replace(/twolevelhover/,"");
          };
        }
      }
    }
  } else if (TwoLevel_nCnt < 2000) {
    setTimeout("TwoLevel_IESetup()", TwoLevel_nCnt);
    TwoLevel_nCnt *= 2.5;
    TwoLevel_nCnt = parseInt(TwoLevel_nCnt, 10);
  }
}
var TwoLevel_proto = "javascript:void(0)";
if (location.protocol == "https:") TwoLevel_proto = "src=//0";
document.write("<scr"+"ipt id=__ie_onload defer " + TwoLevel_proto + "><\/scr"+"ipt>");
var TwoLevel_script = document.getElementById("__ie_onload");
TwoLevel_script.onreadystatechange = function() {
  if (this.readyState == "complete") {
    TwoLevel_IESetup();
  }
};
function xGetElementsByClassName(clsName, parentEle, tagName) {
  var elements = null;
  var found = new Array();
  var re = new RegExp('\\b'+clsName+'\\b');
  if (!parentEle) parentEle = document;
  if (!tagName) tagName = '*';
  if (parentEle.getElementsByTagName) {elements = parentEle.getElementsByTagName(tagName);}
  else if (document.all) {elements = document.all.tags(tagName);}
  if (elements) {
    for (var i = 0; i < elements.length; ++i) {
      if (elements[i].className.search(re) != -1) {
        found[found.length] = elements[i];
      }
    }
  }
  return found;
}


function AREA_MEASURES()
{
  this.mSquare_kilometer = (1000 * 1000)
  this.mHectare = (100 * 100)
  this.mSquare_meter = 1
  this.mAre = ((10000/15) * this.mSquare_meter)
  this.mSquare_decimeter = (0.1 * 0.1)
  this.mSquare_centimeter = (0.01 * 0.01)
  this.mSquare_millimeter = (0.001 * 0.001)
  this.engSquare_foot = (0.3048 * 0.3048)
  this.engSquare_yard = (3 * 3 * this.engSquare_foot)
  this.usSquare_rod = (16.5 *16.5 * this.engSquare_foot)
  this.engAcre = 160 * this.usSquare_rod
  this.engSquare_mile = (5280 *5280 * this.engSquare_foot)
  this.engSquare_inch = (this.engSquare_foot / (12 * 12))
}
var area_data = new AREA_MEASURES();
function checkNum(str) {
  for (var i=0; i<str.length; i++) {
    var ch = str.substring(i, i + 1)
    if (ch!="." && ch!="+" && ch!="-" && ch!="e" && ch!="E" && (ch < "0" || ch > "9")) {
      alert("请输入有效的数字");
      return false;
    }
  }
  return true
}
function normalize(what,digits) {
  var str=""+what;
  var pp=Math.max(str.lastIndexOf("+"),str.lastIndexOf("-"));
  var idot=str.indexOf(".");
  if (idot>=1) {
    var ee=(pp>0)?str.substring(pp-1,str.length):"";
    digits+=idot;
    if (digits>=str.length)
      return str;
        if (pp>0 && digits>=pp)
      digits-=pp;
    var c=eval(str.charAt(digits));
    var ipos=digits-1;
    if (c>=5)  {
      while (str.charAt(ipos)=="9")
        ipos--;
      if (str.charAt(ipos)==".") {
        var nc=eval(str.substring(0,idot))+1;
        if (nc==10 && ee.length>0) {
          nc=1;
          ee="e"+(eval(ee.substring(1,ee.length))+1);
        }
        return ""+nc+ee;
      }
      return str.substring(0,ipos)+(eval(str.charAt(ipos))+1)+ee;
    } else
      var ret=str.substring(0,digits)+ee;
    for (var i=0; i<ret.length; i++)
        if (ret.charAt(i)>"0" && ret.charAt(i)<="9")
          return ret;
    return str;
  }
  return str;
}
function compute(obj,val,data)
{
  var total = parseFloat(obj["mSquare_totalPrice"].value)*1000;
  if (obj[val].value)
  {
    var uval=0;
    uval = obj[val].value*data[val];
    if( (uval >= 0) && (obj[val].value.indexOf("-") != -1) )
    {
      uval = -uval;    // *** Hack for Opera 4.0  2000-10-14
    }
    for (var i in data)
      obj[i].value=normalize(uval/data[i],8);
    //alert(obj[val+"_price"].value);
    if(obj[val+"_price"].value)
    	total = obj[val+"_price"].value * obj[val].value;
    if(total)
    {
		for (var i in data )
		 if(i!=val)
		  obj[i+"_price"].value=total/obj[i].value;
		obj["mSquare_totalPrice"].value = total/1000;
	}
  }
}
function resetValues(form,data) {
	form["mSquare_totalPrice"].value="";
    for (var i in data)
    {
      form[i].value="";
      form[i+"_price"].value="";
    }
}

function resetAll(form) {
  resetValues(form,area_data);
}


function bmiBlur(obj)
{
	//alert(obj.value);
	if(!parseFloat(obj.value))
		return;
	else
		countBMI(obj.form, obj.name);
}

function countBMI(form, name)
{
	var height = parseFloat(form["height"].value);
	var weight = parseFloat(form["weight"].value);
	var bmi = parseFloat(form["bmi"].value);

	if(name=="height")
		weight? bmi = weight/(height*height) : (bmi? weight= height * height * bmi :"");
	else if (name == "weight")
		height? bmi = weight/(height*height) : (bmi? height = Math.sqrt(weight/bmi) :"");
	else if (name == "bmi")
		height? weight = height * height * bmi : (weight? height = Math.sqrt(weight/bmi) :"");
	else
	{
		if(!bmi)
		{
			if(!weight || !bmi) return;
			height = Math.sqrt(weight/bmi);
		}
		else if(!weight)
		{
			if(!bmi) return;
			weight = height * height * bmi;
		}
		else
			bmi = weight/(height*height);
	}

	form["height"].value = height;
	form["weight"].value = weight;
	form["bmi"].value = bmi;
}

function clearBMI(form)
{
	for(var i in form)
	{
		if(form[i] && form[i].type == "text" && form[i].value)
		   form[i].value = "";
	}
}


function countStock(form)
{
	//alert(form["brokerFee"]);
	var noShare = parseInt(form["noShare"].value);
	var buyPrice = parseFloat(form["buyPrice"].value);
	if(!noShare && !buyPrice)
		return;
	var amount = noShare*buyPrice;
	var brokerFee = countBrokerFee(amount);
	var total = amount + brokerFee;
	var feePercent = brokerFee*100/amount;
	document.getElementById("brokerFee").innerHTML = formatFloat(brokerFee,2) +" ("+formatFloat(feePercent,2)+"%)";
	form["purAmount"].value = formatFloat(total,2);;
	var breakEven = (total+brokerFee)/noShare;
	document.getElementById("breakEven").innerHTML = formatFloat(breakEven,3);

	var sellPrice = parseFloat(form["sellPrice"].value);
	var sellamount = sellPrice*noShare;
	var sellFee = countBrokerFee(sellamount);
	var sellTotal = sellamount-sellFee;
	var sellFeePer = sellFee*100/sellamount;
	//alert(sellFee);
	//alert(formatFloat(sellFee,2));
	document.getElementById("sellBrokerFee").innerHTML = formatFloat(sellFee,2) +" ("+formatFloat(sellFeePer,2)+"%)";
	form["salAmount"].value = formatFloat(sellTotal,2);
	document.getElementById("profit").innerHTML = formatFloat(sellTotal - total, 2) +" ("+formatFloat((sellTotal - total)*100/total,3)+"%)";

}

function countBrokerFee(amount)
{
	//alert(amount);
	var broker = document.getElementById("broker").value;
	var re = 0;
	if(broker=="ocbc")
	{
		//re = amount>100000? ((amount-100000)*0.002+100000*0.00275) : amount*0.00275;
		re = amount>100000? amount*0.002 : amount*0.00275;
		re < 25? re=25: "";
		re = (re + amount*0.0004 + amount*0.000075)*1.07;
	}
	//else if(broker=="ocbcus"){}
	//alert(re);
	return re;
}

function formatFloat(f, index)
{
	var str = f + "";
	dot = str.indexOf(".");
	if(dot==-1) return f;
	re = str.slice(0, dot+index+1);
	//alert(str.charAt(dot+index+1));
	if(str.charAt(dot+index+1)>="5")
		re = parseFloat(re.slice(0, -1)) + (parseInt(str.charAt(dot+index))+1)/Math.pow(10,index);
	re = re.toString();
	dot = re.indexOf(".");
	if(dot!=-1)
		re = re.slice(0, dot+index+1)
	return parseFloat(re);
}

function test(form)
{
	log(formatFloat(6978.99996625, 2));
}





function init()
{
	var tab = document.getElementById("tabContainer");
	var strTab = "";
	for(var i in gTabs)
	{
		strTab += "<a onclick='clickTab(this)'>"+gTabs[i].label+"</a>";
	}
	tab.innerHTML = strTab;
	tab.getElementsByTagName("a")[2].onclick();
	loadSetting()
	initStoTrade()
	attachSortEventStoTrade()
	initStoTradePg()
	updateStoPrice();
	setInterval("updateStoPrice()", 5*1000);
}


function clickTab(obj)
{
	var tabs = obj.parentNode.getElementsByTagName("a");
	for(var i=0; i<tabs.length; i++)
		tabs[i].style.background = "#E5E5E5";
	//setAllTabClr("#E5E5E5");
	obj.style.background = "white";
	//alert(obj.innerHTML)

	for(var i=0; i<gTabs.length; i++)
		if(obj.innerHTML == gTabs[i].label)
			document.getElementById(gTabs[i].elementId).style.display=""
		else
			document.getElementById(gTabs[i].elementId).style.display="none"

}

