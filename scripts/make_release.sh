#!//usr/bin/bash
if [[ $1 == "" ]]; then
   echo "Usage make_release.sh version"
   exit 1
fi
yarn build
mkdir -p lalaux-alertmanager-ds/
rm -rf lalaux-alertmanager-ds/*
mv dist/ lalaux-alertmanager-ds
zip lalaux-alertmanager-ds.$1.zip lalaux-alertmanager-ds -r

