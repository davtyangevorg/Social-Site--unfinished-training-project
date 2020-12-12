import React,{useEffect,useState,useRef,MutableRefObject} from 'react'
import './profileInfo.scss'
import {useDispatch, useSelector} from 'react-redux'
import {useForm} from 'react-hook-form'
import {getProfileInfoThunkCreator,uploadProfileImgThunkCreator,uploadUserContactsThunkCreator,actions,getProfileStatusThunkCreator,changeStatusThunkCreator,ProfileInfoType} from '../../redux/profileInfo-reduser'//  ?????? .ts chi toxum grem ??????
import {getFriendsThunkCreator,unfollowUserThunkCreator} from '../../redux/home-reduser.js'
import { useHistory,NavLink,Link, Switch, Route } from 'react-router-dom'
import bannerImage1 from '../../img/banners/2.png'
import bannerImage2 from '../../img/banners/3.jpg'
import UserProfile from '../../img/user-profile.png'
import SolidImg from '../../img/solid.png'
import Loader from '../../img/profiles-loader.svg'
import {FaCamera,FaPlus,ImCross,FaUsers,BsFilePost} from 'react-icons/all'
import {animated,useSpring} from 'react-spring'
import { createRef } from 'react'
import Posts from '../Home/posts/post.jsx'

import {AppDispatch,RootState} from '../../redux/store'

const ProfileInfo:React.FC = () => {
    const profileId=getUserId(useHistory().location.pathname)
    const profileInfo=useSelector((state:RootState)=>state.profileInfo.profileInfo)
    const profileStatus=useSelector((state:RootState)=>state.profileInfo.profileStatus)
    const userInfo=useSelector((state:RootState)=>state.auth.userInfo)
    const userId=userInfo.userId.toString()
    const newProfileImage = useSelector((state:RootState) => state.profileInfo.newProfileImage)
    const statusInputRef=useRef() as MutableRefObject<HTMLInputElement>
    const [isShowContactsForm,setIsShowContactsForm]=useState(false)
    const [isChangeStatus,setIsChangeStatus]=useState(false)
    const [bannerImageIndex,setBannerImageIndex]=useState(0)

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getProfileInfoThunkCreator(profileId))
        dispatch(getProfileStatusThunkCreator(profileId))
    }, [dispatch,profileId])

    const sendStatus=()=>{
            setIsChangeStatus(false)
            dispatch(changeStatusThunkCreator({status:statusInputRef.current.value},userId))
    }
    const handleUploadImg=(e:React.ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files) dispatch(uploadProfileImgThunkCreator(e.target.files[0]))
    }
    
    return (
        <div>
            <img  className='bannerImage' alt='img' src={getBannerImage(bannerImageIndex)}></img>
            <div style={{position:'relative'}} className='container'>
                <button onClick={()=>{setBannerImageIndex(bannerImageIndex===0 ? 1 : 0)}} className='banner_btn'>CHANGE IMAGE</button>
                <div className='profile-info'>
                    <div className='profile-info_user-info'>
                        <div className='user-img-div'>
                            <img className='user-profile-img' alt='img' src={newProfileImage?.small||profileInfo?.photos?.small||UserProfile}></img>
                            {userId===profileId && <label htmlFor='uploadImg'><div><FaCamera /></div></label>}
                            {userId===profileId && <input onChange={(e)=>{handleUploadImg(e)}} style={{display:'none'}} id='uploadImg' type='file'></input>}
                        </div>
                        <ProfileContacts profileInfo={profileInfo} userId={userId} profileId={profileId} setIsShowContactsForm={setIsShowContactsForm}/>
                    </div>  
                    <div className='profile-info_all-posts'>
                        <h2>{profileInfo?.fullName}</h2>
                        <div className='status'>
                            {isChangeStatus ? <div><input onKeyDown={(e)=>{if(e.key==='Enter') sendStatus()}} ref={statusInputRef} autoFocus defaultValue={profileStatus||''}></input></div> : <p>{profileStatus}</p>}
                            {userId===profileId ? isChangeStatus 
                                    ? <div>
                                        <button onClick={()=>{sendStatus()}}>Add Status</button>
                                        <button onClick={()=>{setIsChangeStatus(false)}}>Cancel</button>
                                      </div> 
                                    : <span onClick={()=>{setIsChangeStatus(true)}}>{profileStatus ? 'Change Status' : 'Add Status'}</span> : null}
                        </div>
                        
                        {userId===profileId && <div className='profileInfo_navbar'>
                            <NavLink exact to={`/profile/${userId}`} activeClassName='active' className='profileInfo_link'><BsFilePost size='2rem'/><h4>Posts</h4></NavLink>
                            <NavLink to={`/profile/${userId}/following`} activeClassName='active' className='profileInfo_link'><FaUsers size='2rem'/><h4>Following</h4></NavLink>
                        </div>}
                        {userId===profileId && <Switch>
                            <Route exact path={`/profile/${userId}`} component={() => <Posts userInfo={profileInfo} pageName='profileInfo' />}/>
                            <Route path={`/profile/${userId}/following`} component={Following}/>
                        </Switch>}
                        {userId!==profileId && <Posts userInfo={profileInfo} pageName='profileInfo' />}
                    </div>
                </div>
                
            </div>
            <ContactsForm profileInfo={profileInfo} setIsShowContactsForm={setIsShowContactsForm} isShowContactsForm={isShowContactsForm} userInfo={userInfo}/>
        </div>
    )
}
const getUserId=(path:string)=>{
    const arr=path.split('/') 
    if(arr.length===3) return arr[arr.length-1]
    return arr[arr.length-2]
}
const getBannerImage=(index:number)=>{
    const arr=[bannerImage1,bannerImage2]
    return arr[index]
}

