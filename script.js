// =========================
// FIFA Prediction Script
// =========================

// Change this AFTER the match is over.
const winner = "Argentina"; // "Spain" or "Argentina"

const status = document.getElementById("status");

// -------------------------
// Check Previous Vote
// -------------------------
const savedTeam = localStorage.getItem("team");

if(savedTeam){

    status.innerHTML = `
    ✅ You're supporting <b>${savedTeam}</b>
    <br><small>(Click again to change your prediction)</small>
    `;

}

// -------------------------
// Save Vote
// -------------------------

async function vote(team) {

    let userId = localStorage.getItem("userId");

    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem("userId", userId);
    }

    status.innerHTML = "⚽ Saving prediction...";

    const { data, error } = await client
    .from("votes")
    .upsert(
        {
            id: userId,
            team: team,
            notified: false
        },
        {
            onConflict: "id"
        }
    )
    .select();

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
        status.innerHTML = "❌ " + error.message;
        return;
    }

    localStorage.setItem("team", team);

    const status = document.getElementById("status");

    status.innerHTML = `
    <div class="success-message">
        <div style="font-size:50px;">⚽</div>
    
        <h2>Prediction Submitted!</h2>
    
        <p>
            You're supporting <b>${team}</b>.
            <br><br>
    
            🏆 We'll let you know who wins after the final.
            <br>
    
            ❤️ Let's hope <b>${team}</b> wins!
        </p>
    </div>
    `;

    await enableNotifications();
}

// -------------------------
// Small Celebration
// -------------------------

function celebrate(team){

    if(team==="Spain"){

        document.body.animate([

            {background:"#500"},
            {background:"#000"}

        ],{

            duration:600

        });

    }

    else{

        document.body.animate([

            {background:"#003366"},
            {background:"#000"}

        ],{

            duration:600

        });

    }

}

// ===================================================
// AFTER MATCH
// ===================================================

// Uncomment this block after the match finishes

/*
setTimeout(()=>{

    const team = localStorage.getItem("team");

    if(!team) return;

    if(team===winner){

        status.innerHTML=`
        <div style="font-size:42px;">
        🏆🎉
        </div>

        <h2>CONGRATULATIONS!</h2>

        <p>
        You predicted correctly.
        <br><br>
        ${winner} won the match!
        </p>
        `;

        document.body.style.boxShadow="inset 0 0 300px lime";

        confetti();

    }

    else{

        status.innerHTML=`
        <div style="font-size:42px;">
        😢
        </div>

        <h2>Better Luck Next Time</h2>

        <p>

        Your team fought well.

        </p>
        `;

        document.body.style.boxShadow="inset 0 0 300px crimson";

    }

},500);

*/

// -------------------------
// Simple Confetti 🎉
// -------------------------

function confetti(){

    for(let i=0;i<150;i++){

        const piece=document.createElement("div");

        piece.style.position="fixed";

        piece.style.width="8px";
        piece.style.height="8px";

        piece.style.left=Math.random()*100+"vw";

        piece.style.top="-20px";

        piece.style.borderRadius="50%";

        piece.style.background=`hsl(${Math.random()*360},100%,50%)`;

        piece.style.zIndex="9999";

        document.body.appendChild(piece);

        piece.animate([

            {
                transform:"translateY(0px) rotate(0deg)"
            },

            {
                transform:`translateY(${window.innerHeight+50}px) rotate(${Math.random()*720}deg)`
            }

        ],{

            duration:2500+Math.random()*1500,

            easing:"linear"

        });

        setTimeout(()=>piece.remove(),4000);

    }

}

// -------------------------
// Reset Button (Press R)
// -------------------------

document.addEventListener("keydown",(e)=>{

    if(e.key==="r" || e.key==="R"){

        localStorage.removeItem("team");

        location.reload();

    }

});

async function enableNotifications() {

    if (!("serviceWorker" in navigator))
        return;

    if (!("PushManager" in window))
        return;

    const permission = await Notification.requestPermission();

    if (permission !== "granted")
        return;

    const registration = await navigator.serviceWorker.register("sw.js");

    const subscription = await registration.pushManager.subscribe({

    userVisibleOnly: true,

    applicationServerKey: urlBase64ToUint8Array(
        "BJqF3Eg4GSyIOjf-tK8-naGysz_DpILSKuC1yDayHnsMusu4dkyMoA3BNuH6vUpahXQ_Lki1F3bhJHupweL7N-I"
    )

});


const sub = subscription.toJSON();

console.log(sub);


// Save subscription to Supabase

const { data, error } = await client
    .from("subscriptions")
    .insert({
        endpoint: sub.endpoint,
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth
    });


console.log("Subscription saved:", data);
console.log("Subscription error:", error);

}
function urlBase64ToUint8Array(base64String) {

    const padding = "=".repeat((4 - base64String.length % 4) % 4);

    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);

    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));

}
