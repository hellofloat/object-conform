'use strict';

const extend = require( 'extend' );

module.exports = conform;

function conform( options ) {
    // ensure object has all fields from model
    let object = extend( true, Array.isArray( options.model ) ? [] : {}, options.model, options.object );

    for ( let field in object ) {
        if ( !object.hasOwnProperty( field ) ) {
            continue;
        }

        if ( !options.model.hasOwnProperty( field ) ) {
            delete object[ field ];
            continue;
        }

        ensureObjectsAreObjects( {
            model: options.model,
            field: field,
            object: object
        } );

        ensureArraysAreArrays( {
            model: options.model,
            field: field,
            object: object
        } );

        ensureNestedObjectsAreConformed( {
            model: options.model,
            field: field,
            object: object,
            nested: options.nested,
        } );
    }

    return object;
}

function ensureObjectsAreObjects( options ) {
    if ( options.model[ options.field ] !== null &&
         typeof options.model[ options.field ] === 'object' &&
         !Array.isArray( options.model[ options.field ] ) &&
         ( options.object[ options.field ] === null || typeof options.object[ options.field ] !== 'object' ) ) {
        options.object[ options.field ] = extend( true, {}, options.model[ options.field ] );
    }
}

function ensureArraysAreArrays( options ) {
    if ( Array.isArray( options.model[ options.field ] ) && !Array.isArray( options.object[ options.field ] ) ) {
        options.object[ options.field ] = extend( true, [], options.model[ options.field ] );
    }
}

function ensureNestedObjectsAreConformed( options ) {
    if ( options.model[ options.field ] !== null &&
         typeof options.model[ options.field ] === 'object' &&
         ( !options.nested || typeof options.nested[ options.field ] === 'undefined' || options.nested[ options.field ] ) ) {
        options.object[ options.field ] = conform( {
            object: options.object[ options.field ],
            model: options.model[ options.field ],
            nested: options.nested ? options.nested[ options.field ] : null
        } );
    }
}
