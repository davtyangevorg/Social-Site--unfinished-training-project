import thunk from 'redux-thunk'
import {combineReducers, createStore,applyMiddleware} from 'redux'

import authReduser from './auth-reduser.js'
import homeReduser from './home-reduser.js'
import profilesReduser from './profiles-reduser.js'
import profileInfoReduser from './profileInfo-reduser' //  ?????? .ts chi toxum grem ??????

const redusers=combineReducers({
    auth:authReduser,
    home:homeReduser,
    profiles:profilesReduser,
    profileInfo:profileInfoReduser
})

const store=createStore(redusers,applyMiddleware(thunk))

export type RootState=ReturnType<typeof redusers>
export type AppDispatch = typeof store.dispatch

type PropertiesType<T> = T extends {[key:string]:infer U} ? U : never
export type ActionsType<T extends {[key:string]:(...args:any[])=>any}> = ReturnType<PropertiesType<T>>

export default store