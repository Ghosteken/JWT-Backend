require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const { r } = require('tar');
  
app.use(express.json());

let refreshTokens = [];

app.post('/token',(req, res) => {
    const refreshToken = req.body.token 
    if (refreshToken == null) return res.sendStatus(403); 
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({name:user.name})
        res.json({accessToken:accessToken})
    })
});

app.delete('/logout', (req, res)=>{
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204)
})

const posts = [
    {
        username: 'Kyle',
        title: 'Post 1',
    },{
        username: 'Jim',
        title: 'Post 2',
    }
]



app.get('/posts', (req, res) => {
    res .json(posts.filter(post => post.username === req.user.name));
    res.json(posts);
});

app.post('/Login', (req, res) => {
    //Authentication
    const username = req.body.username
    const user = { name: username}

    refreshTokens.push(refreshToken);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET )
    const accessToken = generateAccessToken(user)
    res.json({ accessToken: accessToken, refreshToken: refreshToken})
});  

// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]
    
//     if (token == null) return res.sendStatus(401)

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
//         if (err) return res.sendStatus(403)
//         req.user = user
//         next()
//     });
    
// }

function generateAccessToken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn: '15s' })//make longer in a real app
}


app.listen(4000)