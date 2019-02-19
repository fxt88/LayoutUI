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
    initSearch:{//初始化页面查询
      PageSize: 20,
      PageIndex: 1,
      ConsultationID: "",
      ConsultationLevel: null,
      ConsultationType: 3,
      ApplyCustomerID: "",
      ApplyCustomerName: "",
      ApplyContacts: "",
      ApplyPhone: "",
      PatientForm: "",
      VisitDepName: "",
      BookingTime: null,
      ConsultationTarget: "",
      Creater: "",
      BeginApplyTime: null,
      EndApplyTime: null,
      State: 5
    },
    chatType: '', //聊天类型 advanced 高级群聊 normal 讨论组群聊 p2p 点对点聊天
    chatTo: '', //聊天对象account

  },
  /**
   * 执行查询会诊
   */
  getConsult: function() {
    let consultList = [];
    let consultCount=0;
    let self = this
    // 更新本地视图
    store.dispatch({
      type: 'Request_StartPost'
    })
    // 发送请求
    post({
      url: app.globalData.ENVIRONMENT_CONFIG.url + 'Consultation/SelectConsultationPageList',
      data: self.data.initSearch,
    }).then(res => {
      // 更新本地视图
      store.dispatch({
        type: 'Request_EndPost'
      })
      if (res.data.data.Header.StatusCode == 0) {
        // 成功
        self.setData({
          consultList: res.data.data.Body.PageList,
          consultCount: res.data.data.Body.TotalWaitConsultation
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

  onLoad() {
    let that = this;
    that.resetStore();
    that.getConsult();
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
  return {

  }
}
const mapDispatchToPage = (dispatch) => ({})
const nextPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)
Page(nextPageConfig)