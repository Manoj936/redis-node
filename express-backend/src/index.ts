import express from "express";
import { createClient } from "redis";

const app = express();

app.use(express.json());

const client = createClient();
const notificationEventKey : string = 'notifications';
const PORT = 3000
const startServer = async () => {
  try {
    await client.connect();
    console.log('Connected to the client');

    app.listen(PORT , ()=>{
        console.log(`APP IS RUNNING ON PORT ${PORT} :-)`)
    })
  } catch (e) {
    console.log(e || "Error in creating server");
  }
};



//process the payload and publish the notification to the redis queue
let NotificationHandler = async(req : any ,res :any)=>{
 try{
    const {userId , userName , email , emailBody , subject} = req.body;
    console.log( req.body);

    if(!userId || !userName ||  !email || !emailBody || !subject){
        return res.status(400).send('One or more payload expected')
    }
    await client.lPush(notificationEventKey , JSON.stringify({userId , userName , email , emailBody , subject}))
    res.status(200).send('Successfully added operations to the queue')
 }
 catch(e){
    console.log(e || "Error in processing");
 }
}


//api endpoint for processing notifications
app.post('/processNotification' , NotificationHandler)




startServer();
