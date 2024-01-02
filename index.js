var express = require('express')
var app = express()


app.get("/teste3.png", (req,res)=> {
    const script = '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=14gjhS3RU_9jcu91" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'
    res.send(script);
})

app.get("/teste2.png", (req, res) => {
    const script = '<script>alert("XSS");</script>';
    res.send(script);
});

// Basic HTTP authentication middleware
app.use((req, res, next) => {
    // If 'Authorization' header not present
    if(!req.get('Authorization')){
        var err = new Error('Not Authenticated!')
        // Set status code to '401 Unauthorized' and 'WWW-Authenticate' header to 'Basic'
        res.status(401).set('WWW-Authenticate', 'Basic')
        next(err)
    }
    // If 'Authorization' header present
    else{
        // Decode the 'Authorization' header Base64 value
        var credentials = Buffer.from(req.get('Authorization').split(' ')[1], 'base64')
        // <Buffer 75 73 65 72 6e 61 6d 65 3a 70 61 73 73 77 6f 72 64>
        .toString()
        // username:password
        .split(':')
        // ['username', 'password']

        var username = credentials[0]
        var password = credentials[1]
        
        // If credentials are not valid
        if(!(username === 'admin' && password === 'admin123')){
            var err = new Error('Not Authenticated!')
            // Set status code to '401 Unauthorized' and 'WWW-Authenticate' header to 'Basic'
            res.status(401).set('WWW-Authenticate', 'Basic')
            next(err)
        } 
        res.status(200)
        // Continue the execution
        next()
    }
})

// Endpoints
app.get('/teste.png', (req, res) => {
    res.send('Protected route with Basic HTTP Authentication!')
})

// Run the server
app.listen(8080)