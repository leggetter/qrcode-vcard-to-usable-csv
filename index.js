var fs = require( 'fs' );

var vcf = require( 'vcf' );
var csv = require( 'csv' );

var filesToParse = 0;
var filesParsed = 0;
var vCards = [];

// Loop through files in data
var dataDir = __dirname + '/data/';
fs.readdir( dataDir, function( err, files ) {

  filesToParse = files.length;

  files.forEach( function( file ) {
    new VCardToCSV( dataDir + file, parseComplete );
  } );

} );

function parseComplete( newCards ) {
  vCards = vCards.concat( newCards );

  ++filesParsed;

  if( filesParsed === filesToParse ) {
    console.log( vCards );
    console.log( 'complete:', vCards.length );

    arrayToFormattedCSV();
  }
}

function arrayToFormattedCSV() {
  var contacts = [];
  /*
  firstname
  lastname
  email
  org
  title
  address
  tel
  */
  var contact,
      names;
  vCards.forEach( function( card ) {
    contact = [];

    names = safeGet( card, 'n' )
    if( !names ) {
      console.warn( 'ignoring card with no name', card );
    }
    else {
      names = names.split( ' ' );
      contact.push( names[ 0 ] );
      contact.push( names[ 1 ] );
      contact.push( safeGet( card, 'email' ) );
      contact.push( safeGet( card, 'org' ) );
      contact.push( safeGet( card, 'title' ) );
      contact.push( safeGet( card, 'adr' ) );
      contact.push( safeGet( card, 'tel' ) );

      contacts.push( contact );
    }
  } );

  console.log( 'found %d contacts', contacts.length )

  var joined = contacts.join( '\n' );
  console.log( joined );

  csv()
    .from( joined )
    .to( __dirname + '/results/result.csv' );

  console.log( 'really compeleted' );
}

function safeGet( card, prop ) {
  var data = '';

  try {
    data = card[ prop ].data || '';
  }
  catch( e ) { }

  data = data.replace( /([;*]|[,*])/g, ' ' ).trim();

  return data;
}

function VCardToCSV( path, callback ) {
  this.vcards = [];
  this._callback = callback;

  csv()
    .from( path.toString() )
    .on( 'record', this._handleRecord.bind( this ) )
    .on( 'end', this._finished.bind( this ) );
};

VCardToCSV.prototype._handleRecord = function( row, index ) {
  var card = vcf.parse( row[ 1 ] )
  this.vcards.push( card );
};

VCardToCSV.prototype._finished = function() {
  // console.log( this.vcards );
  this._callback( this.vcards );
};
