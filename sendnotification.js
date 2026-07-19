require("dotenv").config();

const webpush = require("web-push");
const { createClient } = require("@supabase/supabase-js");


const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);


webpush.setVapidDetails(
    "mailto:test@example.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);



async function sendNotification(){

    const { data: subscriptions, error } =
        await supabase
        .from("subscriptions")
        .select("*");


    if(error){
        console.log(error);
        return;
    }


    const payload = JSON.stringify({

        title:"🏆 FIFA Prediction Result",

        body:"Congratulations! Argentina won the match 🎉"

    });


    for(const sub of subscriptions){

        const pushSubscription = {

            endpoint: sub.endpoint,

            keys:{
                p256dh: sub.p256dh,
                auth: sub.auth
            }

        };


        try{

            await webpush.sendNotification(
                pushSubscription,
                payload
            );

            console.log("Sent ✅");

        }

        catch(err){

            console.log("Failed ❌",err.message);

        }

    }

}


sendNotification();