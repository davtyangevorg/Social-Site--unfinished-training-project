import React,{useEffect,useState,useRef} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import {useForm} from 'react-hook-form'
import './home.scss'

import {getSuggestedUsersThunkCreator,followUserThunkCreator,unfollowUserThunkCreator} from '../../redux/home-reduser.js'
import Logo from '../../img/left-logo.png'
import UserProfileImg from '../../img/user-profile.png'
import Skeleton,{SkeletonTheme} from 'react-loading-skeleton'
import {FiPlus,IoIosArrowBack,IoIosArrowForward,ImCross,FaDollarSign} from 'react-icons/all'
import Posts from './posts/post.jsx' 
import {animated,useSpring} from 'react-spring'
import firebaseDb from '../../api.ts'
import {Link} from 'react-router-dom'

const Home = () => {

    const dispatch = useDispatch()
    const isSuggestedUsersLoaded = useSelector(state => state.home.isSuggestedUsersLoaded)
    const userInfo = useSelector(state => state.auth.userInfo)
    const [isShowPostForm,setIsShowPostForm]=useState(false)
    const newProfileImage=useSelector(state=>state.profileInfo.newProfileImage)
    
    
    useEffect(() => {
        dispatch(getSuggestedUsersThunkCreator())
    }, [dispatch])
    
    const [isChangeSilderWidth,setIsChangeSilderWidth]=useState(false)
    useEffect(() => {
        if(window.innerWidth<=570){
            setIsChangeSilderWidth(true)
        }
   }, [])
    return (
        <div className='container'>
            <div className='home'>
                <div className='home_left-sidbar'>
                    <div className='welcome-box'>
                        <img alt='img'src={Logo}></img>
                        <h3>Track Time on Workwise</h3>
                        <p>Pay only for the Hours worked</p>
                    </div>
                    <div className='suggestions'>
                        <h3>Suggestions</h3>
                        <div className='line'></div>
                        <div className='suggestions_inner'>
                            {isSuggestedUsersLoaded ? <SuggestedUsers /> : <SkeletonForSuggestions />}
                        </div>
                    </div>
                </div>
                <div className='home_center-sidbar'>
                    <div className='post-job-line'></div>
                    <div className='post-job'>
                        <img alt='img' src={newProfileImage?.small||userInfo?.photos?.small||UserProfileImg}></img>
                        <button onClick={()=>{setIsShowPostForm(true)}}>Post a Job</button>
                    </div>
                    <div className='top-profiles'>
                        <h3>Top Profiles</h3>
                        <div style={{padding:'20px 20px 0 20px ',position:'relative'}}>
                            {isSuggestedUsersLoaded ? <Slider/> : isChangeSilderWidth ? <SkeletonForSliderChanged/> : <SkeletonForSlider/>}
                        </div>
                    </div>
                    <Posts userInfo={userInfo} pageName='home'/>
                </div>
                <div className='home_right-sidbar'>
                    <div className='top-jobs'>
                        <h3>Most Viewed This Week</h3>
                        <div className='line'></div>
                        {Array(3).fill().map((el,i)=>{
                            return <div key={i} className='top-jobs_inner'>
                            <div>
                                <p className='job-name'>Senior UI / UX Designer</p>
                                <p className='job-text'>Lorem ipsum dolor sit amet,<br/> consectetur adipiscing elit..</p>
                            </div>
                            <div className='job-price'>$25/hr</div>
                        </div>
                        })}
                    </div>
                </div>
                {<PostForm userInfo={userInfo} isShowPostForm={isShowPostForm} setIsShowPostForm={setIsShowPostForm}/>}
            </div>
        </div>
    )
}

export default Home



const SuggestedUsers=()=>{
    const dispatch = useDispatch()
    const suggestedUsers = useSelector(state => state.home.suggestedUsers)
    const addFriend=(id)=>{
        dispatch(followUserThunkCreator(id))
    }
    return(
        <>
            {suggestedUsers.map((user)=>{
                return <div className='suggestedUserBox'  key={user.id}>
                    <img alt='img'  src={user.photos.small||UserProfileImg}></img>
                    <div>
                        <Link style={{textDecoration:'none',color:'black'}} to={`/profile/${user.id}`}><p className='userName' >{user.name}</p></Link>
                        <p className='userJob' >Web Developer</p>
                    </div>
                    <button onClick={()=>{addFriend(user.id)}}><FiPlus size='1.1rem' /></button>
                </div>
            })}
            <Link style={{textDecoration:'none'}} to='/profiles'><div className='view-more_btn'>View More</div></Link>
        </>
    )
}

