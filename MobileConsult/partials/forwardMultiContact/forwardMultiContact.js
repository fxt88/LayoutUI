import { connect } from '../../redux/index.js'
import { getPinyin } from '../../utils/pinyin.js'
import { showToast } from '../../utils/util.js'

let app = getApp()
let store = app.store

const SpecialCharBetweenAccountAndNick = '!@!'

let pageConfig = {
  data: {
    teamId: '', // 群组ID
    chooseList: [], // 用户选择列表 [{nick.account,avatar}]
    memberDetailMap: {}, // {account:{account,nick,avatar...}}
    checkedMap: {}, // {account: checked}
    chatType: 'p2p',
    defaultUserLogo: '/images/default-icon.png',
    friendCata: {},//按照类别排好序的数据 {'a': [{'account':'','nick':'',avatar:'',nickPinyin:'',accountAndNick:''}]}（如有#则在最前）
    cataHeader: [], //首字母列表(如有#则在最后)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    wx.setNavigationBarTitle({
      title: this.data.currentGroup.name,
    })
    let teamId = options.teamId
    this.setData({ teamId })
  },
  /**
   * 单击进行转发
   */
  radioChange(e) {
    let resultList = e.detail.value
    if (resultList.length > 8) {
      showToast('text', '人数已达到上线,请重选')
      return
    }
    // ["twilbeter0!@!twilbeter0", "twilbeter1!@!twilbeter1"]
    let self = this
    let chooseList = []
    let checkedMap = {}
    resultList.map(accountAndNick => {
      let account = accountAndNick.split(SpecialCharBetweenAccountAndNick)[0]
      let nick = accountAndNick.split(SpecialCharBetweenAccountAndNick)[1]
      chooseList.push({
        account,
        nick,
        avatar: self.data.memberDetailMap[account].avatar
      })
      checkedMap[account] = true
    })
    self.setData({
      checkedMap,
      chooseList
    })
  },
  cancelSelectHandler() {
    this.setData({
      checkedMap: {},
      chooseList: []
    })
  },
  confirmSelecthandler() {
    if (this.data.chooseList.length > 8) {
      showToast('text', '请确保8人以下！')
      return
    }
    store.dispatch({
      type: 'Netcall_Call_UserList',
      payload: this.data.chooseList
    })
    wx.navigateTo({
      url: '../videoCallMeeting/videoCallMeeting',
    })
  },

  deleteSelf(accountList) {
    let index = accountList.indexOf(app.globalData.nim.account)
    if (index != -1) {
      accountList.splice(index, 1)
    }
    console.log(accountList)
    return accountList
  },

  /**
   * 排序
   */
  sortPinyin(arr) {
    arr.sort((a, b) => {
      return a.nickPinyin.localeCompare(b.nickPinyin)
    })
  },
  /**
   * 检测数字
   */
  testNum(char) {
    return /^[0-9]*$/.test(char)
  }
}

let mapStateToData = (state) => {
  return {
    currentGroup: state.currentGroup,
    groupList: state.groupList,
    groupMemberList: state.groupMemberList,
  }
}
const mapDispatchToPage = (dispatch) => ({
})
let connectedPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)
Page(connectedPageConfig)
