# Training Notes #
An app to jut down notes for your training sessions.

## Setup ##
### Generate ssl key ###
Since I don't want to check in any key files, here are the instructions to generate one yourself. Use your favorite method, or use the steps below.
```
openssl req -x509 -out server.crt -keyout server.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```