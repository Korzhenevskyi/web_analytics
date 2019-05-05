const log = require("fs").readFileSync('./ftp.log', 'utf-8');
const strings = log.split('\n');

const userToTsMapping = {}, userToReqPerSec = [];

!async function(){
  for(let i = 0; i < strings.length; i++){
    const [
      $ts,
      $uid,
      $id_orig_h,
      $id_orig_p,
      $id_resp_h,
      $id_resp_p,
      $user,
      $password,
      $command,
      $arg,
      $mime_type,
      $file_size,
      $reply_code,
      $reply_msg,
      $passive,
      $orig_h,
      $resp_h,
      $resp_p,
      $fuid,
    ] = strings[ i ].split("\t");
    
    const key = $id_orig_h + ":" + $id_orig_p;
    if(!userToTsMapping[ key ])
      userToTsMapping[ key ] = [];

    userToTsMapping[ key ].push( $ts );
  }

  for(let key in userToTsMapping){
    const buf = userToTsMapping[ key ];
    userToReqPerSec.push({
      user: key,
      opsPerS: (parseInt(buf[ buf.length - 1 ]) - parseInt(buf[ 0 ])) / buf.length
    })
  }

  console.log(
    userToReqPerSec.filter(it => it.opsPerS)
    .sort((a, b) => b.opsPerS - a.opsPerS)
    .slice(0, 5)
  );
}();