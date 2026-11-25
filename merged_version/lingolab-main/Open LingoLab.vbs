Option Explicit

Dim shell, fso, projectFolder, indexFile
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
projectFolder = fso.GetParentFolderName(WScript.ScriptFullName)
indexFile = fso.BuildPath(projectFolder, "index.html")

' Open the static site directly. The frontend stores language progress locally
' and falls back gracefully when the optional Python API is unavailable.
shell.Run """" & indexFile & """", 1, False
