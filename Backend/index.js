const express = require('express');
const connectToMongoDB = require('./database.js');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./Models/User.js');

connectToMongoDB();

const app = express();


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const PORT = 5000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Frontend/build')));
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'Frontend', 'build', 'index.html'));
  });
  



app.post('/login', async (req, res) => {
    console.log('recieved');
    console.log(req.body);
    let login_id = req.body.email;
    let password = req.body.password;
    try{
        let curr_user = await User.find({email:login_id , password:password});
        console.log(curr_user);
    if(curr_user.length==0){
        return res.json({'message':'invalid credentials', "bit":0});
    }
    else{return res.json({'message':'login successful' , user_1 : curr_user, bit:1});}
    }
    catch(error){
        console.error('error:', error);
        return res.json({'message':'error'});
    }
});
app.post('/sign', async(req,res)=>{
    if (!req.body.email) {
        return res.json({'message':"email must be mentioned"});
    }
    if (req.body.password.length < 5) {
        return res.json({'message': "password must be larger"});
    }

    try {
        const user_1 = await User.find({ email: req.body.email });

        if (user_1.length > 0) {
            return res.json({'message': "User already existed"});
        }

        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            age:req.body.age,
            gender:req.body.gender,
            photo:"https://th.bing.com/th/id/OIP.GHGGLYe7gDfZUzF_tElxiQHaHa?rs=1&pid=ImgDetMain0"
        });

        return res.json({'message':"user created successfully"});
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})
app.post('/photo', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            
            user.photo = req.body.photo;
            await user.save();
            console.log(user);
            res.status(200).send('Photo updated successfully');
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error updating photo:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
