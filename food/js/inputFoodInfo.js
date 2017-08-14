function updateInfo()
{
	var doc = new ActiveXObject("msxml2.DOMDocument");
	//alert(doc);
	var root = doc.createElement("root");
	doc.appendChild(root);

	alert(doc.xml);
}