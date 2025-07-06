<template>
  <div class="myGoodsInfo">
    <h1>商品信息</h1>
    <div style="height:20px">
      <a-button style="float: right;margin: -15px 80px 10px 0" @click="showAddGoodsInfoModal"><plus-outlined />新增商品信息</a-button>
    </div>
    <a-collapse v-model:activeKey="activeKey" accordion expand-icon-position="right"
                style="width: 800px;margin: 0px auto; text-align: left;height: 500px;overflow: scroll">
        <a-collapse-panel  v-for="(goodsInfoVO,goodsInfoIndex) in goodsInfoVOList" :key="goodsInfoVO.goodsId">
          <template #header>
            <div style="overflow: hidden">
              <img :src="goodsInfoVO.goodsImgDataString" style="width: 100px;float: left" alt="" >
              <div style="float:left;padding-left: 20px;">
                <p>{{goodsInfoVO.goodsIntroduction}}</p>
                <p><del>${{(goodsInfoVO.goodsPrice*1.1).toFixed(2)}}</del> ${{goodsInfoVO.goodsPrice.toFixed(2)}}</p>
              </div>
              <div style="float:right;">
                <a-button @click.stop="editGoodsInfo(goodsInfoIndex)" style="margin: 10px">修改商品信息</a-button>
                <a-button @click.stop="showAddGoodsDetailedInfo(goodsInfoIndex)" style="margin: 10px">新增详细商品信息</a-button>
              </div>
            </div>
          </template>
          <div style="overflow: hidden" v-if="goodsInfoVO.goodsDetailedInfoVOList!==null">
            <div v-for="(goodsDetailedInfoVO,goodsDetailedInfoIndex) in goodsInfoVO.goodsDetailedInfoVOList" :key="goodsDetailedInfoVO.goodsDetailedId">
              <img :src="goodsDetailedInfoVO.goodsDetailedImgSmallDataString" alt="" >
              <span>{{goodsDetailedInfoVO.goodsDetailedTitle}}</span>
              <div style="float:right;">
                <a-button @click.stop="editGoodsDetailedInfo(goodsInfoIndex,goodsDetailedInfoIndex)" style="margin: 10px">修改详细商品信息</a-button>
              </div>
            </div>
          </div>
        </a-collapse-panel>
    </a-collapse>
    <a-pagination v-model:current="pagination.current"
                  v-model:pageSize="pagination.pageSize"
                  :show-total="total => `共 ${total} 条数据`"
                  :total="pagination.total" show-less-items @change="changePage"/>
  </div>
  <a-modal v-model:visible="goodsInfoVisible" title="新增商品信息">
    <template #footer>
      <a-button @click="goodsInfoVisible = false">取消</a-button>
      <a-button type="primary" @click="submitGoodsInfo">提交</a-button>
    </template>
    <a-form :model="goodsInfoVOForm" :rules="rulesGoodsInfoVO" ref="modalGoodsInfoVOFormRef"
            style="width: 400px; margin: auto auto">
      <a-form-item label="商品标题" name="goodsTitle">
        <a-input v-model:value="goodsInfoVOForm.goodsTitle" placeholder="请输入商品标题"/>
      </a-form-item>
      <a-form-item label="商品介绍" name="goodsIntroduction">
        <a-textarea v-model:value="goodsInfoVOForm.goodsIntroduction" placeholder="请输入商品介绍"/>
      </a-form-item>
      <a-form-item label="商品价格" name="goodsPrice">
        <a-input-number v-model:value="goodsInfoVOForm.goodsPrice" placeholder="请输入商品价格" style="width: 150px" :min="0.01" :step="0.01"/>
        <a-button type="primary" style="margin-left: 20px" @click="goodsInfoVOForm.goodsPrice = 0.01">重置</a-button>
      </a-form-item>
      <a-form-item label="商品分类" name="goodsCategoryId">
        <a-select v-model:value="goodsInfoVOForm.goodsCategoryId" style="width: 150px" placeholder="请选择商品分类">
          <a-select-option v-for="goodsCategoryInfo in goodsCategoryInfoVOList"
                           v-bind:key='goodsCategoryInfo.goodsCategoryId'
                           :value="goodsCategoryInfo.goodsCategoryId">
            {{goodsCategoryInfo.goodsCategoryName}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="商品图片" style="height: 80px" :rules="[{ required: true }]">
        <a-upload :file-list="fileList" :before-upload="beforeUpload"  list-type="picture">
          <a-button >
            <upload-outlined></upload-outlined>
            上传图片
          </a-button>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>

  <a-modal v-model:visible="goodsDetailedInfoVisible" title="新增商品详细信息">
    <template #footer>
      <a-button @click="goodsDetailedInfoVisible = false">取消</a-button>
      <a-button type="primary" @click="submitGoodsDetailedInfo">提交</a-button>
    </template>
    <a-form :model="goodsDetailedInfoVOForm" :rules="rulesGoodsDetailedInfoVO" ref="modalGoodsDetailedInfoVOFormRef"
            style="width: 400px; margin: auto auto">
      <a-form-item label="商品标题" name="goodsDetailedTitle">
        <a-input v-model:value="goodsDetailedInfoVOForm.goodsDetailedTitle" placeholder="请填写商品标题"/>
      </a-form-item>
      <a-form-item label="商品价格" name="goodsDetailedPrice">
        <a-input-number v-model:value="goodsDetailedInfoVOForm.goodsDetailedPrice" style="width: 150px" :min="0.01" :step="0.01" placeholder="请填写商品价格"/>
        <a-button type="primary" style="margin-left: 20px" @click="goodsInfoVOForm.goodsDetailedPrice = 0.01">重置</a-button>
      </a-form-item>
      <a-form-item label="商品库存" name="goodsDetailedQuantity">
        <a-input-number v-model:value="goodsDetailedInfoVOForm.goodsDetailedQuantity" style="width: 150px" :min="1" :step="1" placeholder="请填写商品库存"/>
        <a-button type="primary" style="margin-left: 20px" @click="goodsDetailedInfoVOForm.goodsDetailedQuantity = 1">重置</a-button>
      </a-form-item>
      <a-form-item label="商品图片" style="height: 80px" :rules="[{ required: true }]">
        <a-upload :file-list="fileList" :before-upload="beforeUpload" list-type="picture">
          <a-button >
            <upload-outlined></upload-outlined>
            上传图片
          </a-button>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { PlusOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { defineComponent, ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import {
  getGoodsInfoVOListCountByUserId,
  getGoodsInfoVOListByUserId,
  getGoodsDetailVOListByGoodsId,
  getGoodsCategoryInfoVOList,
  saveGoodsInfo,
  updateGoodsInfoByGoodsId,
  updateGoodsDetailedInfoByGoodsDetailedId,
  saveGoodsDetailedInfo
} from '@/api/goods'
import { tranFileToBytes } from '@/api/common'
export default defineComponent({
  emits: ['initMenu'],
  components: {
    PlusOutlined,
    UploadOutlined
  },
  setup () {
    const modalGoodsInfoVOFormRef = ref([])
    const modalGoodsDetailedInfoVOFormRef = ref([])
    const activeKey = ref([])
    const goodsInfoVOList = ref([])
    const goodsCategoryInfoVOList = ref([])
    const fileList = ref([])
    const goodsInfoVisible = ref(false)
    const goodsDetailedInfoVisible = ref(false)
    const modalFlag = ref()
    const goodsIndex = ref()
    const goodsDetailedIndex = ref()
    const userInfo = reactive({})
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      total: 0
    })
    const goodsInfoVOFormInit = reactive({
      goodsId: undefined,
      userId: undefined,
      goodsTitle: undefined,
      goodsIntroduction: undefined,
      goodsSalesVolumes: undefined,
      goodsCategoryId: undefined,
      goodsPrice: undefined,
      goodsRate: undefined,
      goodsImgData: undefined
    })
    const goodsInfoVOForm = reactive({})
    const goodsDetailedInfoVOFormInit = reactive({
      goodsDetailedId: undefined,
      goodsId: undefined,
      goodsDetailedTitle: undefined,
      goodsDetailedQuantity: undefined,
      goodsDetailedUnit: undefined,
      goodsDetailedPrice: undefined,
      goodsDetailedImgData: undefined,
      goodsDetailedImgSmallData: undefined
    })
    const goodsDetailedInfoVOForm = reactive({})
    const rulesGoodsInfoVO = reactive({
      goodsTitle: [{
        required: true,
        message: '请输入商品标题',
        trigger: 'blur'
      }, {
        min: 2,
        message: '商品标题不少于2个字',
        trigger: 'blur'
      }],
      goodsCategoryId: [{
        required: true,
        message: '请选择商品分类',
        trigger: 'blur'
      }],
      goodsPrice: [{
        required: true,
        message: '请选择商品价格',
        trigger: 'blur'
      }],
      goodsIntroduction: [{
        required: true,
        message: '请输入商品描述',
        trigger: 'blur'
      }, {
        min: 2,
        message: '商品描述不少于2个字',
        trigger: 'blur'
      }]
    })
    const rulesGoodsDetailedInfoVO = reactive({
      goodsDetailedTitle: [{
        required: true,
        message: '请输入商品标题',
        trigger: 'blur'
      }, {
        min: 2,
        message: '商品标题不少于2个字',
        trigger: 'blur'
      }],
      goodsDetailedPrice: [{
        required: true,
        message: '请填写商品价格',
        trigger: 'blur'
      }],
      goodsDetailedQuantity: [{
        required: true,
        message: '请填写商品库存量',
        trigger: 'blur'
      }]
    })
    const initData = async () => {
      Object.assign(goodsInfoVOForm, goodsInfoVOFormInit)
      Object.assign(goodsDetailedInfoVOForm, goodsDetailedInfoVOFormInit)
      await getGoodsCategoryInfoVOList().then(res => {
        goodsCategoryInfoVOList.value = res
      })
      Object.assign(userInfo, JSON.parse(window.sessionStorage.getItem('userInfo')))
      await getGoodsInfoVOListCountByUserId({ userId: userInfo.userId }).then(res => {
        pagination.total = res
      })
      await getGoodsInfoVOListByUserId({ userId: userInfo.userId, current: pagination.current, pageSize: pagination.pageSize }).then(res => {
        goodsInfoVOList.value = res.map((item) => {
          item.goodsImgDataString = 'data:image/png;base64,' + item.goodsImgData
          getGoodsDetailVOListByGoodsId({ goodsId: item.goodsId }).then(res1 => {
            if (res1 == null) {
              item.goodsDetailedInfoVOList = []
            } else {
              item.goodsDetailedInfoVOList = res1.map((item1) => {
                item1.goodsDetailedImgSmallDataString = 'data:image/png;base64,' + item1.goodsDetailedImgSmallData
                return item1
              })
            }
          })
          return item
        })
      })
    }
    const beforeUpload = async file => {
      if (file.size / 1024 / 1024 >= 1) {
        message.warn('图片大小不得超过1M')
        return
      }
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        message.warn('请选择.jpeg 或 .png格式的图片')
        return
      }
      fileList.value = [file]
      const formData = new FormData()
      fileList.value.forEach(file => {
        formData.append('file', file)
      })
      await tranFileToBytes(formData).then(res => {
        if (modalFlag.value === '新增商品信息' || modalFlag.value === '编辑商品信息') {
          goodsInfoVOForm.goodsImgData = res
        } else if (modalFlag.value === '新增商品详细信息' || modalFlag.value === '编辑商品详细信息') {
          goodsDetailedInfoVOForm.goodsDetailedImgData = res
          goodsDetailedInfoVOForm.goodsDetailedImgSmallData = res
        }
      })
      return false
    }
    const showAddGoodsInfoModal = () => {
      Object.assign(goodsInfoVOForm, goodsInfoVOFormInit)
      fileList.value = []
      modalFlag.value = '新增商品信息'
      goodsInfoVisible.value = true
    }
    const editGoodsInfo = (index) => {
      Object.assign(goodsInfoVOForm, goodsInfoVOList.value[index])
      fileList.value = [{}]
      goodsIndex.value = index
      modalFlag.value = '编辑商品信息'
      fileList.value = [{
        uid: goodsInfoVOForm.goodsId,
        url: goodsInfoVOForm.goodsImgDataString
      }]
      goodsInfoVisible.value = true
    }
    const showAddGoodsDetailedInfo = (index) => {
      Object.assign(goodsDetailedInfoVOForm, goodsDetailedInfoVOFormInit)
      fileList.value = []
      modalFlag.value = '新增商品详细信息'
      goodsIndex.value = index
      goodsDetailedInfoVisible.value = true
    }
    const editGoodsDetailedInfo = (index1, index2) => {
      Object.assign(goodsDetailedInfoVOForm, goodsInfoVOList.value[index1].goodsDetailedInfoVOList[index2])
      fileList.value = [{}]
      goodsIndex.value = index1
      goodsDetailedIndex.value = index2
      modalFlag.value = '编辑商品详细信息'
      fileList.value = [{
        uid: goodsDetailedInfoVOForm.goodsDetailedId,
        url: goodsDetailedInfoVOForm.goodsDetailedImgSmallDataString
      }]
      goodsDetailedInfoVisible.value = true
    }
    const submitGoodsInfo = () => {
      modalGoodsInfoVOFormRef.value.validateFields().then(async () => {
        if (fileList.value.length === 0) {
          message.warn('请选择商品图片')
          return
        }
        goodsInfoVOForm.userId = JSON.parse(window.sessionStorage.getItem('userInfo')).userId
        if (modalFlag.value === '新增商品信息') {
          saveGoodsInfo(goodsInfoVOForm).then(res => {
            pagination.total += 1
            res.goodsImgDataString = 'data:image/png;base64,' + res.goodsImgData
            goodsInfoVOList.value.push(res)
            goodsInfoVisible.value = false
            message.success('新增商品信息成功')
          })
        } else if (modalFlag.value === '编辑商品信息') {
          updateGoodsInfoByGoodsId(goodsInfoVOForm).then(res => {
            res.goodsImgDataString = 'data:image/png;base64,' + res.goodsImgData
            goodsInfoVOList.value.splice(goodsIndex.value, 1, res)
            goodsInfoVisible.value = false
            message.success('编辑商品信息成功')
          })
        }
      })
    }
    const submitGoodsDetailedInfo = () => {
      modalGoodsDetailedInfoVOFormRef.value.validateFields().then(async () => {
        if (fileList.value.length === 0) {
          message.warn('请选择商品图片')
          return
        }
        if (modalFlag.value === '新增商品详细信息') {
          goodsDetailedInfoVOForm.goodsId = goodsInfoVOList.value[goodsIndex.value].goodsId
          saveGoodsDetailedInfo(goodsDetailedInfoVOForm).then(res => {
            res.goodsDetailedImgSmallDataString = 'data:image/png;base64,' + res.goodsDetailedImgSmallData
            if (goodsInfoVOList.value[goodsIndex.value].goodsDetailedInfoVOList === undefined) {
              goodsInfoVOList.value[goodsIndex.value].goodsDetailedInfoVOList = []
            }
            goodsInfoVOList.value[goodsIndex.value].goodsDetailedInfoVOList.push(res)
            goodsDetailedInfoVisible.value = false
            message.success('新增商品详细信息成功')
          })
        } else if (modalFlag.value === '编辑商品详细信息') {
          updateGoodsDetailedInfoByGoodsDetailedId(goodsDetailedInfoVOForm).then(res => {
            res.goodsDetailedImgSmallDataString = 'data:image/png;base64,' + res.goodsDetailedImgSmallData
            goodsInfoVOList.value[goodsIndex.value].goodsDetailedInfoVOList.splice(goodsDetailedIndex.value, 1, res)
            goodsDetailedInfoVisible.value = false
            message.success('编辑商品详细信息成功')
          })
        }
      })
    }
    const changePage = async () => {
      await getGoodsInfoVOListByUserId({ userId: userInfo.userId, current: pagination.current, pageSize: pagination.pageSize }).then(res => {
        goodsInfoVOList.value = res.map((item) => {
          item.goodsImgDataString = 'data:image/png;base64,' + item.goodsImgData
          getGoodsDetailVOListByGoodsId({ goodsId: item.goodsId }).then(res1 => {
            if (res1 == null) {
              item.goodsDetailedInfoVOList = []
            } else {
              item.goodsDetailedInfoVOList = res1.map((item1) => {
                item1.goodsDetailedImgSmallDataString = 'data:image/png;base64,' + item1.goodsDetailedImgSmallData
                return item1
              })
            }
          })
          return item
        })
      })
    }
    initData()
    return {
      goodsInfoVOList,
      activeKey,
      editGoodsInfo,
      showAddGoodsDetailedInfo,
      editGoodsDetailedInfo,
      goodsInfoVOForm,
      beforeUpload,
      showAddGoodsInfoModal,
      goodsInfoVisible,
      goodsDetailedInfoVisible,
      submitGoodsInfo,
      goodsCategoryInfoVOList,
      fileList,
      goodsIndex,
      goodsDetailedIndex,
      goodsDetailedInfoVOForm,
      submitGoodsDetailedInfo,
      changePage,
      pagination,
      modalGoodsInfoVOFormRef,
      rulesGoodsInfoVO,
      modalGoodsDetailedInfoVOFormRef,
      rulesGoodsDetailedInfoVO
    }
  }

})
</script>

<style scoped lang="less">
  .myGoodsInfo {
    display: inline-block;
  }
</style>
