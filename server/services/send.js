const send = (req, res, next) => {
    res.end(JSON.stringify(req.output));
}

module.exports = send;