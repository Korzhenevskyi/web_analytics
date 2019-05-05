const sqlite = require("sqlite");
const log = require("fs").readFileSync('./ftp.log', 'utf-8');
const strings = log.split('\n');

!async function(){
  const db = await sqlite.open('./db.sqlite', { Promise });

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
  await db.run("DELETE FROM lab1;");

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