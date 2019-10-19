const express = require('express');
const request = require('request-promise');
const fs = require('fs');

const app = express();
app.use(express.json());
var airNames = '';

getAirName()
    .then((data) => { 
        console.log('fim');
    })
    .catch(() => { 
        console.log('falha'); 
    });

app.listen(3000, () => {
    console.log('server in run');
});

async function getAirName() {
    var sigla = '';
    var endpoint = '';

    for (var i = 0; i < 26; i++) {
        for (var j = 0; j < 26; j++) {
            for (var z = 0; z < 26; z++) {
                sigla = getLetra(i) + getLetra(j) + getLetra(z);
                console.log(sigla);
                endpoint = 'https://www.decolar.com/suggestions?locale=pt-BR&profile=sbox-cp-vh&hint=' + sigla + '&fields=city';
                
                await request.get(endpoint, { json: true }, (err, _res, body) => {
                    if (err) {
                        return;
                    }
                    if (body.items.length == 0) {
                        return;
                    }
                    
                    var airs = body.items[0]['items'];

                    airs.forEach(air => {
                        // names.push(air.display);
                        fs.open('listAirWorld.txt', 'a', (err, fd) => {
                            if (err) throw err;
                            fs.appendFile(fd, air.display + "\n", 'utf8', (err) => {
                                fs.close(fd, (err) => {
                                    if (err) throw err;
                                });
                                if (err) throw err;
                            });
                        });
                    });
                });
            }
        }
    }
}

function getLetra(i) {
    // Define a lista de letras (A-Z)
    var chars = [];
    for (var c = 65; c < 91; c++) {
        chars.push(String.fromCharCode(c));
    }
    // Está dentro da lista de caracteres?
    if (i < chars.length) {
        return chars[i]; // Retorna a letra
    } else { // É maior que a lista de caracteres
        var j = i % chars.length;
        i = Math.floor(i / chars.length) - 1;
        return getLetra(i) + getLetra(j); // Retorna a sequencia de letras
    }
};

