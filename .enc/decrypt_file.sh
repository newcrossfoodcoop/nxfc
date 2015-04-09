#!/bin/bash

if [ -z "$3" ]
  then
    echo "\n$0 <encrypted_file> <encrypted_key> <private_rsa_pem_key>\n"
    exit 0
fi

if [ ! -f $1 ] || [ ! -f $2 ] || [ ! -f $3 ]
  then
    echo "file not found"
    exit 1
fi


echo "Decrypting $1 with $2 using $3..."
openssl rsautl -decrypt -inkey $3 -in $2 -out key.tmp
openssl enc -d -aes-256-cbc -in $1 -out $1.dec -pass file:./key.tmp
rm key.tmp
