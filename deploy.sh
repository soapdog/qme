#!/bin/sh

if [ -d deploy ];
then
    echo "folder exist, removing..."
    rm -rf ./deploy
fi

echo "Copying resources..."
mkdir deploy
cd deploy
cp -r ../www/* ./
cd ..

echo "Adding to git..."
git add deploy
git commit -am "commit for deploy"

echo "deploying..."
git subtree push --prefix deploy origin phonegapbuild
wait

echo "Done! (I hope)"
