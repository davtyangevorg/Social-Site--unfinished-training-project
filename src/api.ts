import axios from 'axios'
const firebase = require('firebase/app');
require('firebase/database');

export const instance=axios.create({
    withCredentials:true,
    baseURL: 'https://social-network.samuraijs.com/api/1.0/',
    headers:{"API-KEY":"90d1c1ee-4173-4cff-bfcd-00c8125ca22f"}
})

//export instance


//---------------------------------firebase-----------------------------------------------

const firebaseConfig = {
    apiKey: "AIzaSyB1Lf4ijbmiPeHlsIh1d41qwEzMbgq-mr0",
    authDomain: "workwise-social-site.firebaseapp.com",
    databaseURL: "https://workwise-social-site.firebaseio.com",
    projectId: "workwise-social-site",
    storageBucket: "workwise-social-site.appspot.com",
    messagingSenderId: "882449144127",
    appId: "1:882449144127:web:cf70387fa297d2b253db8a"
}
const firebaseDb=firebase.initializeApp(firebaseConfig)
export default firebaseDb.database()