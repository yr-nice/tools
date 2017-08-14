gSourceFolder="C:\\temp\\"
gDestFolder="C:\\temp\\result\\"

var fso, folder, s;
fso = new ActiveXObject("Scripting.FileSystemObject");
folder = fso.GetFolder(gSourceFolder);

var WshShell = new ActiveXObject("WScript.Shell");

var files = new Enumerator(folder.files);
for (; !files.atEnd(); files.moveNext())
{
	var f = files.item();
	//WScript.Echo(f.Name);
	//WScript.Echo(f.Path);
	//WshShell.Exec("siftWin32 -display "+f.Path+" "+gDestFolder+f.Name);
	if(f.Path.match(/js$/i))
		WScript.Echo("siftWin32 -display <"+f.Path+"> "+gDestFolder+f.Name);

}
