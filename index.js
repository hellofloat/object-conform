'use strict';

require( 'es6-shim' );

module.exports = conform;

function conform( options ) {
    // ensure object has all fields from model
    var object = Object.assign( Array.isArray( options.model ) ? [] : {}, options.model, options.object );

    for ( var field in object ) {
        if ( !object.hasOwnProperty( field ) ) {
            continue;
        }

        if ( !options.model.hasOwnProperty( field ) ) {
            delete object[ field ];
            continue;
        }

        // ensure objects are objects
        if ( options.model[ field ] !== null &&
             typeof options.model[ field ] === 'object' &&
             !Array.isArray( options.model[ field ] ) &&
             ( object[ field ] === null || typeof object[ field ] !== 'object' ) ) {
            object[ field ] = Object.assign( {}, options.model[ field ] );
        }

        // ensure arrays are arrays
        if ( Array.isArray( options.model[ field ] ) && !Array.isArray( object[ field ] ) ) {
            object[ field ] = Object.assign( [], options.model[ field ] );
        }

        // ensure nested objects are conformed
        if ( options.model[ field ] !== null && typeof options.model[ field ] === 'object' ) {
            object[ field ] = conform( {
                object: object[ field ],
                model: options.model[ field ]
            } );
        }
    }

    return object;
}
