function readFile(path)
{
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var f = fso.OpenTextFile(path, 1);
	return f.ReadAll();
}

function writeFile(str, path)
{
	var f = fso.OpenTextFile(path, 2, true);
	f.Write(str);
	f.Close();
}

function getFolder()
{
	//alert(location.href);
	var re = location.href.match(/file:\/\/\/(.*)convertor\.hta/i);
	//alert(re[1]);
	if(re[1])
		return re[1];
	else
		return "./";
}

function log(str)
{
	//fso = fso||new ActiveXObject("Scripting.FileSystemObject");
	var logfile = fso.OpenTextFile(getFolder()+"logs.txt", 8, true);
	logfile.Write(str+"\n");
	logfile.Close();
}