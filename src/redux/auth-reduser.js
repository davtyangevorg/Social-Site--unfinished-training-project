import {instance} from '../api.ts'
const IS_AUTH='social-site/auth/IS_AUTH'
const GET_VALID_MEESAGE='social-site/auth/GET_VALID_MEESAGE'
const SIGN_OUT='social-site/auth/SIGN_OUT'
const GET_USER_PROFILE_INFO='socila-site/auth/GET_USER_PROFILE_INFO'

const initalState={
    isAuth:false,
    validateMessage:null,
    userInfo:null,
    userId:null
}

const authReduser=(state=initalState,action)=>{
    switch(action.type){
        case IS_AUTH:{
            return{
                ...state,
                isAuth:true,
                userId:action.id
            }
        }
        case SIGN_OUT:{
            return{
                ...state,
                isAuth:false
            }
        }
        case GET_VALID_MEESAGE:{
            return{
                ...state,
                validateMessage:action.message
            }
        } 
        case GET_USER_PROFILE_INFO:{
            return{
                ...state,
                userInfo:action.userInfo
            }
        }
        default:{
          return state
        }
    }
}

export const isAuthActionCreator=(id)=>{
    return{
        type:IS_AUTH,id:id
    }
}
export const getUserProfileInfo=(data)=>{
    return{
        type:GET_USER_PROFILE_INFO,userInfo:data
    }
}
const getValidateMessagesActionCreator=(message)=>{
    return{
        type:GET_VALID_MEESAGE,message:message
    }
}
const signOutActionCreator=()=>{
    return{
        type:SIGN_OUT
    }
}
export const getIsAuthThunkCreator=()=>{
    return dispatch=>{
        instance.get('auth/me').then((res)=>{
            if(res.data.resultCode===0) {
                dispatch(isAuthActionCreator(res.data.data.id))
            }
        })
    }
}

export const signOutThunkCreator=()=>{
    return dispatch=>{
        instance.delete('/auth/login').then((res)=>{
            if(res.data.resultCode===0){
               dispatch(signOutActionCreator())
            }
        })
    }
}

export const signInThunkCreator=(formData)=>{
    return dispatch=>{
        instance.post('auth/login',formData).then((res)=>{
            if(res.data.resultCode===0){
                dispatch(getIsAuthThunkCreator())
            }
            dispatch(getValidateMessagesActionCreator(res.data.messages))
        })
    }
}

export const getUserProfileInfoThunkCreator=(id)=>{
    return (dispatch)=>{
        id && instance.get(`profile/${id}`).then((res)=>{
            dispatch(getUserProfileInfo(res.data))
        })
    }
}

export default authReduser