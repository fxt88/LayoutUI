import {INITIAL_STATE} from './store.js'
import dealGroupMsg from '../utils/dealGroupMsg.js'
let app = getApp()
let indexReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // IM：收到个人信息
    case 'IM_OnMyInfo':{
      return Object.assign({}, state, {
        userInfo: action.payload
      })
    }
    // 当前登录人信息
    case 'CurrentUser_Info': {
      return Object.assign({}, state, {
        currentUser: action.payload
      })
    }
    // Login：开始登陆，转菊花
    case 'Login_StartLogin': {
      return Object.assign({}, state, {
        isLogin: true
      })
    }
    // Login：登陆成功，停止转菊花
    case 'Login_LoginSuccess': {
      return Object.assign({}, state, {
        isLogin: false
      })
    }
    // 请求加载
    case 'Request_StartPost': {
      return Object.assign({}, state, {
        isPost: true
      })
    }
    // 请求加载停止
    case 'Request_EndPost': {
      return Object.assign({}, state, {
        isPost: false
      })
    }

    // CurrentChatTo：登录用户的聊天对象改变
    case 'CurrentChatTo_Change': {
      let temp = Object.assign({}, state)
      temp['currentChatTo'] = action.payload
      return Object.assign({}, state, temp)
    }
  
    // 多人通话呼叫列表
    case 'Netcall_Call_UserList': {
      let tempState = Object.assign({}, state)
      let userList = action.payload // [{account,nick,avatar}]
      tempState.netcallCallList = Object.assign([], userList)
      return Object.assign({}, state, tempState)
    }
    // 收到自定义消息，群视频呼叫标记
    case 'Netcall_Set_GroupCall': {
      let tempState = Object.assign({}, state)
      let groupCall = action.payload // {apnsText,content:{id,members,teamId,room,type},from,to}
      tempState.netcallGroupCallInfo = Object.assign({}, groupCall)
      return Object.assign({}, state, tempState)
    }
    // Reset：恢复出厂设置
    case 'Reset_All_State': {
      let tempState = Object.assign({}, state)
      let keysArr = Object.keys(tempState)
      keysArr.map(item => {
        if (Array.isArray(tempState[item])) {
          tempState[item] = []
        } else if (typeof tempState[item] === 'object') {
          tempState[item] = {}
        } else if (typeof tempState[item] === 'boolean') {
          tempState[item] = false
        } else if (typeof tempState[item] === 'string') {
          tempState[item] = ''
        }
      })
      tempState.notificationList = { system: [], custom: [] }
      return Object.assign({}, state, tempState)
    }
    default:
      return state
  }
}

export default indexReducer
