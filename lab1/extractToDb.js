// module to work with sqlite database
const sqlite = require("sqlite");
// file with ftp logs loaded into memory
const log = require("fs").readFileSync('./ftp.log', 'utf-8');
// spliting string that contains whole file into array of strings, 
// using seperation by \n
const strings = log.split('\n');

!async function main(){
  // open file in current directory for database
  const db = await sqlite.open('./db.sqlite', { Promise });
  // create table for data storage
  await db.run(`CREATE TABLE IF NOT EXISTS lab1 (` +
    `ts text,` +
    `uid text,` +
    `id_orig_h text,` +
    `id_orig_p text,` +
    `id_resp_h text,` +
    `id_resp_p text,` +
    `user text,` +
    `password text,` +
    `command text,` +
    `arg text,` +
    `mime_type text,` +
    `file_size text,` +
    `reply_code text,` +
    `reply_msg text,` +
    `passive text,` +
    `orig_h text,` +
    `resp_h text,` +
    `resp_p text,` +
    `fuid text)`
  );
  // truncate it
  await db.run("DELETE FROM lab1;");
  // destructure rows of the document into corresponding variables 
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
    // fill table with extracted values
    await db.run(`insert into lab1 values(` + 
      `$ts,` + 
      `$uid,` +
      `$id_orig_h,` +
      `$id_orig_p,` +
      `$id_resp_h,` +
      `$id_resp_p,` +
      `$user,` +
      `$password,` +
      `$command,` +
      `$arg,` +
      `$mime_type,` +
      `$file_size,` +
      `$reply_code,` +
      `$reply_msg,` +
      `$passive,` +
      `$orig_h,` +
      `$resp_h,` +
      `$resp_p,` +
      `$fuid)`, 
      { 
        $ts, $uid, $id_orig_h, $id_orig_p, $id_resp_h, $id_resp_p, $user,
        $password, $command, $arg, $mime_type, $file_size, $reply_code,
        $reply_msg, $passive, $orig_h, $resp_h, $resp_p, $fuid,
      });
  }
}();