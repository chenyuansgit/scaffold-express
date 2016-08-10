# 生成https的证书文件


    1. mkdir key && cd key

    2. 生成私钥key文件
    openssl genrsa -out privatekey.pem 1024


    3. 生成CSR证书签名
    openssl req -new -key privatekey.pem -out certrequest.csr

    **
    Country Name (2 letter code) [AU]:CN
    State or Province Name (full name) [Some-State]:Beijing
    Locality Name (eg, city) []:Beijing
    Organization Name (eg, company) [Internet Widgits Pty Ltd]:artron
    Organizational Unit Name (eg, section) []:artron
    Common Name (eg, YOUR name) []:alisa
    Email Address []:

    Please enter the following 'extra' attributes
    to be sent with your certificate request
    A challenge password []:123456
    An optional company name []:123456
    **

	4. 生成证书文件
	openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
