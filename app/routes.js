var StockTime = require('./models/stock-time');
var Option = require('./models/option')
var Scraper = require('./scraper');

module.exports = function(app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // sample api route
    app.get('/api/stock-time', function(req, res) {
        // use mongoose to get all nerds in the database
        StockTime.find(function(err, stockTimes) {
            if (err) res.send(err);
            res.json(stockTimes); // return all nerds in JSON format
        });
    });

    app.get('/api/tickers', function(req, res) {
        Option.find().distinct('ticker', function(err, tickers) {
            res.json({
                tickers: tickers
            });
        });
    });

    app.get('/api/expiries', function(req, res) {
        Option.find(req.query).distinct('expiry', function(err, expiries) {
            res.json({
                expiries: expiries
            });
        });
    });

    app.get('/api/options', function(req, res) {
        Option.find(req.query, function(err, options) {
            res.json({
                options: options
            });
        });
    });

    app.delete('/api/options', function(req, res) {
        Option.remove(req.query).exec();
        res.json({
            message: "Scrapes Cleared"
        })
    })

    app.post('/api/scrape', function(req, res) {
        var ticker = req.body.ticker.toLowerCase();
        Option.remove({ ticker: ticker }).exec();
        Scraper.scrape(req.body.ticker, function(data) {
            data.forEach(function(opt) {
                var newOption = new Option(opt);
                newOption.save(function(err) {
                    if (err) console.log(err);
                });
            });
        });
        res.send(200);
    });

    // route to handle creating goes here (app.post)
    // route to handle delete goes here (app.delete)

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });

};;
