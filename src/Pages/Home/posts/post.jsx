import React,{useEffect,useState,useRef} from 'react'
import './post.scss'
import {useSelector} from 'react-redux'
import {MdWatchLater,FaHeart,FaCommentAlt,FaTelegramPlane} from'react-icons/all'
import firebaseDb from '../../../api.ts'
import moment from 'moment'
import {Link} from 'react-router-dom'
import Skeleton,{SkeletonTheme} from 'react-loading-skeleton'

const Post = ({userInfo,pageName}) => {
    const newProfileImage = useSelector(state => state.profileInfo.newProfileImage)
    const [posts,setPosts]=useState()
    let userId=userInfo && userInfo.userId
    useEffect(() => { 
        let mounted=true 
        firebaseDb.ref('post').on('value',snapshot=>{
            if(mounted){
                const arr=[]
                snapshot.forEach(snap=>{
                    arr.push({...snap.val(),...snap.ref.key.split()})
                })
                if(pageName==='home') setPosts(arr.reverse())   
                if(pageName==='profileInfo') setPosts(arr.reverse().filter((el)=>{
                                if(el.userId===userId) return el
                                return null
                        }))
            }
        })
        return ()=>{mounted=false}
    }, [pageName,userId])
    useEffect(() => {
        if(newProfileImage){
            posts && posts.map((el)=>{
                 if(el.userId===userId){
                    firebaseDb.ref(`post/${el[0]}`).update({userImgUrl:newProfileImage.small})
                 }
                 return null
            })
        }
    },[newProfileImage,userId,posts])
    const likedPost=(postId,likeC,userInfo,likedUsers)=>{
        if(likedUsers){
            const arr=Object.values(likedUsers)
            const deleteValueIsObject=(deletedKey)=>{
                const newUsers=arr.filter((el,i)=>{
                    if(i!==deletedKey) return el
                    return null
                })
                return newUsers
            }
            for(let i=0;i<arr.length;i++){
                if(arr[i]===userInfo.userId) return firebaseDb.ref(`post/${postId}`).update({likeCount:likeC-1,likedUsers:deleteValueIsObject(i)})
                if(arr.length===i+1) return firebaseDb.ref(`post/${postId}/likedUsers`).push(userInfo.userId)&&firebaseDb.ref(`post/${postId}`).update({likeCount:likeC+1})
            }
        }else{
            firebaseDb.ref(`post/${postId}`).update({likeCount:likeC+1})
            firebaseDb.ref(`post/${postId}/likedUsers`).push(userInfo.userId)
        }
    }
    const isLikedUser=(userId,likedUsers)=>{
        if(likedUsers){
            const arr=Object.values(likedUsers)
            for(let elem of arr){
                if(elem===userId) return true
            }
        }
        return false
    }
    return ( 
        <div className='posts'>
            {posts ? posts.map((post,i)=>{
                return <div className='post' key={i}>
                    <div className='post_info'>
                        <img alt='img' src={post.userImgUrl}></img>
                        <div>
                            <Link style={{textDecoration:'none',color:'black'}} to={`/profile/${post.userId}`}><h3>{post.userName}</h3></Link>
                            <div className='post_time'>
                                <MdWatchLater />
                                <span>{moment(new Date(post.postedDate).toISOString()).fromNow()}</span>
                            </div>
                        </div>
                    </div>
                    <p className='employment'>{post.employment}</p>
                    <div className='post_work-info'>
                        <div className='work-time'>{post.workTime}</div>
                        <div className='work-price'>${post.price} / hr</div>
                    </div>
                    <div className='post_text'>
                        {post.isShowLargeText ? <p>{post.largeText}</p> : <p>{post.smallText}</p>}
                        {post.largeText && <span onClick={()=>{firebaseDb.ref(`post/${post[0]}`).update({isShowLargeText:!post.isShowLargeText})}}>{post.isShowLargeText ? 'hide' : 'view more'}</span>}
                    </div>
                    <div className='user_skills'>
                        {post?.skills && post.skills.map((skill,i)=>{
                            return <span key={i}>{skill}</span>
                        })}
                    </div>
                    <div className='post_footer'>
                        <div className='post_like'>
                            <div onClick={()=>{likedPost(post[0],post.likeCount,userInfo,post.likedUsers)}} className='post_like_text'>
                                <FaHeart  className={isLikedUser(userInfo?.userId,post.likedUsers) ? `likedColor` : null}/>
                                <span className={isLikedUser(userInfo?.userId,post.likedUsers) ? `likedColor` : null}>Like</span>
                            </div>
                            {post.likeCount ? <span className='post_like_quantity'>{post.likeCount}</span> : null}
                        </div>
                        <div onClick={()=>{firebaseDb.ref(`post/${post[0]}`).update({isShowComments:!post.isShowComments})}} className='post_comment'>
                            <FaCommentAlt  style={post.isShowComments && {color:'#E44D3A'}}/>
                            <span style={post.isShowComments ? {color:'red'} : null}>Comment {post.comments && Object.keys(post.comments).length}</span>
                        </div>
                    </div>
                    {post.isShowComments && <div className='post_comments'>
                        <CommentInput postId={post[0]} userInfo={userInfo} userImgUrl={post.userImgUrl}/>
                        <CommentsPage comments={post.comments}/>
                    </div>}
                </div>
            }) : <SkeletonForPosts />}
        </div>
    )
}