const Following:React.FC=()=>{
    const friends=useSelector((state:RootState)=>state.home.friends)
    const dispatch:AppDispatch = useDispatch()
    useEffect(() => {
        dispatch(getFriendsThunkCreator())
    }, [dispatch])

    const removeFriend=(id:number)=>{
        dispatch(unfollowUserThunkCreator(id))
    }
    return(
        <div className='following'>
            { friends.length ? friends[0]==='Not Friends' ? <h1>{friends[0]}</h1> : friends.map((el:any)=>{
                return <div className='user' key={el.id}>
                    <img alt='img' src={el.photos.small||UserProfile}></img>
                    <Link to={`/profile/${el.id}`}>{el.name}</Link>
                    <button onClick={()=>{removeFriend(el.id)}}>Unfollow</button>
                </div>
            }) :  <img className='loader' alt='img' src={Loader}/>}
        </div>
    )
}

type ProfileContactsProps={
    profileInfo:null | ProfileInfoType,
    userId:string,
    profileId:string,
    setIsShowContactsForm:(param:boolean)=>void
}

const ProfileContacts:React.FC<ProfileContactsProps>=({profileInfo,userId,profileId,setIsShowContactsForm})=>{
    return(
        <>
            <div className='contacts'>
            {userId===profileId && <h3>Contacts</h3>}
                {profileInfo?.contacts && Object.keys(profileInfo.contacts).map(key=>{

                    return <div className='contact' key={key}>
                        {profileInfo.contacts[key] && <img alt='img' src={SolidImg}></img>}
                        <a rel="noopener noreferrer" target='_blank' href={profileInfo.contacts[key]}>{profileInfo.contacts[key]}</a>
                        {/* {profileInfo.contacts[key] && <span>...</span>} */}
                    </div>
                })}
                {userId===profileId && <div onClick={()=>{setIsShowContactsForm(true)}} title='Add Contacts' className='add-contacts-btn'><FaPlus /></div>}
            </div>
        </>
    )
}

