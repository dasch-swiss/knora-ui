# Progress indicator / loader
This component is part of [Knora-ui](https://github.com/dasch-swiss/knora-ui) [action module](https://www.npmjs.com/package/%40knora%2Faction), developed by the team at the [Data and Service Center for Humanities DaSCH](http://dasch.swiss).

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

## Theme
It's possible to change the color of the progress-indicator with the following two possibilities:

### Color parameter
Add `[color]="'#ff0000'"` to the kui-progess-indicator tag.

### Define color in sass
Overwrite the progress indicator color in a global scss file

#### Default loader
```SCSS
.kui-progress-indicator {
  .line > div {
    background-color: #ff0000 !important;
  }
}
```

#### Submit loader
Not yet implemented! Here you should use the variant with the `[color]` parameter.
