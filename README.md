![object-conform](/conform.png?raw=true)

object-conform
=========

object-conform allows you to ensure that objects conform to a model.

## Installation

```
npm install --save object-conform
```

## Usage

The module exports a single function: conform

```javascript
var conform = require( 'object-conform' );

var model = {
    foo: 'foo',
    bar: [ 1, 2, 3 ],
    baz: {
        yak: true,
        emu: false
    }
};

var object = {
    extraneous: true,
    foo: 'otherfoo',
    baz: {
        yak: true,
        emu: false,
        extraneous: true
    }
};

var conformed = conform( {
    model: model,
    object: object
} );

console.log( JSON.stringify( conformed, null, 4 ) );
```

This will result in a conformed object, with extraneous fields removed and missing fields added,
but with existing fields shared with the model preserved:

```JSON
{
    "foo": "otherfoo",
    "bar": [
        1,
        2,
        3
    ],
    "baz": {
        "yak": true,
        "emu": false
    }
}

```

## Contributing

Pull requests are very welcome! Just make sure your code:

1) Passes jshint given the included .jshintrc

2) Is beautified using jsbeautifier and the included .jsbeautifyrc

## Why?

I wanted a simple, reusable way to ensure objects conformed to basic models.

# CHANGELOG

v0.1.0
------
- Initial release.

# ATTRIBUTION

- Header Image: https://commons.wikimedia.org/wiki/File:Staggered.png#filelinks
