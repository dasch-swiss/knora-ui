# Progress indicator / loader
This component is part of [Knora-ui](https://github.com/dhlab-basel/Knora-ui) [action module](https://www.npmjs.com/package/%40knora%2Faction), developed by the team at the [DHLab Basel](http://dhlab.unibas.ch).

## How to use
You have to add the [knora action module](https://www.npmjs.com/package/%40knora%2Faction) first, to use the progress indicator:

### 1. classic loader
[Example and demo](https://stackblitz.com/edit/knora-progress-indicator)

`<kui-progress-indicator></kui-progress-indicator>`

### 2. submit-form-data loader
[Example and demo](https://stackblitz.com/edit/knora-progress-indicator)

`<kui-progress-indicator [status]="status"></kui-progress-indicator>`

Status is a number:
* -1 => not ready
*  0 => is loading
*  1 => done

and in case of an error: the number is 400
