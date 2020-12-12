import {instance} from '../api.ts'
import {getAgainUsersProfilesThunkCreator} from './profiles-reduser.js'

const GET_SUGGESTED_USERS='social-site/home/GET_SUGGESTED_USERS'
const GET_FRIENDS='social-site/home/GET_FRIENDS'


const initalState={
    suggestedUsers:[],
    friends:[],
    isSuggestedUsersLoaded:false,
}

const homeReduser=(state=initalState,action)=>{
    switch(action.type){
        case GET_SUGGESTED_USERS:{
            return{
                ...state,
                suggestedUsers:action.users,
                isSuggestedUsersLoaded:true
            }
        }
        case GET_FRIENDS:{
            let friends=action.friends.length===0 ? ['Not Friends'] : action.friends
            return{
                ...state,
                friends:friends
            }
        }
        default:{
            return state
        }
    }
}

const getSuggestedUsers=(users)=>{
    return{
        type:GET_SUGGESTED_USERS,users:users
    }
}
const getFriends=(friends)=>{
    return{
        type:GET_FRIENDS,friends:friends
    }
}

export const getSuggestedUsersThunkCreator=()=>{
    return (dispatch)=>{
        instance.get('users?page=696&friend=false').then((res)=>{
            dispatch(getSuggestedUsers(res.data.items))
        })
    }
}
//что то нито
export const followUserThunkCreator=(userId,pageCount)=>{
    return dispatch=>{
        instance.post(`follow/${userId}`).then(res=>{
            if(res.data.resultCode===0){
                instance.get('users?page=696&friend=false').then((res)=>{
                    dispatch(getSuggestedUsers(res.data.items))
                })
                dispatch(getAgainUsersProfilesThunkCreator(pageCount))
            }
        }).catch(error=>{
            if(error.response.status===429) alert('Many requests in a short time.Server do not accept request,please try again later')
        })
    }
}
export const unfollowUserThunkCreator=(userId,pageCount)=>{
    return dispatch=>{
        instance.delete(`follow/${userId}`).then(res=>{
            if(res.data.resultCode===0){
                dispatch(getFriendsThunkCreator())
                dispatch(getAgainUsersProfilesThunkCreator(pageCount))
            }
        }).catch(error=>{
            if(error.response.status===429) alert('Many requests in a short time.Server do not accept request,please try again later')
        })
    }
}
export const getFriendsThunkCreator=()=>{
    return dispatch=>{
        instance.get('users?friend=true').then(res=>{
            dispatch(getFriends(res.data.items))
        })
    }
}
export default homeReduser