import { ThunkAction } from 'redux-thunk'
import {ActionsType} from './store'
import {instance} from '../api'/////-------??????????????????? ts chi toxum dnem ???????????
const GET_PROFILE_INFO='social-site/profileInfo/GET_PROFILE_INFO'
const GET_NEW_PROFILE_IMG='social-site/profileInfo/GET_NEW_PROFILE_IMG'
const INVALID_MESSAGES='social-site/profileInfo/INVALID_MESSAGES'
const IS_CLOSED_CONTACTS_FORM='social-site/profileInfo/IS_CLOSED_CONTACTS_FORM'
const GET_PROFILE_STATUS='social-site/profileInfo/GET_PROFILE_STATUS'

export type StateType={
    profileInfo:null | ProfileInfoType,
    newProfileImage:null | PhotosType,
    invalidMessages:Array<string>,
    isClosedContactsForm:boolean,
    profileStatus:null | string
}
const initalState:StateType={
    profileInfo:null,
    newProfileImage:null,
    invalidMessages:[],
    isClosedContactsForm:false,
    profileStatus:null
}


const profileInfoReduser=(state=initalState,action:Actions):StateType=>{
    switch(action.type){
        case GET_PROFILE_INFO:{
            return{
                ...state,
                profileInfo:action.info,
            }
        }
        case GET_NEW_PROFILE_IMG:{
            return{
                ...state,
                newProfileImage:action.img
            }
        }
        case INVALID_MESSAGES:{
            return{
                ...state,
                invalidMessages:action.messages
            }
        }
        case IS_CLOSED_CONTACTS_FORM:{
            return{
                ...state,
                isClosedContactsForm:action.trueOrFalse
            }
        }
        case GET_PROFILE_STATUS:{
            return{
                ...state,
                profileStatus:action.status
            }
        }
        default:{
            return state
        }
    }
}

type Actions=ActionsType<typeof actions>

type ContactsType={
    facebook:string,
    github:string,
    instagram:string,
    mainLink:string,
    twitter:string,
    vk:string,
    website:string,
    youtube:string,
    [key: string]: string;
}
type PhotosType={
    small:string,
    large:string
}
export type ProfileInfoType={
    aboutMe:string,
    contacts:ContactsType,
    fullName:string,
    lookingForAJob:boolean,
    lookingForAJobDescription:string,
    photos:PhotosType,
    userId:number
}
export const actions={
    getProfileInfo:(info:ProfileInfoType)=>({type:GET_PROFILE_INFO,info:info} as const),
    getNewProfileImage:(img:PhotosType)=>({type:GET_NEW_PROFILE_IMG,img:img} as const),
    isClosedContactsFormAction:(trueOrFalse:boolean)=>({type:IS_CLOSED_CONTACTS_FORM,trueOrFalse:trueOrFalse} as const),
    getContactsFormInvalidMessages:(messages:Array<string>)=>({type:INVALID_MESSAGES,messages:messages} as const),
    getProfileStatus:(status:string)=>({type:GET_PROFILE_STATUS,status:status} as const)
}
//--------------------------------------------------------------------thunks------------------------------------------------------------
type ProfileInfoThunk=ThunkAction<void,StateType,unknown,Actions>


export const getProfileInfoThunkCreator=(profileId:number | string):ProfileInfoThunk=>{
    return (dispatch)=>{
        instance.get<ProfileInfoType>(`profile/${profileId}`).then((res)=>{
            dispatch(actions.getProfileInfo(res.data))
        })
    }
}
export const uploadProfileImgThunkCreator=(img:any):ProfileInfoThunk=>{//-----------------any
    const formData=new FormData()
    formData.append('image',img)
    return (dispatch)=>{
        instance.put(`profile/photo`,formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }).then((res)=>{
            dispatch(actions.getNewProfileImage(res.data.data.photos))
        })
    }
}

export const uploadUserContactsThunkCreator=(data:any,userInfo:any):ProfileInfoThunk=>{//----------any
    // type FormData=typeof data
    console.log(data)
    return (dispatch)=>{
        if(Object.keys(data).length===0) return dispatch(actions.getContactsFormInvalidMessages(['Not Link']))
        const sendedObject={
            lookingForAJobDescription:'Empty',
            aboutMe:'Empty',
            fullName:userInfo.fullName,
            contacts:data
        }
        instance.put('profile',sendedObject).then((res:any)=>{
            dispatch(actions.getContactsFormInvalidMessages(res.data.messages))
            if(res.data.resultCode===0){
                dispatch(actions.isClosedContactsFormAction(true))
                dispatch(getProfileInfoThunkCreator(userInfo.userId))
            }
        }).catch(()=>{
            alert('Many requests in a short time.Server do not accept request,please try again later')
        })
    }
}
export const getProfileStatusThunkCreator=(profileId:number | string):ProfileInfoThunk=>{
    return (dispatch)=>{
        instance.get(`profile/status/${profileId}`).then((res)=>{
            dispatch(actions.getProfileStatus(res.data))
        })
    }
}
type ChangeStatus={
    resultCode:number,
    messages:Array<string>,
    data:string
}
export const changeStatusThunkCreator=(status:any,userId:number):ProfileInfoThunk=>{//----------any
    return (dispatch)=>{
        instance.put<ChangeStatus>('profile/status',status).then((res)=>{
            if(res.data.resultCode===0)  dispatch(getProfileStatusThunkCreator(userId))
        })
    }
}

export default profileInfoReduser