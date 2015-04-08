#!/bin/bash

if [ -z "$2" ]
  then
    echo "\n$0 <file_to_encrypt> <public_rsa_pem>\n"
    echo "  Encrypts <file_to_encrypt> using <public_rsa_pem>, generating a"
    echo "  one-time encrypted asymetric key <file_to_encrypt>.key.enc and the"
    echo "  encrypted file <file_to_encrypt>.enc\n"
    exit 0
fi

if [ ! -f $1 ] || [ ! -f $2 ]
  then
    echo "file not found"
    exit 1
fi

set -e

echo "Encrypting $1 using $2"
openssl rand -base64 32 > key.tmp
openssl rsautl -encrypt -inkey $2 -pubin -in key.tmp -out $1.key.enc
openssl enc -aes-256-cbc -salt -in $1 -out $1.enc -pass file:./key.tmp
rm key.tmp
echo "Now commit $1.enc and $1.key.enc NOT $1!!!"
