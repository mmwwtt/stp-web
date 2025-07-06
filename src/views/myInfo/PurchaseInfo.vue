<template>
  <div class="MyPurchaseInfo">
    <h1>求购信息</h1>
    <a-button style="float: right;margin: -15px 80px 10px 0" @click="showAddModal"><plus-outlined />我要求购</a-button>
    <a-table
      style="width: 800px;margin: 0px auto"
      :columns="columns"
      rowKey="purchaseId"
      :data-source="purchaseInfoVOList"
      :pagination="pagination"
      :scroll="{ y: 450 }"
    >
      <template #bodyCell="{record, index, column}">
        <template v-if="column.dataIndex === 'index'">{{ index+1 }}</template>
        <template v-if="column.dataIndex === 'info'">
            <img :src="record.purchaseGoodsImgDataString" alt="" style="margin-right: 15px; float: left; height:150px">
            <div style="display: inline-block; float:left; margin-top: 10px">
              <span style=""> {{record.purchaseGoodsTitle}}</span>
              <br>
              <span>￥{{record.purchaseGoodsPrice.toFixed(2)}}</span>
            </div>
        </template>
        <template v-if="column.dataIndex === 'quantity'">
          {{record.purchaseGoodsQuantity}}
        </template>
        <template v-if="column.dataIndex === 'price'">￥{{(record.purchaseGoodsQuantity*record.purchaseGoodsPrice).toFixed(2)}}</template>
        <template v-if="column.dataIndex === 'edit'">
          <a-button @click="showEditModal(record)"><edit-outlined />编辑</a-button>
        </template>
      </template>
    </a-table>
  </div>
  <a-modal v-model:visible="visible" title="新增供应信息">
    <template #footer>
      <a-button @click="visible = false">取消</a-button>
      <a-button type="primary" @click="submitAddPurchaseInfo">提交</a-button>
    </template>
    <a-form :model="purchaseInfoVOForm" :rules="rules" ref="modalFormRef" style="width: 400px; margin: auto auto">
      <a-form-item label="商品标题"  name="purchaseGoodsTitle">
        <a-input v-model:value="purchaseInfoVOForm.purchaseGoodsTitle" placeholder="请输入商品标题"/>
      </a-form-item>
      <a-form-item label="商品介绍" name="purchaseGoodsIntroduction" >
        <a-textarea v-model:value="purchaseInfoVOForm.purchaseGoodsIntroduction"  placeholder="请输入商品介绍"/>
      </a-form-item>
      <a-form-item label="商品分类" name="purchaseGoodsCategoryId">
        <a-select v-model:value="purchaseInfoVOForm.purchaseGoodsCategoryId" placeholder="请选择商品分类" style="width: 150px">
          <a-select-option v-for="goodsCategoryInfo in goodsCategoryInfoVOList"
                           v-bind:key='goodsCategoryInfo.goodsCategoryId'
                           :value="goodsCategoryInfo.goodsCategoryId">
            {{goodsCategoryInfo.goodsCategoryName}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="商品高度" name="purchaseGoodsHeight">
        <a-input-number v-model:value="purchaseInfoVOForm.purchaseGoodsHeight" placeholder="请输入商品高度" style="width: 150px" :min="0.01" :step="0.01"/>
        <a-button type="primary" style="margin-left: 20px" @click="purchaseInfoVOForm.purchaseGoodsHeight = 0.01">重置</a-button>
      </a-form-item>
      <a-form-item label="商品价格" name="purchaseGoodsPrice">
        <a-input-number v-model:value="purchaseInfoVOForm.purchaseGoodsPrice" placeholder="请输入商品价格" style="width: 150px" :min="0.01" :step="0.01"/>
        <a-button type="primary" style="margin-left: 20px" @click="purchaseInfoVOForm.purchaseGoodsPrice = 0.01">重置</a-button>
      </a-form-item>
      <a-form-item label="商品数量" name="purchaseGoodsQuantity">
        <a-input-number v-model:value="purchaseInfoVOForm.purchaseGoodsQuantity" placeholder="请输入商品数量" style="width: 150px" :min="0.01" :step="1"/>
        <a-button type="primary" style="margin-left: 20px" @click="purchaseInfoVOForm.purchaseGoodsQuantity = 0.01">重置</a-button>
      </a-form-item>
      <a-form-item label="商品图片" style="height: 80px" :rules="[{ required: true }]">
        <a-upload :file-list="fileList" :before-upload="beforeUpload" list-type="picture" >
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
import { defineComponent, ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { UploadOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { tranFileToBytes } from '@/api/common'
import {
  getGoodsCategoryInfoVOList
} from '@/api/goods'
import {
  getPurchaseInfoVOListCountByUserId,
  getPurchaseInfoVOListByUserId,
  savePurchaseInfo,
  updatePurchaseInfoByPurchaseId
} from '@/api/purchase'

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: '20%',
    align: 'center'
  },
  {
    title: '商品信息',
    dataIndex: 'info',
    width: '35%',
    align: 'center'
  },
  {
    title: '数量',
    dataIndex: 'quantity',
    width: '15%',
    align: 'center'
  },
  {
    title: '单价',
    dataIndex: 'price',
    width: '15%',
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'edit',
    width: '15%',
    align: 'center'
  }
]
export default defineComponent({
  emits: ['initMenu'],
  components: {
    UploadOutlined,
    EditOutlined,
    PlusOutlined
  },
  setup () {
    const modalFormRef = ref()
    const purchaseInfoVOList = ref([])
    const flag = ref()
    const index = ref()
    const goodsCategoryInfoVOList = ref([])
    const userInfo = reactive({})
    const visible = ref(false)
    const fileList = ref([])
    const purchaseInfoVOFormInit = reactive({
      purchaseId: undefined,
      userId: undefined,
      purchaseGoodsTitle: undefined,
      purchaseGoodsIntroduction: undefined,
      purchaseGoodsCategoryId: undefined,
      purchaseGoodsHeight: undefined,
      purchaseGoodsPrice: undefined,
      purchaseGoodsQuantity: undefined
    })
    const purchaseInfoVOForm = reactive({})
    const rules = reactive({
      purchaseGoodsTitle: [{
        required: true,
        message: '请输入商品标题',
        trigger: 'blur'
      }, {
        min: 2,
        message: '商品标题不少于2个字',
        trigger: 'blur'
      }],
      purchaseGoodsCategoryId: [{
        required: true,
        message: '请选择商品分类',
        trigger: 'blur'
      }],
      purchaseGoodsHeight: [{
        required: true,
        message: '请选择商品高度',
        trigger: 'blur'
      }],
      purchaseGoodsPrice: [{
        required: true,
        message: '请选择商品价格',
        trigger: 'blur'
      }],
      purchaseGoodsQuantity: [{
        required: true,
        message: '请选择商品数量',
        trigger: 'blur'
      }],
      purchaseGoodsIntroduction: [{
        required: true,
        message: '请输入商品描述',
        trigger: 'blur'
      }, {
        min: 2,
        message: '商品描述不少于2个字',
        trigger: 'blur'
      }]
    })
    const initData = async () => {
      Object.assign(purchaseInfoVOForm, purchaseInfoVOFormInit)
      Object.assign(userInfo, JSON.parse(window.sessionStorage.getItem('userInfo')))
      await getPurchaseInfoVOListCountByUserId({ userId: userInfo.userId }).then(res => {
        pagination.total = res
      })
      await getPurchaseInfoVOListByUserId({ userId: userInfo.userId, current: pagination.current, pageSize: pagination.pageSize }).then(res => {
        purchaseInfoVOList.value = res.map((item) => {
          item.purchaseGoodsImgDataString = 'data:image/png;base64,' + item.purchaseGoodsImgData
          return item
        })
      })
      await getGoodsCategoryInfoVOList().then(res => {
        goodsCategoryInfoVOList.value = res
      })
    }
    const submitAddPurchaseInfo = async () => {
      modalFormRef.value.validateFields().then(async () => {
        if (fileList.value.length === 0) {
          message.warn('请选择商品图片')
          return
        }
        if (flag.value === '编辑') {
          updatePurchaseInfoByPurchaseId(purchaseInfoVOForm).then(res => {
            res.purchaseGoodsImgDataString = 'data:image/png;base64,' + res.purchaseGoodsImgData
            purchaseInfoVOList.value.splice(index.value, 1, res)
            message.success('供应信息修改成功')
          })
        } else if (flag.value === '新增') {
          purchaseInfoVOForm.userId = userInfo.userId
          purchaseInfoVOForm.purchaseGoodsPlace = '杭州'
          await savePurchaseInfo(purchaseInfoVOForm).then(res => {
            pagination.total += 1
            res.purchaseGoodsImgDataString = 'data:image/png;base64,' + res.purchaseGoodsImgData
            purchaseInfoVOList.value.push(res)
            message.success('供应信息添加成功')
          })
        }
        visible.value = false
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
        purchaseInfoVOForm.purchaseGoodsImgData = res
      })
      return false
    }
    const showEditModal = (purchaseInfoVO, idx) => {
      Object.assign(purchaseInfoVOForm, purchaseInfoVO)
      flag.value = '编辑'

      index.value = idx
      fileList.value = [{
        uid: purchaseInfoVOForm.purchaseId,
        url: purchaseInfoVOForm.purchaseGoodsImgDataString
      }]
      visible.value = true
    }
    const showAddModal = () => {
      Object.assign(purchaseInfoVOForm, purchaseInfoVOFormInit)
      fileList.value = []
      flag.value = '新增'
      visible.value = true
    }
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      total: 0,
      pageSizeOptions: ['5', '10', '20', '30', '40', '100'],
      showTotal: (total) => `共 ${total} 条数据`,
      onChange: async (current, pageSize) => {
        pagination.current = current
        pagination.pageSize = pageSize
        await getPurchaseInfoVOListByUserId({ userId: userInfo.userId, current: pagination.current, pageSize: pagination.pageSize }).then(res => {
          purchaseInfoVOList.value = res.map((item) => {
            item.purchaseGoodsImgDataString = 'data:image/png;base64,' + item.purchaseGoodsImgData
            return item
          })
        })
      }
    })
    initData()
    return {
      purchaseInfoVOList,
      columns,
      visible,
      submitAddPurchaseInfo,
      purchaseInfoVOForm,
      goodsCategoryInfoVOList,
      beforeUpload,
      fileList,
      showEditModal,
      showAddModal,
      pagination,
      modalFormRef,
      rules
    }
  }
})
</script>

<style scoped lang="less">
  .MyPurchaseInfo {
    display: inline-block;
  }
</style>
