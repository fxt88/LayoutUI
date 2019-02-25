import IMController from '../../controller/im.js'
import { post, validStringType, showToast, setSession, getSession } from '../../utils/util.js'
import { connect } from '../../redux/index.js'

let app = getApp()
let store = app.store
let pageConfig = {
  data: {
    UserName: '',// 用户输入账号
    Password: '',//用户输入密码
    isToken:true
  },
  onLoad() {
    this.resetStore()
  },
  onShow() {
    this.resetStore()
  },
  /**
   * 重置store数据
   */
  resetStore: function () {
    store.dispatch({
      type: 'Reset_All_State'
    })
  },
  /**
   * 用户输入事件：dataset区分输入框类别
   */
  inputHandler: function (e) {
    let temp = {}
    temp[e.currentTarget.dataset.type] = e.detail.value
    this.setData(temp)
  },
  /**
   * 执行登录逻辑
   */
  doLogin: function () {
    let errorMessage = ''
    let currentUser = {};
    let self = this
    // 校验输入
    // if (!validStringType(username, 'string-number')) {
    //   errorMessage = '账号限字母或数字'
    // }
    // if (!validStringType(nickname, 'string-number-hanzi')) {
    //   errorMessage = '昵称限汉字、字母或数字'
    // }
    // if ((password.length < 6) || !validStringType(password, 'string-number')) {
    //   errorMessage = '密码限6~20位字母或数字'
    // }
    // if (errorMessage.length > 0) {//显示错误信息
    //   showToast('error', errorMessage)
    //   return
    // }
    
    // 发送消息开始登陆
    store.dispatch({
      type: 'Login_StartLogin'
    })
    // 发送请求
    post({
       url:app.globalData.ENVIRONMENT_CONFIG.url + 'Login/Login', 
       data:self.data
      }).then(res => {
      // 更新本地视图
      store.dispatch({
        type: 'Register_RegisterSuccess'
      })
      if (res.data.data.Header.StatusCode == 0) {
        // 成功
        console.log("登陸成功")
        app.globalData.currentUser = res.data.data;
        setSession("currentUser", res.data.data);
        store.dispatch({
          type: 'CurrentUser_Info',
          payload: res.data.data
        })
        self.getNeteaseAccount();
      } else {
        // 给出本地出错提示
        store.dispatch({
          type: 'Register_RegisterSuccess'
        })
        showToast('error', '失败，请重试！')
      }
    }, err => {
      store.dispatch({
        type: 'Register_RegisterSuccess'
      })
      showToast('error', '失败，请重试！')
      console.log(err)
    })

  },
  /**
* 获取Netease账号
*/
  getNeteaseAccount: function () {
    store.dispatch({
      type: 'Request_StartPost'
    })
    post({
      url: app.globalData.ENVIRONMENT_CONFIG.url + 'Netease/GetNeteaseAccount',
      data: { _neteaseBusiness: 1 }
    }).then(res => {
      if (res.data.data.Header.StatusCode == 0) {
        // 成功
        console.log("獲取賬號成功")
        new IMController({
          token: app.globalData.currentUser.Body.UserID.toLowerCase(),
          account: res.data.data.Body.Account.toLowerCase()
        })
      } else {
        // 给出本地出错提示
        console.log(JSON.stringify(res.data.data))
        store.dispatch({
          type: 'Register_RegisterSuccess'
        })
        showToast('error', '失败，请重试！')
      }
    }, err => {
      store.dispatch({
        type: 'Register_RegisterSuccess'
      })
      showToast('error', '失败，请重试！')
    })
  }
}
let mapStateToData = (state) => {
  return {
    isLogin: state.isLogin || store.getState().isLogin
  }
}
const mapDispatchToPage = (dispatch) => ({
  loginClick: function() {
    this.doLogin()
    return
  }
})
let connectedPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)

Page(connectedPageConfig)
