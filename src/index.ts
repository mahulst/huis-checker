import 'pug';
const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
const app = express();

app.set('view engine', 'pug')
app.listen(3000, () => console.log('Example app listening on port 3000!'));

app.get('/', function (req, res) {
    const url = 'http://tudorgardens.nl/het-plan-22';
    request(url, function(error, response, html){
        if(!error){
            const $ = cheerio.load(html);

            const verkocht = $('g.verkocht').filter(filterAppartementen).length;
            const tekoop = $('g.tekoop').filter(filterAppartementen).length;
            const mondelingverkocht = $('g.mondelingverkocht').filter(filterAppartementen).length;
            const onderoptie = $('g.onderoptie').filter(filterAppartementen).length;
            const totaal = verkocht + mondelingverkocht + onderoptie + tekoop;
            const woningenBenodigd = Math.ceil(totaal / 100 * 70);
            res.render('index', {
                verkocht,
                tekoop,
                mondelingverkocht,
                onderoptie,
                totaal,
                woningenBenodigd
            })
        }
    })

})

function filterAppartementen(_, element) {
    const id = element.attribs.id
    const number = parseInt(id.match(/.*-(\d+)$/)[1])
    return number <= 73
}