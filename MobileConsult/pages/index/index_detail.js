import IMController from '../../controller/im.js'
import {
  post,
  validStringType,
  showToast,
  updateMultiPortStatus
} from '../../utils/util.js'
import {
  connect
} from '../../redux/index.js'
const app = getApp()
let store = app.store

const pageConfig = {
  data: {
    remind: '加载中',
    detail: {},   //会诊详情
    state: [] ,    //处理状态(申请-审核-接受-完成-驳回.退回)
    chatType: '', //聊天类型 advanced 高级群聊 normal 讨论组群聊 p2p 点对点聊天
    chatTo: '', //聊天对象account
  },

  /**
   * 执行查询会诊详情
   */
  getConsultDetail: function () {
    let consultInfo = {};
    let self = this;
    if (!self.data.consultID) {
      self.setData({
        remind: '404'
      });
      return false;
    }
    // 发送请求
    post({
      url: app.globalData.ENVIRONMENT_CONFIG.url + 'Consultation/SelectConsultationDetail',
      data: { ConsultationID: self.data.consultID },
    }).then(res => {
      if (res.data.data.Header.StatusCode == 0) {
        // 成功
        self.setData({
          consultInfo: res.data.data.Body,
          remind: ''
        })
      } else {
        // 给出本地出错提示
        self.setData({
          errorMessage: res.data.data.Header.Message || '未知错误'
        })
      }
    }, err => {
      store.dispatch({
        type: 'Register_RegisterSuccess'
      })
      showToast('error', '失败，请重试！')
    })
  },

  /**
 * 获取Netease账号
 */
  GetNeteaseAccount: function () {
    store.dispatch({
      type: 'Request_StartPost'
    })
    post({
      url: app.globalData.ENVIRONMENT_CONFIG.url + 'Netease/GetNeteaseAccount',
      data: { _neteaseBusiness: 1 }
    }).then(res => {
      // 更新本地视图
      store.dispatch({
        type: 'Request_EndPost'
      })
      if (res.data.data.Header.StatusCode == 0) {
        // 成功
        new IMController({
          token: app.globalData.currentUser.Body.UserID.toLowerCase(),
          account: res.data.data.Body.Account.toLowerCase()
        })
      } else {
        // 给出本地出错提示
        self.setData({
          errorMessage: res.data.data.Header.Message
        })
      }
    }, err => {
      store.dispatch({
        type: 'Register_RegisterSuccess'
      })
      showToast('error', '失败，请重试！')
    })
  },

  /**
 * 视频通话
 */
  videoCall: function (event) {
    // this.setData({
    //   chatTo,
    //   chatType
    // })
    // if (this.data.chatType === 'advanced' || this.data.chatType === 'normal') { // 群组
    //   if (this.data.currentGroup.memberNum.length < 2) {
    //     showToast('text', '无法发起，人数少于2人')
    //   } else {
    //     wx.navigateTo({
    //       url: `../forwardMultiContact/forwardMultiContact?teamId=${this.data.currentGroup.teamId}`,
    //     })
    //   }
    // } else { // p2p
    //   console.log(`正在发起对${this.data.chatTo}的视频通话`)
    //   wx.navigateTo({
    //     url: `../videoCall/videoCall?callee=${this.data.chatTo}`,
    //   })
    // }
    wx.navigateTo({
      url: `../../partials/videoCallMeeting/videoCallMeeting`,
    })
  },

  onLoad: function (options) {
    this.setData({
      consultID: options.id
    });
    this.getConsultDetail();
    this.GetNeteaseAccount();
  },

  onShow: function onShow() {
    let that = this;
    that.resetStore();
  },

  /**
   * 重置store数据
   */
  resetStore: function resetStore() {
    store.dispatch({
      type: 'Reset_All_State'
    });
  },
}

const mapStateToData = (state) => {
  return { }
  }
const mapDispatchToPage = (dispatch) => ({})
const nextPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)
Page(nextPageConfig)