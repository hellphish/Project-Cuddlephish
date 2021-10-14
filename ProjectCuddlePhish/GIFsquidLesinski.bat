cls
@echo off
mode con: cols=80 lines=50
SETLOCAL

ansicon.exe -p

if not "%1"=="" goto param

:INTERACTIVE
set "giffps=24"
set "gifmem=2000"
set "inputpath=frames"
set "outputpath=output"
set /P giffps="Enter desired FPS (default 24): "
set /P gifmem="Enter max RAM usage in MB eg enter '3000' to use 3 Gigabytes of RAM (default 2000): "

if giffps==NUL set giffps=24
if gifmem==NUL set gifmem=2000
if inputpath==NUL set "inputpath=frames"
if outputpath==NUL set "outputpath=output"
goto make

:PARAM
set giffps=%1
set gifmem=%2
set "inputpath=%3"
set "outputpath=%4"
set giffuzz=%5
set gifsize=%6
REM set ditherSettings=%7
REM set ditherSettings=%ditherSettings:"=%
set gifname=%7
set turbo=%8
set palette=%appdata%/palette.png

@echo off
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"

set "fullstamp=%YYYY%-%MM%-%DD%_%HH%-%Min%-%Sec%"



:MAKE
REM cls
if not exist %outputpath%\ (mkdir %outputpath%)
echo.
type squidpicspock.ans
echo.

if %turbo%==true goto turbo


REM bin\convert +repage -fuzz %giffuzz%%% -delay 1x%giffps% -limit memory %gifmem%MB -loop 0 %inputpath%[%gifsize%] %ditherSettings% -layers OptimizeTransparency %outputpath%/%gifname%-%fullstamp%.gif 2>> %programdata%\GIFsquid.log
echo --==High Quality (SLOW) Mode==--
echo off
if not exist %outputpath%\PNG (mkdir %outputpath%\PNG)
echo --==Decoding video to frames==--
bin\ffmpeg -v quiet -i %inputpath% -vf scale=%gifsize% %outputpath%/PNG/frame%%04d.png
echo --==Encoding frames to GIF!!==--
bin\gifski --fps %giffps% --quality %giffuzz% -o %outputpath%/%gifname%-%fullstamp%.gif %outputpath%/PNG/*.png
%SystemRoot%\explorer.exe "%outputpath%"
goto done

:TURBO
echo --==TURBO MODE activated==--
echo off
if not exist %outputpath%\PNG (mkdir %outputpath%\PNG)
echo --==Decoding video to frames==--
bin\ffmpeg -v quiet -i %inputpath% -vf scale=%gifsize% %outputpath%/PNG/frame%%04d.png
echo --==Encoding frames to GIF!!==--
bin\gifski --fast --fps %giffps% --quality %giffuzz% -o %outputpath%/%gifname%-%fullstamp%.gif %outputpath%/PNG/*.png
%SystemRoot%\explorer.exe "%outputpath%"
goto done


:DONE
echo.
echo.
Echo GIF is all done!
Echo Mopping up the mess!
echo.
echo off
del /f /s /q %inputpath%
del /f /s /q %outputpath%\PNG\*.png > NUL
rmdir /s /q %outputpath%\PNG