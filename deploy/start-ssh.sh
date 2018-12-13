#!/bin/bash


sshPath="~deployusr/.ssh"
authKeys="$sshPath/authorized_keys"


if [ ! -d "$sshPath" ]; then
  mkdir -p ~deployusr/.ssh
fi


if [ -f "$file" ] then
  echo "Creating authorized_keys"
  touch $HOME/.ssh/authorized_keys
fi

sh -c "cat $HOME/.ssh/authorized_keys >> $authKeys"
chown -R deployusr: ~deployusr/.ssh
chmod 700 ~deployusr/.ssh
sh -c "chmod 600 ~deployusr/.ssh/*"