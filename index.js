'use strict';

var through2 = require('through2');
var csv2 = require('csv2');

var header_done;
var col_idx_split = 6;
var mhcs = [];

module.exports = function (stream){
  return stream.pipe(csv2()).
    pipe(through2.obj(prep)).
    pipe(through2.obj(header)).
    pipe(through2.obj(data));
};

function prep(cols,enc,callback){
  if(cols[cols.length-1] === ''){
    cols.pop();
  }
  cols = cols.map(function(c){return c.trim();});
  var header_line = '',i;
  for(i=0;i<col_idx_split;i++){
    header_line += cols[i] +',';
  }
  /*jshint validthis:true*/
  this.push({
    cols : cols,
    header : header_line
  });
  callback();
}

function header(chunk,enc,callback){
  if(header_done){
    /*jshint validthis:true*/
    this.push(chunk);
    callback();
    return;
  }
  header_done = 1;
  console.log(chunk.header + ",MHC,score");
  for(var i=col_idx_split,n=chunk.cols.length;i<n;i++){
    mhcs.push(chunk.cols[i]);
  }
  callback();
}

function data(chunk,enc,callback){
  var d_line = '',i;
  var score_i = col_idx_split;
  for(i=0;i<col_idx_split;i++){
    d_line += chunk.cols[i] +',';
  }
  for(var m=0,k=mhcs.length; m < k; m++){
    var tmp = d_line;
    tmp += mhcs[m] + ',' + chunk.cols[score_i++];
    console.log(tmp);
  }
  callback();
}
