#!/bin/bash
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# update_docs: As it says, it updates the docs
#
# 1) update the documentation data from JSDocs of the ts files
# 2) build the ng-app and update the files in docs/ folder
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# 0) some definitions and functions
#
set -e

sep='---------------------------------'

die ()
{
    echo >&2 "$@"
    exit 1
}

usage ()
{
    echo "usage: <command>"
}

inPath='./projects/knora'
outPath='./src/data/documentation'

modules=('action' 'core' 'search' 'viewer')

jsdoc2json ()
{
    arr=("$@")
    for i in "${arr[@]}"
    do
        IFS='/' read -ra path <<< "$i"

        # depth of path
        num=( ${#path[@]} )
    #    echo ${num}

        # module name
        module=( ${path[3]} )
        echo module: ${module}

        # component name
        # get filename from path
        pos=$(( num-1 ))
    #    echo ${pos}
        # filename
        file=( ${path[${pos}]} )
        IFS='.' read -ra names <<< "$file"
        name=( ${names[0]} )
        echo name: ${name}

        # create json from jsdocs using dox
        in=${i}
        out=${outPath}/${module}/${name}.json

        echo in: ${in}
        echo out: ${out}


        dox < ${in} > ${out}

        echo ${sep}

    done
}

if ! git diff-index --quiet HEAD --; then

        die "Uncommited changes. Please commit your changes before running this script again."

fi

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# 1) create data documentation structure and copy all README files
#
# a) create data documentation folder if it doesn't exist
echo create data documentation folder
mkdir -p ${outPath}
echo ${sep}

# b) modules
for m in "${modules[@]}"
do
    # create directory if it doesn't exist
    echo create directory: ${m}
    mkdir -p ${outPath}/${m}
    echo copy module readme of ${m}
    cp ${inPath}/${m}/README.md ${outPath}/${m}/readme.md

    echo ${sep}

done

#
# c) demo app
# create directory if it doesn't exist
echo create directory: demo
mkdir -p ${outPath}/demo
echo copy readme of demo app
cp ./README.md ${outPath}/demo/readme.md

echo ${sep}

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# 2) update the documentation data from JSDocs of the ts files
#

# we should loop through the inPath to write the documentation data files as following:
#dox < projects/knora/action/src/lib/admin-image/admin-image.directive.ts > src/data/documentation/action/admin-image.json

# array of components
components=( $(find ${inPath} -iname "*.component.ts") )
jsdoc2json "${components[@]}"

# array of services
services=( $(find ${inPath} -iname "*.service.ts") )
jsdoc2json "${services[@]}"

# array of directive
directives=( $(find ${inPath} -iname "*.directive.ts") )
jsdoc2json "${directives[@]}"

# array of pipes
pipes=( $(find ${inPath} -iname "*.pipe.ts") )
jsdoc2json "${pipes[@]}"

# special files
special=( $(find ${inPath} -iname "convert-jsonld.ts") )
jsdoc2json "${special[@]}"

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# 3) build the ng-app and update the files in docs/ folder
#



git rm -r docs/*
ng build --prod --base-href /knora-ui/ --build-optimizer --aot --output-path docs
cp docs/index.html docs/404.html
git add docs/*

# if git diff-index --quiet HEAD --; then
#     echo "You have to commit the changes in the documentation."
#     git status
# fi
