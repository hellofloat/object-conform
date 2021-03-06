/* jshint -W030 */ /* should.be.true causes this to fire all the time */
/* global describe, it */
'use strict';

require( 'should' );
var conform = require( '../index.js' );

describe( 'basics', function() {
    var model = {
        foo: null,
        bar: 'string',
        baz: 10,
        yak: true
    };

    describe( 'empty object', function() {
        var object = {};
        it( 'populates', function() {
            object = conform( {
                model: model,
                object: object
            } );

            for ( var field in model ) {
                if ( !model.hasOwnProperty( field ) ) {
                    continue;
                }

                object.should.have.property( field, model[ field ] );
            }
        } );
    } );

    describe( 'extraneous fields', function() {
        var object = {
            extraneous: true
        };

        it( 'removes', function() {
            object = conform( {
                model: model,
                object: object
            } );

            for ( var field in model ) {
                if ( !model.hasOwnProperty( field ) ) {
                    continue;
                }

                object.should.have.property( field, model[ field ] );
            }

            object.should.not.have.property( 'extraneous' );
        } );
    } );

    describe( 'existing fields', function() {
        var object = {
            foo: true
        };

        it( 'keeps', function() {
            object = conform( {
                model: model,
                object: object
            } );

            object.should.have.property( 'foo', true );
        } );
    } );
} );

describe( 'complex objects', function() {
    var model = {
        foo: {
            bar: true,
            baz: false
        },
        array: [ 'foo', 'bar', 'baz' ],
		freeform: {
			initial: true
		},
		empty: {},
		mixed: {
			foo: true
		},
		deep: {
			deeper: {
				foo: true,
				bar: true,
			},
			unchanged: {
				foo: true,
				bar: true
			}
		}
    };

    describe( 'recursively populates', function() {
        var object = {};

        it( 'objects', function() {
            object = conform( {
                model: model,
                object: object
            } );

            for ( var field in model ) {
                if ( !model.hasOwnProperty( field ) ) {
                    continue;
                }

                object.should.have.property( field, model[ field ] );
            }
        } );
    } );

    describe( 'recursively removes', function() {
        var object = {
            foo: {
                yak: true
            }
        };

        it( 'fields', function() {
            object = conform( {
                model: model,
                object: object
            } );

            object.foo.should.not.have.property( 'yak' );
        } );
    } );

    describe( 'preserves', function() {
        var object = {
            foo: {
                bar: false,
                baz: true
            },
            array: [ 1, 2, 3 ]
        };

        object = conform( {
            model: model,
            object: object
        } );

        it( 'fields', function() {
            for ( var field in model ) {
                if ( !model.hasOwnProperty( field ) ) {
                    continue;
                }

                object.should.have.property( field );
            }
        } );

        it( 'objects', function() {
            object.foo.should.have.property( 'bar', false );
            object.foo.should.have.property( 'baz', true );
        } );

        it( 'arrays', function() {
            object.should.have.property( 'array', [ 1, 2, 3 ] );
        } );
    } );

    describe( 'copies deeply', function() {
        var object = {
            foo: {
                bar: false,
                baz: true
            },
            array: [ 1, 2, 3 ]
        };

        var foo = object.foo;
        var array = object.array;

        var newObject = conform( {
            model: model,
            object: object
        } );

        foo.bar = null;
        foo.baz = null;

        it( 'objects', function() {
            newObject.foo.should.have.property( 'bar', false );
            newObject.foo.should.have.property( 'baz', true );
        } );

        array.pop();

        it( 'arrays', function() {
            newObject.should.have.property( 'array', [ 1, 2, 3 ] );
        } );
    } );

    describe( 'converts', function() {
        var object = {
            foo: [ 1, 2, 3 ],
            array: {
                bar: false,
                baz: true
            }
        };

        object = conform( {
            model: model,
            object: object
        } );

        it( 'objects', function() {
            object.should.have.property( 'foo', model.foo );
        } );

        it( 'arrays', function() {
            object.foo.should.have.property( 'bar', model.foo.bar );
            object.foo.should.have.property( 'baz', model.foo.baz );
        } );
    } );

    describe( 'handles nested option', function() {
        var object = {
            freeform: {
                foo: true,
                bar: true
            },
			empty: {
				foo: true
			},
			mixed: {
				foo: true,
				bar: true
			},
			deep: {
				foo: true,
				deeper: {
					foo: true,
					bar: true,
					yak: true
				},
				unchanged: {
					foo: true,
					bar: true,
					yak: true
				}
			}
        };

        object = conform( {
            model: model,
            object: object,
            nested: {
                freeform: false,
				deep: {
					deeper: false
				}
            }
        } );

        it( 'freeform', function() {
            object.should.have.property( 'freeform' );
			object.freeform.should.have.property( 'initial' );
			object.freeform.should.have.property( 'foo' );
			object.freeform.should.have.property( 'bar' );
        } );

		it( 'empty', function() {
            object.should.have.property( 'empty' );
			object.empty.should.not.have.property( 'foo' );
        } );

		it( 'mixed', function() {
            object.should.have.property( 'mixed' );
			object.mixed.should.have.property( 'foo' );
			object.mixed.should.not.have.property( 'bar' );
        } );

		it( 'deep', function() {
			object.should.have.property( 'deep' );
			object.deep.should.not.have.property( 'foo' );
			object.deep.should.have.property( 'deeper' );
			object.deep.deeper.should.have.property( 'yak' );
			object.deep.should.have.property( 'unchanged' );
			object.deep.unchanged.should.not.have.property( 'yak' );
		} );
    } );
} );
