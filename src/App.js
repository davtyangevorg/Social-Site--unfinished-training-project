import React, { Fragment,useEffect } from 'react'
import {useSelector,useDispatch} from 'react-redux'
import './App.css';

import Header from './components/Header/header.jsx'
import Footer from './components/Footer/footer.jsx'

import Home from './Pages/Home/home.jsx'
import Profiles from './Pages/Profiles/profiles.jsx'
import ProfileInfo from './Pages/ProfileInfo/profileInfo.tsx'
import Messages from './Pages/Messages/messages.tsx'
import SignUpOrSignIn from './Pages/SignInOrSignUp/signUpOrSignIn.jsx'

import { Route, Switch } from 'react-router-dom';
import {getUserProfileInfoThunkCreator} from './redux/auth-reduser.js'


function App() {
  console.log('app')
  const isAuth = useSelector(state => state.auth.isAuth)
  const userId=useSelector(state=>state.auth.userId)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getUserProfileInfoThunkCreator(userId))
  })
  return (
    <div className="App"> 
      {isAuth ? <SectionPage /> : <SignUpOrSignIn />} 
      <Footer />
    </div>
  );
}

export default App;

const SectionPage=()=>{
  return(
    <Fragment>
      <Header />
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route path='/profiles' component={Profiles}/>
        <Route path='/profile/:userId' component={ProfileInfo}/>
        <Route path='/messages' component={Messages}/>
      </Switch>
    </Fragment>
  )
}
