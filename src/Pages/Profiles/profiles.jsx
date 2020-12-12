import React,{useEffect,useState} from 'react'
import './profiles.scss'
import {useDispatch,useSelector} from 'react-redux'
import UserProfile from '../../img/user-profile.png'
import {getUsersProfilesThunkCreator} from '../../redux/profiles-reduser.js'
import {followUserThunkCreator,unfollowUserThunkCreator} from '../../redux/home-reduser.js'
import {MdLocalPostOffice} from 'react-icons/md'
import ProfilesLoader from '../../img/profiles-loader.svg'
import {Link} from 'react-router-dom'

const Profiles = () => {
    const dispatch = useDispatch()
    const profiles = useSelector(state => state.profiles.profiles)
    const isLoad=useSelector(state=>state.profiles.isLoad)
    const [pageCount,setPageCurrent]=useState(1)
    useEffect(()=>{
        window.scrollTo(0,0)
    },[])
    useEffect(() => {
        dispatch(getUsersProfilesThunkCreator(pageCount))
    },[dispatch,pageCount])
    
    const addFriend=(id)=>{
        dispatch(followUserThunkCreator(id,pageCount))
    }
    const removeFriend=(id)=>{
        dispatch(unfollowUserThunkCreator(id,pageCount))
    }
    //console.log(profiles)
    return (
        <div className='container'>
            <div className='profiles'>
                <div  className='profiles_title'>All Profiles</div>
                <div className='profiles_inner'>
                    {profiles.map(el=>{
                        return <div className='profile' key={el.id}>
                            <img alt='img' src={el.photos.small||UserProfile}></img>
                            <h4>{el.name}</h4>
                            <p>Graphic Designer</p>
                            <div>
                                {el.followed ? <button onClick={()=>{removeFriend(el.id)}} className='follow_btn'>Unfollow</button> 
                                            : <button onClick={()=>{addFriend(el.id)}} className='follow_btn'>Follow</button>}
                                <button className='message_btn'><MdLocalPostOffice size='2rem'/></button>
                            </div>
                            <Link to={`/profile/${el.id}`}><button className='view-more_btn'>View Profile</button></Link>
                        </div>
                    })}
                </div>
                {isLoad ? <img className='profiles_loader' alt='img' src={ProfilesLoader}></img> : <button onClick={()=>{setPageCurrent(pageCount+1)}} className='profiles_see-more_btn'>See More</button>}
            </div>
        </div>
    )
}

export default Profiles
