#!/bin/bash

# GIT FOR NEWBIES
# The Automatic Git Commit Script
# For the git peasant Hundotte
# (c) xiurobert 2016-2017. All rights reserved

function pushcheck {
  if [ "$1" = "--push" ];
  then
    echo -e "You have requested that I push your changes. I am now doing so...\n"
    git push
  fi
}
echo -e "----------------------------------------------------------------\n"
echo -e "Welcome to the InfiniaPress Commit Tool!\n"

echo -e "This should make your life easier. You just simply have to type your commit message and it handles the rest\n"
echo -e "This cannot resolve conflicts. Fix the conflicts yourself\n"
echo -e "You can use ./commit.sh --push to push your changes as well\n"


if [ "$1" = "--push" ];
  then
    echo "Ok. I will push your changes as well"
fi

echo "Adding all files to git"

git add -A

echo -e "Please enter your author: (e.g. 'adude <adude@email.lol>') "
read author

echo "Your author is ${author}. Is this correct? [Y/n]"

read yn1
case $yn1 in
    [Yy]* ) echo -e "Ok, I have remembered it\n";;
    [Nn]* ) echo -e "Please enter your author again: "; read author;;
    * ) echo "Please answer yes or no.";;
esac

echo -e "Please enter your commit message: "

read commmsg

echo "Your commit message is ${commmsg}. Is this correct? [Y/n]:"

read yn
case $yn in
    [Yy]* ) echo -e "Ok, I am committing your files to git\n"; git commit -a -m "$commmsg" --amend --author="${author}"; pushcheck; exit;;
    [Nn]* ) echo -e "Please enter your commit message again: "; read commmsg;;
    * ) echo "Please answer yes or no.";;
esac

exit
