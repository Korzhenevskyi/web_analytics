require('dotenv').config()
var Twitter = require('twitter');
const qString = require('querystring');
const fs = require("fs");
const nodemailer = require('nodemailer');

// initializing twitter client with credentials from environment variables
const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// if we have less parameters than required - bail out with error message
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

// destructure argv passed to the process
let [ $1, $2, q, dict, reqs ] = process.argv;
reqs = Number(reqs);

// create regexp from dictionary passed to process
const dictRegExp = 
  new RegExp(`\b${ dict.split(",").join("|") }\b`, 'ig');

// validate that number of requests is in supported boundries
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

  // make requests to the twitter api
  for(let i = 0; i < reqs; i++){
    // extract desired data from response
    ({ statuses, search_metadata: { next_results } } =  
      await client.get('search/tweets', { 
        q,
        count: 100,
        max_id
      })
    );

    // fill tweets array with new tweets
    tweets.push(...statuses);
    // aquire max_id for further searches
    ({ max_id } = qString.parse(next_results.slice(1)));
  };

  // extract name, text and creation date from the tweets
  const processedTweets = tweets
    .map(({ user: { name }, text, created_at }) => ({
      name, text, created_at
    }));

  // and save it to the file
  fs.writeFileSync(`./tweets(q=${ q })_${Date.now()}`, JSON.stringify(processedTweets));

  // process dictionary
  const wordMatches = {};
  for(let i = 0; i < tweets.length; i++){
    const match = tweets[i].text.match(dictRegExp);
    // if we don`t have a regexp match, continue`
    if(!match) continue;

    for(let k = 0; k < match.length; k++){
      const word = match[ k ].toLowerCase();
      // create couner for word if it doesn`t eist already
      if(!wordMatches[ word ])
        wordMatches[ word ] = 0;
      
      // increment this counter
      wordMatches[ word ]++;
    }
  }
  // wirte results to file
  fs.writeFileSync(`./wordsOccurances(q=${ q })_${Date.now()}`, JSON.stringify(wordMatches));

  // create mail transporter using nodemailer
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_LOGIN,
      pass: process.env.GMAIL_PASS
    }
  });
  // send letter to yourself ftom yourself with occurances
  var mailOptions = {
    from: process.env.GMAIL_LOGIN,
    to: process.env.GMAIL_LOGIN,
    subject: 'Word occurances update',
    text: JSON.stringify(wordMatches)
  };
  // send mail and somewhat process its result or error
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}();