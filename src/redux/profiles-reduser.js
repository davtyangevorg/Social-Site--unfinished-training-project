import {instance} from '../api.ts'
const GET_USERS_PROFILE='social-site/profiles/GET_USERS_PROFILE'
const SET_IS_LOAD='social-site/profiles/SET_IS_LOAD'
const GET_MORE_USERS='social-site/profiles/GET_MORE_USERS'
const GET_SEARCHED_PROFILES='social-site/profiles/GET_SEARCHED_PROFILES'

const initalState={
    profiles:[],
    searchedProfiles:[],
    isLoad:false,
    isSearch:false
}

const profilesReduser=(state=initalState,action)=>{
    switch(action.type){
        case GET_USERS_PROFILE:{
            return{
                ...state,
                profiles:action.profiles
            }
        }
        case GET_MORE_USERS:{
            return{
                ...state,
                profiles:state.profiles.concat(action.profiles)
            }
        }
        case SET_IS_LOAD:{
            return{
                ...state,
                isLoad:action.newValue
            }
        }
        case GET_SEARCHED_PROFILES:{
            return{
                ...state,
                searchedProfiles:action.profiles,
                isSearch:true
            }
        }
        default:{
            return state
        }
    }
}
export default profilesReduser

const getUsersProfiles=(profiles)=>{
    return{
        type:GET_USERS_PROFILE,profiles:profiles
    }
}
const getMoreUsers=(profiles)=>{
    return{
        type:GET_MORE_USERS,profiles:profiles
    }
}
const setIsLoad=(newValue)=>{
    return{
        type:SET_IS_LOAD,newValue:newValue
    }
}
const getSearchedProfiles=(profiles)=>{
    return{
        type:GET_SEARCHED_PROFILES,profiles:profiles
    }
}


export const getUsersProfilesThunkCreator=(pageCount)=>{
    return dispatch=>{
        dispatch(setIsLoad(true))
        instance.get(`users?page=${pageCount}&count=12`).then(res=>{
            dispatch(setIsLoad(false))
            if(pageCount===1) return dispatch(getUsersProfiles(res.data.items))
            dispatch(getMoreUsers(res.data.items))
        })
    }
}   
export const getAgainUsersProfilesThunkCreator=(pageCount)=>{
    return dispatch=>{
        instance.get(`users?page=${pageCount}&count=12`).then(res=>{
            dispatch(getUsersProfiles(res.data.items))
        })
    }
}
export const getSearchResultUsersThunkCreator=(term)=>{
    return dispatch=>{
        instance.get(`users?term=${term}`).then(res=>{
            console.log(res)
            dispatch(getSearchedProfiles(res.data.items))
        })
    }
}
