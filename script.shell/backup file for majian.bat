@echo on
set from=C:\temp\example
set to=C:\temp\example_bak

for /f "tokens=1-3 delims=./- " %%f in ('date /t') do (
    set today=%%f-%%g-%%h
 )

for /f "tokens=1-3 delims=./- " %%f in ('time /t') do (
    set time=%%g.%%h
 )

echo %today%
set to=%to%-%today%_%time%

xcopy "%from%" "%to%" /i /s /y
pause
