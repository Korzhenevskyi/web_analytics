require('dotenv').config()
var Twitter = require('twitter');
const qString = require('querystring');
const fs = require("fs");
const nodemailer = require('nodemailer');

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});


if(process.argv.length < 5){
  console.error('\x1b[31m');
  console.error(
`Invalid launch format. Please use like this:
    node parser.js <queryWord> <dictionaryList> <requests>
    where 
      <queryWord> is a string
      <dictionaryList> is a comma separated list of strings to search for in tweets
      <requests> is an integer between 1 and 5 showing how much requests to make
        (every request is 100 tweets)
Example:
    node parser.js javascript async,promise,callback,react,express,framework,es6 4
`
  );
  console.error('\x1b[0m');
}
let [ $1, $2, q, dict, reqs ] = process.argv;
reqs = Number(reqs);
const dictRegExp = 
  new RegExp(`\b${ dict.split(",").join("|") }\b`, 'ig');


switch(true){
  case reqs === 1:
  case reqs === 2:
  case reqs === 3:
  case reqs === 4:
  case reqs === 5:
    break;
  default:
    reqs = 1;
}

!async function(){
  const tweets = [];
  let statuses, next_results, max_id;

  for(let i = 0; i < reqs; i++){
    ({ statuses, search_metadata: { next_results } } =  
      await client.get('search/tweets', { 
        q,
        count: 100,
        max_id
      })
    );

    tweets.push(...statuses);
    ({ max_id } = qString.parse(next_results.slice(1)));
  };

  const processedTweets = tweets
    .map(({ user: { name }, text, created_at }) => ({
      name, text, created_at
    }));

  fs.writeFileSync(`./tweets(q=${ q })_${Date.now()}`, JSON.stringify(processedTweets));

  const wordMatches = {};
  for(let i = 0; i < tweets.length; i++){
    const match = tweets[i].text.match(dictRegExp);

    if(!match) continue;

    for(let k = 0; k < match.length; k++){
      const word = match[ k ].toLowerCase();

      if(!wordMatches[ word ])
        wordMatches[ word ] = 0;
      
      wordMatches[ word ]++;
    }
  }

  fs.writeFileSync(`./wordsOccurances(q=${ q })_${Date.now()}`, JSON.stringify(wordMatches));

  
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_LOGIN,
      pass: process.env.GMAIL_PASS
    }
  });

  var mailOptions = {
    from: process.env.GMAIL_LOGIN,
    to: process.env.GMAIL_LOGIN,
    subject: 'Word occurancies update',
    text: JSON.stringify(wordMatches)
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}();