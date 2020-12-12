import React,{useState,useEffect,useRef} from 'react'
import {useSelector,useDispatch} from 'react-redux'
import './header.scss'
import Logo from '../../img/logo.png'
import UserProfileImg from '../../img/user-profile.png'
import Loader from '../../img/follow-loader.svg'
import {FaSearch,FaHome,HiUsers,MdLocalPostOffice,RiArrowDownSFill,GiHamburgerMenu,RiArrowRightSFill} from 'react-icons/all'
import {signOutThunkCreator} from '../../redux/auth-reduser.js'
import {getSearchResultUsersThunkCreator} from '../../redux/profiles-reduser.js'
import {NavLink,Link} from 'react-router-dom'

const Header = () => {
    const dispatch = useDispatch()
    const userInfo = useSelector(state => state.auth.userInfo)
    const newProfileImage=useSelector(state=>state.profileInfo.newProfileImage)
    const searchedProfiles=useSelector(state=>state.profiles.searchedProfiles)
    const isSearch=useSelector(state=>state.profiles.isSearch)
    const [isShowSearchResult,setIsShowSearchResult]=useState(false)
    const [isShowMenu, setIsShowMenu] = useState(false)
    const [isShowBurger,setIsShowBurger]=useState(false)
    const [isShowHeaderMenu,setIsShowHeaderMenu]=useState(false)
    const ref = useRef()
    const searchInputRef=useRef()
    const serchRef=useRef()
    const userInfoRef = useRef()
    useEffect(() => {
       function handleResize(){
            if(window.innerWidth<=1250){
                setIsShowBurger(true)
            }else{
                setIsShowBurger(false)
            }
       }
       window.addEventListener('resize',handleResize)
       return ()=>{window.removeEventListener('resize',handleResize)}
    })
    useEffect(() => {
        if(window.innerWidth<=1250){
            setIsShowBurger(true)
        }
    }, [])
    useOnClickOutside(ref,()=>{setIsShowHeaderMenu(false)})
    useOnClickOutside(userInfoRef,()=>{setIsShowMenu(false)})
    useOnClickOutside(serchRef,()=>{setIsShowSearchResult(false)})
    const typingText=()=>{
        if(searchInputRef.current.value.length>=3){
            dispatch(getSearchResultUsersThunkCreator(searchInputRef.current.value))
            setIsShowSearchResult(true)
        }else{
            setIsShowSearchResult(false)
        }
    }
    const handleSearchInput=()=>{
        if(searchInputRef.current.value.length>=3) setIsShowSearchResult(true)
    }
    return (
        <header className='header'>
            <div className='container'>
                <div className='header_inner'>
                    <div className='logo_and_searchInput'>
                        <NavLink to='/'><img  alt='logo' src={Logo} className='logo'/></NavLink>
                        <div className='inputDiv'>
                            <input ref={searchInputRef} onClick={handleSearchInput} onChange={typingText} className='inputDiv_input' placeholder='Search... minimum length of 3 word'></input>
                            <div className='search_iconDiv'>
                                <FaSearch className='search_icon'/>
                            </div>
                            {isShowSearchResult ?
                                <div ref={serchRef} className='search_result'>
                                    { isSearch ? searchedProfiles.map((el)=>{
                                        return <div className='user' key={el.id}>
                                            <img alt='img' src={el.photos.small||UserProfileImg}></img>
                                            <div>
                                            <Link style={{textDecoration:'none',color:'black'}} to={`/profile/${el.id}`}><p className='userName' >{el.name}</p></Link>
                                            <p className='userJob' >Web Developer</p>
                                            </div>
                                        </div>
                                    }) : <img style={{height:'50px',marginLeft:'50%',transform:'translateX(-50%)'}} alt='img' src={Loader}></img>}
                                </div> : null
                            }
                        </div>
                    </div>
                    <div className='sidbar_and_user'>
                        <ul ref={ref} className={isShowHeaderMenu ? 'showHeaderMenu' : null}>
                        <NavLink onClick={()=>{setIsShowHeaderMenu(false)}}  className='navlink' to='/'><li><FaHome size='1.5rem'/><h5>Home</h5></li></NavLink>
                        <NavLink onClick={()=>{setIsShowHeaderMenu(false)}} className='navlink' to='/profiles'><li><HiUsers size='1.5rem'/><h5>Profiles</h5></li></NavLink>
                        <NavLink onClick={()=>{setIsShowHeaderMenu(false)}} className='navlink' to='/messages'><li><MdLocalPostOffice size='1.5rem'/><h5>Messages</h5></li></NavLink>
                        {isShowBurger && <div onClick={()=>{setIsShowHeaderMenu(false)}} className='arrow_rigth'><RiArrowRightSFill size='1.5rem'/></div>}
                        </ul>
                        <div  className='user_info'>
                            <Link  to={`/profile/${userInfo?.userId}`}><img  alt='img' src={newProfileImage?.small||userInfo?.photos.small || UserProfileImg}></img></Link>
                            <Link style={{textDecoration:'none'}} to={`/profile/${userInfo?.userId}`}><h5 >{userInfo?.fullName}</h5></Link>
                            <div ref={userInfoRef}>
                                <RiArrowDownSFill  onClick={()=>{setIsShowMenu(!isShowMenu)}} size='1.5rem' />
                                {isShowMenu && <div  className='user_info_menu'>
                                    <h4>Custom Status</h4>
                                    <div className='status_input'>
                                        <input />
                                        <button>Ok</button>
                                    </div>
                                    <h4>Settings</h4>
                                    <button onClick={()=>{dispatch(signOutThunkCreator())}} className='user_info_menu_signOut_btn'>Sign Out</button>
                                </div>}
                            </div>
                        </div>
                        {isShowBurger && <GiHamburgerMenu onClick={()=>{setIsShowHeaderMenu(true)}} className='burger' size='2rem'/>}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header

function useOnClickOutside(ref, handler) {
    useEffect(
      () => {
        const listener = event => {
          if (!ref.current || ref.current.contains(event.target)) {
            return;
          }
          handler(event);
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
          document.removeEventListener('mousedown', listener);
          document.removeEventListener('touchstart', listener);
        };
      },
    [ref, handler])
}
