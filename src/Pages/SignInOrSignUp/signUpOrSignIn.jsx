import React,{useState} from 'react'
import {useSelector,useDispatch} from 'react-redux'
import './signUpOrSignIn.scss'
import SignLogo from '../../img/sign/sign-logo.png'
import SignImg from '../../img/sign/sign-img.png'
import {BiUser,BiLockAlt,FaFacebookF,FaTwitter} from 'react-icons/all'
import {useForm} from 'react-hook-form'
import {signInThunkCreator} from '../../redux/auth-reduser.js'
import { Redirect } from 'react-router-dom'

const SignUpOrSignIn = () => {
    const [isSignInPage,setIsSignInPage]=useState(true)
    const isAuth = useSelector(state => state.auth.isAuth)
    console.log('sign')
    return (
        <>
        {isAuth ? <Redirect to='/'/> :
            <div className='sign'>
                <div className='sign_box'>
                    <div className='cloudsTop'>
                        <div className='cloud_1'></div>
                        <div className='cloud_2'></div>    
                    </div>   
                    <div className='cloudsBottom'>
                        <div className='cloud_1'></div>
                        <div className='cloud_2'></div>    
                    </div>   
                    <div className='sign_inner'>
                        <div className='sign_inner_left'>
                            <img style={{marginLeft:'40px'}} alt='sign-logo' src={SignLogo}></img>
                            <h5>Workwise, is a global freelancing platform and social<br/> networking where businesses and independent<br/> professionals connect and collaborate remotely</h5>
                            <img alt='sign-img' src={SignImg} className='sign-img'></img>
                        </div>
                        <div className='sign_inner_right'>
                            <div className='sign_inner_right_btns'>
                                <button onClick={()=>{setIsSignInPage(true)}} className={isSignInPage ? 'btnActive' : 'btnDisable'} style={{borderTopLeftRadius:'4px',borderBottomLeftRadius:'4px'}}>Sign in</button>
                                <button onClick={()=>{setIsSignInPage(false)}} className={!isSignInPage ? 'btnActive' : 'btnDisable'} style={{borderTopRightRadius:'4px',borderBottomRightRadius:'4px'}}>Sign up</button>
                            </div>
                            {isSignInPage ? 
                            <div className='sign_inner_right_inner'>
                                <h3>Sign in</h3>
                                <div className='line'></div>
                                <SignForm />
                                <h5>LOGIN WITH SOCIAL ACCOUNT</h5>
                                <div className='social_btn'>
                                    <button style={{backgroundColor:'#3B5998',marginBottom:'20px'}}>Login With Facebook</button>
                                    <FaFacebookF style={{left:'45px'}}/>
                                </div>
                                <div className='social_btn'>
                                    <button style={{backgroundColor:'#4099FF'}}>Login With Twitter</button>
                                    <FaTwitter style={{left:'55px'}}/>
                                </div>
                            </div> :
                            <div className='sign_up'>
                                <a href='https://social-network.samuraijs.com/signUp' rel = "noopener noreferrer" target='_blank'>SIGN UP</a>
                            </div>}
                        </div>
                    </div>
                </div> 
            </div>}
        </>
    )
}

export default SignUpOrSignIn

const SignForm=()=>{
    const validateMessage = useSelector(state => state.auth.validateMessage)
    const dispatch = useDispatch()
    const {register,handleSubmit,errors}=useForm()
    
    const onSubmit=(date)=>{
        dispatch(signInThunkCreator(date))
    }

    return(
        <>  
            <form  onSubmit={handleSubmit(onSubmit)}>
                <div className='inputDiv'>
                    <input ref={register({required:true})} style={errors.email && {border:'1px solid red'}}  placeholder='Email' className={`textInput  `} name='email' type='text' />
                    <BiUser />
                    {errors.email && <span>This is required</span>}
                </div>
                <div className='inputDiv'>
                    <input ref={register({required:true})} style={errors.password && {border:'1px solid red'}} autoComplete='off' placeholder='Password' className='textInput' name='password' type='password' />
                    <BiLockAlt />
                    {errors.password && <span>This is required</span>}
                </div>
                <div className='checkboxDiv'>
                    <input ref={register} name='checkbox'  id='box' type='checkbox' />
                    <label htmlFor='box'>Remember me<span></span></label>
                </div>
                {validateMessage && <span className='validateMessage'>{validateMessage[0]}</span>}
                <button className='sign_btn'>Sign in</button>
            </form>
        </>
    )
}