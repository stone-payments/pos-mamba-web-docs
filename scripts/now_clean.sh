#!/bin/bash

now ls mambasdkdocs --all | grep -Eo '(mambasdkdocs-.+?\.sh)' | awk '{print $1}' | xargs now rm -y -s