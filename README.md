# jquery-commandpalette

A simple command palette plugin for jquery.

## API

### Initialization

```
	$('#element').commandpalette(options);
```


### Content update

```
	$('#element').commandpalette('update', items);
```


### Options

- elementsTemplate (```string```, Default: ```undefined```) : The template to be used for results proposals. By default, results are displayed raw.
- onItemSelected (```function(Object ResultItem)```) : Event triggered when an item is selected within the proposed results.
- onFilter(```function(string searchedTerm, Object ResultItem, DocumentNode selectedElement)```) : Event triggered when the user types a new result.
- items(```Array```, Default: ```[]```) : Array of items used as proposals for the command palette. Items are dictionnaries that must contains a "string" key.


### Templating

Templating is done with a "mustachesque" variant of John Resig's microtemplating library. See the [dedicated example](https://github.com/gwenaelp/jquery-commandpalette/blob/master/examples/templates.html)

## Requirements

- [fuzzy-search](https://github.com/mattyork/fuzzy): "~0.1.0"
- jquery: "~2.1.4"

You can install them automatically with the ```bower install``` command.


## Todo list / Roadmap

- Perfs improvements
- Improve testing
- Travis integration

Feel free to open issues on the [github repository](https://github.com/gwenaelp/jquery-commandpalette).


## Developper Documentation

### Initializing environment

```
$ npm install
$ bower install
```

### Building

```
$ rm -Rf dist && broccoli build dist
```


### Tests

Launch tests/index.html to see tests results.