const SkeletonForSuggestions=()=>{
    return(
        <>
            {Array(10).fill().map((el,i)=>{
                return <div  key={i} style={{display:'flex',marginBottom:'25px'}}>
                    <Skeleton style={{marginRight:'10px',alignItems:'center'}} circle={true} height={35} width={35}/>
                    <Skeleton count={2} width={110} style={{marginRight:'20px'}}/>
                    <Skeleton height={30} width={30}/>
                </div>
            })}
        </>
    )
}

const Slider=()=>{
    const dispatch = useDispatch()
    const ref=useRef()
    const [silderWidth,setSilderWidth]=useState()
    const slideRef=useRef()
    const topUsers = useSelector(state => state.home.suggestedUsers)
    const [x,setX]=useState(0)
    const [isTransitionNone,setIsTransitionNone]=useState(false)
    const [isChangeSilderWidth,setIsChangeSilderWidth]=useState(false)
    useEffect(()=>{
        setIsTransitionNone(true)
        setSilderWidth(ref.current.clientWidth)
    },[silderWidth])
    useEffect(() => {
         const resize=()=>{
            setIsTransitionNone(true)
            setSilderWidth(ref.current.clientWidth)
            if(window.innerWidth<=570){
                setIsChangeSilderWidth(true)
            }else{  
                setIsChangeSilderWidth(false)
            }
         }
         window.addEventListener('resize',resize)
         return ()=>{window.removeEventListener('resize',resize)}
    }, [])
    useEffect(() => {
        if(window.innerWidth<=570) setIsChangeSilderWidth(true)
    }, [])
    const sortedForSlideTopUsers=(topUsers)=>{
        return topUsers.filter((el,i)=>{
                if(i>=topUsers.length-3) return el
                return null
            }).concat(topUsers).concat(topUsers.filter((el,i)=>{
                if(i<=2) return el
                return null
            }))
    }
    
    const goRight=()=>{
        if(isChangeSilderWidth){
            if(x<=-12*slideRef.current.clientWidth) return
            setX(x-slideRef.current.clientWidth-15)
            setIsTransitionNone(false)
        }else{
            if(x===-11*slideRef.current.clientWidth) return
            setX(x-slideRef.current.clientWidth-15)
            setIsTransitionNone(false)
        }
    }
    const goLeft=()=>{
        if(isChangeSilderWidth){
            if(x===0) return
            setX(x+slideRef.current.clientWidth+15)
            setIsTransitionNone(false)
        }else{
            if(x===3*slideRef.current.clientWidth+3*15) return
            setX(x+slideRef.current.clientWidth+15)
            setIsTransitionNone(false)
        }
    }
    const transitionEnd=()=>{
        if(isChangeSilderWidth){
            return
        }else{
            if(x===-11*slideRef.current.clientWidth){
                setIsTransitionNone(true)
                setX(0)
            }   
            if(x===3*slideRef.current.clientWidth+3*15){
                setIsTransitionNone(true)
                setX(-(8*slideRef.current.clientWidth-3*15))
            }
        }
    }

    const addFriend=(id)=>{
        dispatch(followUserThunkCreator(id))
    }
    const removeFriend=(id)=>{
        dispatch(unfollowUserThunkCreator(id))
    }
    return(
        <div ref={ref}  className='slider'>
            {sortedForSlideTopUsers(topUsers).map((user,i)=>{
                return <div ref={slideRef} onTransitionEnd={transitionEnd}
                            style={{transform:`translateX(${x-(isChangeSilderWidth ? 3*silderWidth+3*15 : silderWidth+15)}px)`,transition:`${isTransitionNone ? `none` : ``}`}} 
                            className={`slide`} key={i}>
                    <img alt='img' src={user.photos.small||UserProfileImg}></img>
                    <p className='slide_name'>{user.name}</p>
                    <p className='slide_job'>Web Developer</p>
                    {user.followed ? <button onClick={()=>{removeFriend(user.id)}} className='slide_follow_btn'>Unfollow</button> 
                                    : <button onClick={()=>{addFriend(user.id)}} className='slide_follow_btn'>Follow</button>}
                    <Link to={`/profile/${user.id}`} className='slide_view-profile_Link'>View Profile</Link>
                </div>
            })}
            <IoIosArrowBack onClick={goLeft} className='slider_arrow-back' size='2rem'/>
            <IoIosArrowForward onClick={goRight} className='slider_arrow-forward' size='2rem'/>
        </div>
    )
}
const SkeletonForSliderChanged=()=>{
    return(
        <div style={{width:'390px',marginLeft:'20px',maxWidth:'90%'}}>
            <SkeletonTheme  color='white'>
                <Skeleton height={220} width={'100%'} style={{}}/>
            </SkeletonTheme>
        </div> 
    )
}
const SkeletonForSlider=()=>{
    return(
        <div style={{display:'flex',justifyContent:'space-between',padding:'20px'}}>
            {Array(3).fill().map((el,i)=>{
                return <div key={i} >
                    <SkeletonTheme color='white'>
                        <Skeleton height={220} width={150} style={{marginRight:'20px'}}/>
                    </SkeletonTheme>
                </div>
            })}
        </div>
    )
}

