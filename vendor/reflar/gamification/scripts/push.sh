#!/usr/bin/env bash

base=$PWD

git add .

cd scripts

php PreCommit.php

if [ $? -eq 1 ];
then	
	exit
else
    cd ../

	read -p "Commit message: " commit
	git commit -m "$commit"
	
	read -p "Would you like to push? [y/n]: " yn
	
	if [ $yn = "y" ];
	then
		git push
	else
		exit
	fi
fi