type ContactsFormProps={
    profileInfo:null | ProfileInfoType,
    setIsShowContactsForm:(param:boolean)=>void
    isShowContactsForm:boolean
    userInfo:any
}

const ContactsForm:React.FC<ContactsFormProps>=({profileInfo,setIsShowContactsForm,isShowContactsForm,userInfo})=>{
    type FormData={
        facebook:string ,
        github:string ,
        instagram:string ,
        mainLink:string ,
        twitter:string ,
        vk:string ,
        website:string ,
        youtube:string ,
        [key: string]: string;
    }
    const {register,handleSubmit}=useForm<FormData>()
    const dispatch:AppDispatch=useDispatch()
    const invalidMessages = useSelector((state:RootState) => state.profileInfo.invalidMessages)
    const isClosedContactsForm=useSelector((state:RootState)=>state.profileInfo.isClosedContactsForm)
    useEffect(() => {
        if(isClosedContactsForm)  setIsShowContactsForm(false)
        return ()=>{dispatch(actions.isClosedContactsFormAction(false))}
    }, [isClosedContactsForm,dispatch,setIsShowContactsForm])

    useEffect(() => {
        if(isShowContactsForm){
            document.body.style.overflow='hidden'
            window.scrollTo(0,0)

        }
        return ()=>{document.body.style.overflow='visible'}
    })
    
    const onSubmit=(data:FormData)=>{
        const filter=(object:FormData,predicate:(param:string | null)=>boolean)=>{
            type NewObjectType={
                [key: string]: string
            }
            const newObject:NewObjectType={}
              Object.keys(object).map(key=>{
                if(predicate(object[key])) return newObject[key]=object[key]
                return null
              })
            return newObject
          }
        
        dispatch(uploadUserContactsThunkCreator(filter(data,(elem:string | null)=>elem!==''),userInfo))
    }
    
    const permissionChangeExistingValue=(ref:any)=>{
            const isPermission=window.confirm('Are you want to change the link?')
            if(isPermission){
                ref.current.style.display='none'
            } 
    }
    
    const formBgFade=useSpring({
        display:isShowContactsForm ? 'block' : 'none'
        
    })
    const formFade=useSpring({
        transform:isShowContactsForm ? 'translate(-50%,-50%) scale(1)' : 'translate(-50%,-50%) scale(0)',
    })
    return <>   
                <animated.div onClick={()=>{setIsShowContactsForm(false)}} style={formBgFade} className='contacts-form-bg'></animated.div>
                <animated.div style={formFade} className='contacts-form'>
                        <div className='contacts-form_title'>Add Contacts</div>
                        <form onSubmit={handleSubmit(onSubmit)} className='contacts-form_inner'>
                            {profileInfo?.contacts && Object.keys(profileInfo.contacts).map(key=>{
                                const ref=createRef<HTMLDivElement>()
                                return <div key={key}>
                                    <h3>{key}</h3>
                                    <div className='input-div'>
                                        {profileInfo.contacts[key] && <div ref={ref} onMouseDownCapture={()=>{permissionChangeExistingValue(ref)}} style={{position:'absolute',backgroundColor:'rgba(180,180,180,0.8)',width:'100%',height:'37px',borderRadius:'3px'}}></div>}
                                        <input ref={(e)=>{
                                            register(e)
                                        }} defaultValue={profileInfo.contacts[key]} name={key} placeholder='link'></input>
                                    </div>
                                </div>
                            })}
                            <div style={{display:"flex",flexDirection:'column'}}> 
                                <button>Add</button>
                                {invalidMessages && invalidMessages.map((el:string,i:number)=>{
                                    return <span key={i} className='invalid-messages'>{el}</span>
                                })}
                            </div>
                            <ImCross onClick={()=>{setIsShowContactsForm(false)}} className='cross' size='1.5rem'/>
                        </form>
                </animated.div>
            </>
}
export default ProfileInfo
