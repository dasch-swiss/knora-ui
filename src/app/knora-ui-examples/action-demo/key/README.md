## Key pipe

### Usage
Please follow the README of [Knora-ui action module](https://www.npmjs.com/package/@knora/action#key) first!

Then you can use the following methods from `KeyPipe`:

### projects/knora/action/src/lib/pipes/key.pipe.ts

This pipe can be used for "for loops", in the case of an array with non-numeric indexes.
it returns the key and the value and we have to use it as follow:

*ngFor="let item of list | key"

{{item.key}} is the index value;

{{item.value}} are the values

When the value is an object with name and label, you got them with:
{{item.value.name}} resp. {{item.value.label}}

#### transform() 

##### Returns


- `Void`

