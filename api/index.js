const Twit = require('twit'),
    Tabletop = require('tabletop'),
    GoogleSpreadsheet = require('google-spreadsheet'),
    creds = require('./client_secret.json'),
    config = require('./config'),
    jsonQuery = require('json-query'),
    helmet = require('helmet'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    bot = new Twit(config), 
    cors = require('cors'),
    express = require('express'),
    expressSanitizer = require('express-sanitizer'),
    app = express();
require('dotenv').config()

// middleware
app.use(express.json({type: 'application/json'}));
app.use(expressSanitizer());
app.use(express.urlencoded({extended: true}));
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => res.sendStatus(202))

// CORS middleware
const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
}
//figure out if the time of the post is before the most recent one



//this part is gonna post it to twitter everytime I add another entry, how else could I do this?
function runTwitter() {
    var doc = new GoogleSpreadsheet('1VYyAPj2NdOC-d_yqja1RyFMn9bie4v2STj4KFKxLglM');
    console.log("running now")
    doc.getRows(1, function(err, rows) {
        const currentRow = rows.length;
        const spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1VYyAPj2NdOC-d_yqja1RyFMn9bie4v2STj4KFKxLglM/';
        Tabletop.init({
            key: spreadsheetUrl,
            callback(data, tabletop) {
                data.forEach(d => {
                    console.log(d.activityID, currentRow);
                    //if its the most recent post
                    if(d.activityID == currentRow) {
                        ref = d;
                        //maybe check here?>
                        data.forEach(d => {
                            if(ref != d && ref.current < d.time ) {
                                const status = "Mitchell is supposed " +d.activity+ " until "+ d.time + " but he started  "+ ref.activity +" instead, so therefore loses";
                                bot.post('statuses/update', {
                                    status
                                  }, (err, response, data) => {
                                    if (err) {
                                      console.log(err)
                                    } else {
                                      console.log('Post success!')
                                    }
                                  })
                            }

                        })
                        const status = "It is currently " + d.current + " and mitchell " +d.activity+ " until "+ d.time +" this post will update if he successfully or unsuccessfuly finishes the mission";
                        bot.post('statuses/update', {
                            status
                          }, (err, response, data) => {
                            if (err) {
                              console.log(err)
                            } else {
                              console.log('Post success!')
                            }
                          })
                    }
                })
            },
            simpleSheet: true
        })
    });

}
function submitInfo(doc, activity, description, time) {
    
    doc.getRows(1, function(err, rows) {
        const currentTime = new Date()
        const day = currentTime.getDate()
        const month = currentTime.getMonth()+1
        const year = currentTime.getFullYear()
        const hour = currentTime.getHours()
        const minutes = currentTime.getMinutes()

        const nextRow = rows.length+1;
        let dateFormatted = `${year}-${month+1<10 ? '0'+month : month}-${day<10 ? '0'+day : day}`;
        let currentTimeFormatted = `${hour}:${minutes<10 ?'0'+minutes: minutes}`;
        console.log(currentTimeFormatted);

        doc.addRow(1, { activityID: nextRow, activity: activity, description: description, time: time, date: dateFormatted, current: currentTimeFormatted}, function(err) {
            if(err) {
                console.log(err);
            }
        })
    })
}

app.use(allowCrossDomain)


// routes
app.get('/', (req, res) => {
    return res.sendStatus(202).send('Okay');
});



app.post('/', (req, res) => {
    let { activity, task, time } = req.body
    var doc = new GoogleSpreadsheet('1VYyAPj2NdOC-d_yqja1RyFMn9bie4v2STj4KFKxLglM');
    doc.useServiceAccountAuth(creds, function(err) {
        doc.getRows(1, function (err, rows) {
            submitInfo(doc,activity, task, time)
        })
    })
    setTimeout(runTwitter, 1000);
    console.log(`Email: ${activity}\nTask: ${task}\nTime: ${time}`)
    res.json({success: true, data: {activity, task, time }})
});
    
app.listen(8081, () => console.log(`API listening on port 8081!\n`));