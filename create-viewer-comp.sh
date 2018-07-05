#!/bin/bash

# shell script to create all viewer modules

objectArray=("stillImage" "movingImage" "audio" "ddd" "text" "document" "collection" "region" "annotation" "linkObj")

for obj in "${objectArray[@]}"
do
    echo "ng g c object/$obj --project=@knora/viewer --stylext=scss --prefix=kui"
    ng g c object/${obj} --project=@knora/viewer --stylext=scss --prefix=kui
done


propertyArray=("textValue" "dateValue" "intValue" "colorValue" "decimalValue" "uriValue" "booleanValue" "geometryValue" "geonameValue" "intervalValue" "listValue" "linkValue" "externalResValue")

for val in "${propertyArray[@]}"
do
    echo "ng g c property/$val --project=@knora/viewer --stylext=scss --prefix=kui"
    ng g c property/${val} --project=@knora/viewer --stylext=scss --prefix=kui
done

viewArray=("listView" "gridView" "tableView" "objectView" "compareView" "graphView")
for view in "${viewArray[@]}"
do
    echo "ng g c view/$view --project=@knora/viewer --stylext=scss --prefix=kui"
    ng g c view/${view} --project=@knora/viewer --stylext=scss --prefix=kui
done
