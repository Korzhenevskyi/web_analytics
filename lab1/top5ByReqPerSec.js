// file with ftp logs loaded into memory
const log = require("fs").readFileSync('./ftp.log', 'utf-8');
// spliting string that contains whole file into array of strings, 
// using seperation by \n
const strings = log.split('\n');
// hash in the form of { userId: [ts1, ts2, ...] }
const userToTsMapping = {}, 
  // array of users and their requests per second
  userToReqPerSec = [];

!async function(){
  for(let i = 0; i < strings.length; i++){
    // destructure rows
    const [ $ts, $id_orig_h,  $id_orig_p ] = 
      strings[ i ].split("\t");
    // id of the user is `IP:port`
    const key = $id_orig_h + ":" + $id_orig_p;
    if(!userToTsMapping[ key ])
      userToTsMapping[ key ] = [];
    // fill arrays with timestamps of the operations
    userToTsMapping[ key ].push( $ts );
  }
  // calculate ops/s for users
  for(let key in userToTsMapping){
    const buf = userToTsMapping[ key ];
    userToReqPerSec.push({
      user: key,
      opsPerS: (parseInt(buf[ buf.length - 1 ]) - parseInt(buf[ 0 ])) / buf.length
    })
  }
  // log out the top 5 users by ops/s
  console.log(
    userToReqPerSec.filter(it => it.opsPerS)
    .sort((a, b) => b.opsPerS - a.opsPerS)
    .slice(0, 5)
  );
}();