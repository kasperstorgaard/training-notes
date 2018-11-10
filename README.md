# Training Notes #
An app to jut down notes for your training sessions.

## Setup ##
### Generate ssl key ###
Since I don't want to check in any key files, here are the instructions to generate one yourself. Use your favorite method, or use the steps below.
```
openssl genrsa -des3 -passout pass:x -out server.pass.key 2048
openssl rsa -passin pass:x -in server.pass.key -out server.key
rm server.pass.key
openssl req -new -key server.key -out server.csr
openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt
```