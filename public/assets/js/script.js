// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyBE5N8GXwmEvotbsAgAMRTh0n1_PPxWFQw",
    authDomain: "chatapp-b65a0.firebaseapp.com",
    projectId: "chatapp-b65a0",
    storageBucket: "chatapp-b65a0.appspot.com",
    messagingSenderId: "497172611654",
    appId: "1:497172611654:web:028e404dd97e0ae34b4047",
    measurementId: "G-YJV3G38LQQ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

//Msg送信準備
const newPostRef = firebase.database();
let room = "room1";

const send = document.getElementById("send");
const username = document.getElementById("username");
const text = document.getElementById("text");
const output = document.getElementById("output")

//Msg送信処理
send.addEventListener('click', function(){
    newPostRef.ref(room).push({
        username: username.value,
        text: text.value,
        time: time()
    });
    text.value = "";
});

//Msg受信処理
newPostRef.ref(room).on("child_added",function(data){
    const v = data.val();
    const k = data.key;
    let str ="";

    str += '<div id="'+ k +'" class="msg_main">'
    str += '<div class="msg_left">'; 
    str += '<div class=""><img src="./assets/img/human2.png" alt="" class="icon '+ v.username +'" width="30"></div>';
    str += '<div class="msg">';
    str += '<div class="name">'+ v.username +'</div>';
    str += '<div class="text">'+ v.text +'</div>';
    str += '</div>';
    str += '</div>';
    str += '<div class="msg_right">';
    str += '<div class="time">'+ v.time +'</div>';
    str +='</div>';
    str +='</div>';

    output.innerHTML += str;

});

//時間を取得する関数
function time() {
    var date = new Date();
    var hh = ("0"+date.getHours()).slice(-2);
    var min = ("0"+date.getMinutes()).slice(-2);
    var sec = ("0"+date.getSeconds()).slice(-2);

    var time = hh + ":" + min + ":" + sec;
    return time;
}

//ここに音声認識の処理を書いていく
const speech = new webkitSpeechRecognition();
speech.lang = 'ja-JP';

const btn = document.getElementById('btn');
const content = document.getElementById('content');

if(btn) {
    btn.addEventListener('click' , function() {
        // 音声認識をスタート
        speech.start();
    });
}


//音声自動文字起こし機能
speech.onresult = function(e) {
    speech.stop();
    console.log('isFinal::' + e.results[0].isFinal)
    console.log('results::' + e.results[0][0].transcript)
    if(e.results[0].isFinal){
        var autotext =  e.results[0][0].transcript
        console.log(e);
        console.log(autotext);
        // content.innerHTML += '<div>'+ autotext +'</div>';
        newPostRef.ref(room).push({
            username: username.value,
            text: autotext,
            time: time()
        });
    }
}

speech.onend = () => { 
    speech.start() 
};