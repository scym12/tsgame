del list.txt
dir .\assets\*.json /B >> list.txt
start http://localhost:8080/spineView2.html
http-server -c1