const PostForm=({userInfo,isShowPostForm,setIsShowPostForm})=>{
    const [skills,setSkills]=useState(['Skill'])
    const [skillName,setSkillName]=useState()
    const skillsInputRef = useRef()
    


    const {register,handleSubmit}=useForm()
    const onSubmit=(data)=>{
        const text=isCutText(data.text)
        const post={
            userId:userInfo.userId,
            userName:userInfo.fullName,
            userImgUrl:userInfo.photos.small || 'https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png',
            skills:[...skills],
            postedDate:new Date().toISOString(),
            price:data.price,
            workTime:data.workTime,
            smallText:text.smallText,
            largeText:text.largeText,
            likeCount:0,
            likedUsers:[],
            isShowLargeText:false,
            comments:{},
            isShowComments:false
        }
        firebaseDb.ref('post').push({...post})
    }

    useEffect(() => {
        if(isShowPostForm){
            document.body.style.overflow='hidden'
            window.scrollTo(0,0)
        }
        return ()=>{document.body.style.overflow='visible'}
    })

    const deleteSkill=(skillId)=>{
        setSkills(skills.filter((skill,i)=>{
            if(i!==skillId) return skill
            return null
        }))
    }

    const postAnime=useSpring({
        transform:isShowPostForm ? 'translate(-50%,-50%) scale(1)' : 'translate(-50%,-50%) scale(0)',
    })
    const postBg=useSpring({
        display:isShowPostForm ? 'block' : 'none'
    })
    const isCutText=(text)=>{
        let smallText=null
        let largeText=null
        if(text.length>300){
          smallText=text.split('').filter((el,i)=>{
            if(i<=300) return el
            return null
          }).join('')
          largeText=text
        }else{
          smallText=text
        }
        return {
          smallText,largeText
        }
      }
    return(
        <div>
            <animated.div style={postBg} onClick={()=>{setIsShowPostForm(false)}} className='post_form_bg'></animated.div>
            <animated.div style={postAnime} className='post_form_box'>
                        <ImCross onClick={()=>{setIsShowPostForm(false)}} size='1.5rem' className='cross'/>
                        <div className='post_form_box_title'>Post a job</div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='skills-input'>
                                <div className='skills'>
                                    {skills && skills.map((skill,i)=>{
                                        return <div className='skill' key={i}>{skill}
                                            <ImCross onClick={()=>{deleteSkill(i)}} size='0.8rem'/>
                                        </div>
                                    })}
                                </div>
                                <FiPlus onClick={()=>{setSkills(skills.concat(skillName));skillsInputRef.current.value=null}} className='skill_add_btn'/>
                                <input className='skills_input' 
                                onKeyPress={(e)=>{if(e.key==='Enter'){e.preventDefault();setSkills(skills.concat(skillName));skillsInputRef.current.value=null}}} name='skills' ref={skillsInputRef}  onChange={()=>{setSkillName(skillsInputRef.current.value)}}  placeholder='Skills'></input>
                            </div>
                            <div className='priceAndWorkTime'>
                                <div>
                                    <input name='price' ref={register} className='priceInput' placeholder='Price'></input>
                                    <FaDollarSign size='2.7rem'/>
                                </div>
                                <select name='workTime' ref={register}>
                                    <option value="Full Time">Full Time</option>
                                    <option value="Half Time">Half Time</option>
                                </select>
                            </div>
                            <textarea ref={register} placeholder='Text' rows="5"  name="text"></textarea>
                            <button onClick={()=>{setIsShowPostForm(false)}}>Post</button>
                        </form>
                    </animated.div>   
        </div>
    )
}