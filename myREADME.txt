如果使用npm start 看到下面這條error 但是我已經換方法了所以理論上你們不會遇到這個問題。

Invalid options object. Dev Server has been initialized using an options object that does not match the API schema.
 - options.allowedHosts[0] should be a non-empty string.

請參考這篇文章 

https://bobbyhadz.com/blog/react-could-not-proxy-request-to-localhost

連接資料庫出現問題的時候用這行。
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';這個password是你設的密碼

Bank:
支出的時候可以選擇信用卡，會直接計入在支出，但是同時新增到卡費欄位，然後可以在這個頁面選擇支付卡費之類的

用這個指令來切換到本地沒有但在遠端有的分枝
git switch 'branch name'

docker compose run --rm  certbot certonly --webroot --webroot-path /var/www/certbot/ -d financemanager.ddns.net

docker compose run --rm certbot renew