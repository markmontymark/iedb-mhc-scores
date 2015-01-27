'use strict';

/*global describe,it*/

var through2 = require('through2');
var assert = require('assert');
var iedbMhcScores = require('..');
var fs = require('fs');

describe('iedb-mhc-scores',function (){
  it('should denormalize lines into one line per MHC column + score',function (done){
    assert(iedbMhcScores !== null);
    iedbMhcScores(
      fs.createReadStream('test/sample.csv')
    ).pipe(through2(function(){},function(){done();})
    );
  });
});
