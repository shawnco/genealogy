const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const Location = require('./server/services/location');
const Person = require('./server/services/person');
const Tools = require('./server/services/tools');

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());
app.use(cors());
app.use(Location.router);
app.use(Person);
app.use(Tools);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.listen(process.env.PORT || 5030, () => {
    console.log('GENEALOGY MAPPER is now live');
});``