const CommentInput=({postId,userInfo,userImgUrl})=>{
    const ref=useRef()
    const [commentInputText,setCommentInputText]=useState()
    const sendComment=()=>{
        if(commentInputText) return firebaseDb.ref(`post/${postId}/comments`).push({userId:userInfo.userId,userName:userInfo.fullName,comment:commentInputText,userImg:userInfo.photos.small || 'https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png'})
    }
    return(
        <div className='post_comments_inputAndImg'>
            <img  alt='img' src={userImgUrl}></img>
            <div className='inputDiv' >
                <input ref={ref}  onKeyPress={(e)=>{if(e.key==='Enter') {sendComment();ref.current.value=null}}} onChange={()=>{setCommentInputText(ref.current.value)}}  placeholder='Write a comment...'></input>
                <FaTelegramPlane  onClick={()=>{sendComment();ref.current.value=null}} size='1.5rem' className='post_comments_btn'/>
            </div>
        </div>
    )
}   

const CommentsPage=({comments})=>{
    const inner=comments ? Object.values(comments).map((comment,i)=>{
        return(
            <div className='comment' key={i}>
                <img src={comment.userImg} alt='img' ></img>
                <div className='comment_inner'>
                    <Link style={{textDecoration:'none',color:'black'}} to={`/profile/${comment.userId}`}><h5>{comment.userName}</h5></Link>
                    <p>{comment.comment}</p>
                </div>
            </div>
        )
    }) : null
    return(
        <>
            {inner}
        </>
    )
}
const SkeletonForPosts=()=>{
    return(
        <>
            {Array(3).fill().map((el,i)=>{
                return <div key={i}>
                    <SkeletonTheme color='white'>
                        <div style={{position:'relative'}}>
                            <Skeleton height={385} width={'100%'} style={{marginBottom:'20px'}} />
                            <SkeletonTheme  color='#F2F2F2'>
                                <div style={{position:'absolute',top:'15px',left:'15px',width:'100%',paddingRight:'45px'}}>
                                    <div style={{display:'flex',alignItems:'center',marginBottom:'20px'}}>
                                        <Skeleton height={55} width={55} circle={true} style={{marginRight:'15px'}}/>
                                        <div style={{display:'flex',flexDirection:'column'}}>
                                            <Skeleton height={10} width={150}  />
                                            <Skeleton height={10} width={110}  />
                                        </div>
                                    </div>
                                    <div style={{display:'flex',alignItems:'center',marginBottom:'30px'}}>
                                        <Skeleton height={25} width={70} style={{marginRight:'15px'}} />
                                        <Skeleton height={15} width={55}  />
                                    </div>
                                    {Array(5).fill().map((el,i)=>{
                                        return <Skeleton key={i} height={12}  style={{marginBottom:'5px'}} />
                                    })}  
                                    <Skeleton height={10} width={65} style={{marginBottom:'20px'}} />
                                    <div style={{marginBottom:'15px'}}>
                                        <Skeleton height={30} width={55} style={{borderRadius:'25px',marginRight:'10px'}} />
                                        <Skeleton height={30} width={55} style={{borderRadius:'25px',marginRight:'10px'}} />
                                        <Skeleton height={30} width={55} style={{borderRadius:'25px'}} />
                                    </div>
                                    <Skeleton height={1} width={'100%'} style={{marginBottom:'15px'}} />
                                    <div style={{display:'flex',justifyContent:'space-between'}}>
                                        <Skeleton height={15} width={'50px'} />
                                        <Skeleton height={15} width={'100px'} />
                                    </div>
                                </div>
                            </SkeletonTheme>
                        </div>
                    </SkeletonTheme>
                </div>
            })}
        </>
    )
}

export default Post