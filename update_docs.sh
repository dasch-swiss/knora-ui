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
    echo ${sep}
#    echo "-i = InputPath"
#    echo "-o = OutputPath"
#    echo ${sep}
}

inPath='./projects/knora/'
outPath='./src/data/documentation/'


# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# 1) update the documentation data from JSDocs of the ts files
#

# we should loop through the inPath to write the documentation data files as following:
dox < projects/knora/action/src/lib/admin-image/admin-image.directive.ts > src/data/documentation/action/admin-image.json
dox < projects/knora/action/src/lib/progress-indicator/progress-indicator.component.ts > src/data/documentation/action/progress-indicator.json

dox < projects/knora/core/src/lib/services/admin/users.service.ts > src/data/documentation/core/users.json

# read the files
#for i in ${inPath}*; do
#    if [ -d "$i" ]; then
#        echo ${i}
#    fi
#done


# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# 2) build the ng-app and update the files in docs/ folder
#
ng build --prod=false --base-href /Knora-ui/ --build-optimizer --aot
rm -rf docs/*
mv dist/knora-ui/* docs
