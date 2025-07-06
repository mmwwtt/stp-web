<template>
  <div style="width: 1200px;text-align: center;margin: 0 auto">
    <br>
    <h1>求购大厅</h1>
    <a-button style="float: right;margin: -15px 80px 10px 0" @click="showModal">
      <plus-outlined/>
      我要求购
    </a-button>
    <a-table
        style="width: 1200px;margin: 0px auto"
        :columns="columns"
        rowKey="purchaseId"
        :data-source="purchaseList"
        :pagination="pagination"
        :scroll="{ y: 450 }"
    >
      <template #bodyCell="{record, index, column}">
        <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
        <template v-if="column.dataIndex === 'info'">
          <div>
            <img :src="record.imgData" alt="" style="margin-right: 15px; float: left; height:150px">
            <div style="display: inline-block; float:left; margin-top: 10px">
              <span style=""> {{ record.title }}</span>
              <br>
              <span>￥{{ record.price.toFixed(2) }}</span>
            </div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'quantity'">
          {{ record.quantity }}
        </template>
        <template v-if="column.dataIndex === 'price'">
          ￥{{ (record.quantity * record.price).toFixed(2) }}
        </template>
        <template v-if="column.dataIndex === 'phone'">
          {{ record.phone}}
        </template>
      </template>
    </a-table>
  </div>
  <a-modal v-model:open="open" title="新增求购信息" @ok="submitAddpurchaseInfo">
    <a-form :model="purchaseForm" :rules="rules" ref="modalFormRef" style="width: 400px; margin: auto auto">
      <a-form-item label="商品标题" name="title">
        <a-input v-model:value="purchaseForm.title" placeholder="请输入商品标题"/>
      </a-form-item>
      <a-form-item label="商品介绍" name="description">
        <a-textarea v-model:value="purchaseForm.description" placeholder="请输入商品介绍"/>
      </a-form-item>
      <a-form-item label="商品分类" name="typeCode">
        <a-select v-model:value="purchaseForm.typeCode" placeholder="请选择商品分类"
                  style="width: 150px">
          <a-select-option v-for="goodsType in goodsTypeList"
                           v-bind:key='goodsType.code'
                           :value="goodsType.code">
            {{ goodsType.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="商品高度" name="height">
        <a-input-number v-model:value="purchaseForm.height" placeholder="请输入商品高度"
                        style="width: 150px" :min="0.01" :step="0.01"/>
        <a-button type="primary" style="margin-left: 20px" @click="purchaseForm.height = 0.01">重置
        </a-button>
      </a-form-item>
      <a-form-item label="商品价格" name="price">
        <a-input-number v-model:value="purchaseForm.price" placeholder="请输入商品价格"
                        style="width: 150px" :min="0.01" :step="0.01"/>
        <a-button type="primary" style="margin-left: 20px" @click="purchaseForm.price = 0.01">重置
        </a-button>
      </a-form-item>
      <a-form-item label="商品数量" name="quantity">
        <a-input-number v-model:value="purchaseForm.quantity" placeholder="请输入商品数量"
                        style="width: 150px" :min="1" :step="1"/>
        <a-button type="primary" style="margin-left: 20px" @click="purchaseForm.quantity = 1">重置
        </a-button>
      </a-form-item>
      <a-form-item label="商品图片" style="height: 80px" :rules="[{ required: true }]">
        <a-upload :file-list="fileList" :before-upload="beforeUpload" list-type="picture">
          <a-button>
            <upload-outlined></upload-outlined>
            上传图片
          </a-button>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted} from 'vue'
import {PlusOutlined, UploadOutlined} from '@ant-design/icons-vue'
import {message} from 'ant-design-vue'
import {tranFileToBytes,goodsTypeQuery} from '@/api/common'
import { purchaseQueryPage, purchaseSaveOrUpdate} from '@/api/purchase'
import type {GoodsType, Purchase, User} from "@/type.js";

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
    title: '获取联系方式',
    dataIndex: 'getTelephone',
    width: '15%',
    align: 'center'
  }
]

const modalFormRef = ref()
const purchaseList = ref<Purchase[]>([])
const goodsTypeList = ref<GoodsType[]>([])
const open = ref(false)
const userInfo = reactive<User>({})
const purchaseForm = reactive<Purchase>({})
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
onMounted(async () => {
  await purchaseQueryPage({
    userId: userInfo.userId,
    current: pagination.current,
    pageSize: pagination.pageSize
  }).then((res: any) => {
    pagination.total = res.total
    purchaseList.value = res.records;
  })

  await goodsTypeQuery().then((res:any) => {
    goodsTypeList.value = res
  })
})

const submitAddpurchaseInfo = async () => {
  modalFormRef.value.validateFields().then(async () => {
    if (fileList.value.length === 0) {
      message.warn('请选择商品图片')
      return
    }
    purchaseForm.userId = userInfo.userId
    purchaseForm.place = '杭州'

    const formData = new FormData()
    fileList.value.forEach(file => {
      formData.append('file', file)
    })
    await tranFileToBytes(formData).then((res:any) => {
      purchaseForm.imgData = res
    })
    await purchaseSaveOrUpdate(purchaseForm).then((res:any) => {
      pagination.total += 1
      purchaseList.value.push(res)
      message.success('求购信息添加成功')
    })
    open.value = false
  })
}
const fileList = ref<any[]>([])
const beforeUpload = (file:any) => {
  if (file.size / 1024 / 1024 >= 1) {
    message.warn('图片大小不得超过1M')
    return
  }
  if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
    message.warn('请选择.jpeg 或 .png格式的图片')
    return
  }
  fileList.value = [file]
  return false
}
const showModal = () => {
  if (JSON.parse(window.sessionStorage.getItem('userInfo') || '{}') === null) {
    message.error('请先登入')
    return
  }
  Object.assign(userInfo, JSON.parse(window.sessionStorage.getItem('userInfo') || '{}'))
  Object.assign(purchaseForm, {})
  fileList.value = []
  open.value = true
}
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  pageSizeOptions: ['5', '10', '20', '30', '40', '100'],
  showTotal: (total:any) => `共 ${total} 条数据`,
  onChange: async (current:number, pageSize:number) => {
    pagination.current = current
    pagination.pageSize = pageSize
    await purchaseQueryPage({
      userId: userInfo.userId,
      current: pagination.current,
      pageSize: pagination.pageSize
    }).then((res:any) => {
      purchaseList.value = res.records;
    })
  }
})
</script>
