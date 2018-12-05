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

dir=`pwd`
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

home=`pwd`
inPath='./projects/knora'
outPath='./src/data/documentation'

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

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# 1) update the documentation data from JSDocs of the ts files
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


# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# 2) build the ng-app and update the files in docs/ folder
#

ng build --prod=false --base-href /Knora-ui/ --build-optimizer --aot --output-path docs
cp docs/index.html docs/404.html
