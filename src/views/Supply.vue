<template>
  <div class="MySupplyInfo">
    <h1>供应信息</h1>
    <a-button style="float: right;margin: -15px 80px 10px 0" @click="showAddModal">
      <plus-outlined/>
      我要供应
    </a-button>
    <a-table
        style="width: 800px;margin: 0 auto"
        :columns="columns"
        :rowKey="(record:Supply) => record.supplyId"
        :data-source="supplyList"
        :pagination="pagination"
        :scroll="{ y: 450 }"
        @click="supplyQueryPage"
    >
      <template #bodyCell="{record, index, column}">
        <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
        <template v-if="column.dataIndex === 'info'">
          <img :src="record.imgData" alt="" style="margin-right: 15px; float: left; height:150px">
          <div style="display: inline-block; float:left; margin-top: 10px">
            <span style=""> {{ record.title }}</span>
            <br>
            <span>￥{{ record.price.toFixed(2) }}</span>
            <br>
            <img :src="record.imgData" style="width: 200px;height:200px" alt="">
          </div>
        </template>
        <template v-if="column.dataIndex === 'quantity'">
          {{ record.quantity }}
        </template>
        <template v-if="column.dataIndex === 'price'">
          ￥{{ (record.quantity * record.price).toFixed(2) }}
        </template>
        <template v-if="column.dataIndex === 'edit'">
          <a-button @click="showEditModal(record,index)">
            <edit-outlined/>
            编辑
          </a-button>
        </template>
      </template>
    </a-table>
  </div>
  <a-modal v-model:open="open" title="新增供应信息" @ok="submitAddSupplyInfo">
    <a-form :model="supplyForm" :rules="rules" ref="modalFormRef" style="width: 400px; margin: auto auto">
      <a-form-item label="商品标题" name="title">
        <a-input v-model:value="supplyForm.title" placeholder="请输入商品标题"/>
      </a-form-item>
      <a-form-item label="商品介绍" name="description">
        <a-textarea v-model:value="supplyForm.description" placeholder="请输入商品介绍"/>
      </a-form-item>
      <a-form-item label="商品分类" name="typeCode">
        <a-select v-model:value="supplyForm.typeCode" placeholder="请选择商品分类"
                  style="width: 120px">
          <a-select-option v-for="goodsType in goodsTypeList"
                           v-bind:key='goodsType.code'
                           :value="goodsType.code">
            {{ goodsType.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="商品高度" name="height">
        <a-input-number v-model:value="supplyForm.height" placeholder="请输入商品高度"
                        style="width: 150px" :min="0.01" :step="0.01"/>
        <a-button type="primary" style="margin-left: 20px" @click="supplyForm.height = 0.01">重置
        </a-button>
      </a-form-item>
      <a-form-item label="商品价格" name="price">
        <a-input-number v-model:value="supplyForm.price" placeholder="请输入商品价格"
                        style="width: 150px" :min="0.01" :step="0.01"/>
        <a-button type="primary" style="margin-left: 20px" @click="supplyForm.price = 0.01">重置
        </a-button>
      </a-form-item>
      <a-form-item label="商品数量" name="quantity">
        <a-input-number v-model:value="supplyForm.quantity" placeholder="请输入商品数量"
                        style="width: 150px" :min="1" :step="1"/>
        <a-button type="primary" style="margin-left: 20px" @click="supplyForm.quantity = 1">重置
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
import {ref, reactive, onMounted} from 'vue'
import {message} from 'ant-design-vue'
import {UploadOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons-vue'
import {supplyQueryPage, supplySaveOrUpdate} from '@/api/supply'
import type {Supply, User} from "@/type.ts";
import {goodsTypeQuery, tranFileToBytes} from "@/api/common";

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

const modalFormRef = ref()
const supplyList = ref<Supply[]>()
const goodsTypeList = ref()
const userInfo = reactive<User>({})
const open = ref(false)
const fileList = ref<any[]>([])
const flag = ref()
const index = ref()

const supplyForm = reactive<Supply>({})
const rules = reactive({
  supplyGoodsTitle: [{
    required: true,
    message: '请输入商品标题',
    trigger: 'blur'
  }, {
    min: 2,
    message: '商品标题不少于2个字',
    trigger: 'blur'
  }],
  supplyGoodsCategoryId: [{
    required: true,
    message: '请选择商品分类',
    trigger: 'blur'
  }],
  supplyGoodsHeight: [{
    required: true,
    message: '请选择商品高度',
    trigger: 'blur'
  }],
  supplyGoodsPrice: [{
    required: true,
    message: '请选择商品价格',
    trigger: 'blur'
  }],
  supplyGoodsQuantity: [{
    required: true,
    message: '请选择商品数量',
    trigger: 'blur'
  }],
  supplyGoodsIntroduction: [{
    required: true,
    message: '请输入商品描述',
    trigger: 'blur'
  }, {
    min: 2,
    message: '商品描述不少于2个字',
    trigger: 'blur'
  }]
})

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  pageSizeOptions: ['5', '10', '20', '30', '40', '100'],
  showTotal: (total: number) => `共 ${total} 条数据`,
  onChange: async (current: number, pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.current = current
    await supplyQueryPage({
      userId: userInfo.userId,
      current: pagination.current,
      size: pagination.pageSize
    }).then((res: any) => {
      supplyList.value = res;
      pagination.total = res.total;
      console.log(supplyList)
    })
  }
})

onMounted(async () => {
  Object.assign(supplyForm, {})
  Object.assign(userInfo, JSON.parse(window.sessionStorage.getItem('userInfo') || '{}'))

  await supplyQueryPage({
    userId: userInfo.userId,
    current: pagination.current,
    size: pagination.pageSize
  }).then((res: any) => {
    supplyList.value = res.records;
    pagination.total = res.total;
    console.log(supplyList.value)
  })
  await goodsTypeQuery().then(res => {
    goodsTypeList.value = res
  })
})

const submitAddSupplyInfo = async () => {
  modalFormRef.value.validateFields().then(async () => {
    if (fileList.value.length === 0) {
      message.warn('请选择商品图片')
      return
    }
    if (flag.value === '编辑') {
      supplySaveOrUpdate(supplyForm).then((res: any) => {
        if (supplyList.value != undefined && index.value < supplyList.value.length) {
          supplyList.value.splice(index.value, 1, res)
        }
        message.success('供应信息修改成功')
      })
    } else if (flag.value === '新增') {
      supplyForm.userId = userInfo.userId
      supplyForm.place = '杭州'
      await supplySaveOrUpdate(supplyForm).then(res => {
        supplyQueryPage({
          userId: userInfo.userId,
          current: pagination.current,
          size: pagination.pageSize
        }).then((res: any) => {
          supplyList.value = res;
          pagination.total = res.total;
        })
        message.success('供应信息添加成功')
      })
    }
    open.value = false
  })
}
const beforeUpload = async (file: File) => {
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
  await tranFileToBytes(formData).then((res: any) => {
    supplyForm.imgData = res
  })
  return false
}

const showEditModal = (supply: Supply, idx: number) => {
  Object.assign(supplyForm, supply)
  flag.value = '编辑'
  index.value = idx
  fileList.value = [{
    uid: supplyForm.supplyId || 0,
  }]
  open.value = true
}
const showAddModal = () => {
  Object.assign(supplyForm, {})
  flag.value = '新增'
  fileList.value = []
  open.value = true
}

</script>

<style scoped lang="less">
.MySupplyInfo {
  display: inline-block;
}
</style>
