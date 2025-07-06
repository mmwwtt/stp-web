<template>
  <div style="width: 1200px;text-align: center;margin: 0 auto">
    <br>
    <h1>第三方入驻</h1>
    <a-button style="float: right;margin: -15px 80px 10px 0" @click="showModal">
      <plus-outlined/>
      我要入驻
    </a-button>
    <a-table
        style="width: 1200px;margin: 0px auto"
        :columns="columns"
        rowKey="externalStaffId"
        :data-source="externalStaffList"
        :pagination="pagination"
        :scroll="{ y: 450 }"
    >
      <template #bodyCell="{record, index, column}">
        <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
        <template v-if="column.dataIndex === 'name'">{{ record.name}}</template>
        <template v-if="column.dataIndex === 'position'">{{ record.positionCode }}</template>
        <template v-if="column.dataIndex === 'place'">
          {{ record.areaName1 }},{{ record.areaName2 }},{{ record.areaName3 }}
        </template>
        <template v-if="column.dataIndex === 'phone'">{{ record.phone}}</template>
      </template>
    </a-table>
  </div>
  <a-modal v-model:open="open" title="新增第三方信息">
    <template #footer>
      <a-button @click="open = false">取消</a-button>
      <a-button type="primary" @click="submitSaveExternalStaff">提交</a-button>
    </template>
    <a-form :model="externalStaff" :rules="rules" ref="modalFormRef"
            :labelCol="{ style: { width: '80px' }}" style="width: 280px; margin: auto 50px">
      <a-form-item label="姓名" name="name">
        <a-input v-model:value="externalStaff.name" placeholder="请输入姓名"/>
      </a-form-item>
      <a-form-item label="手机" name="phone">
        <a-input v-model:value="externalStaff.phone" placeholder="请输入手机号"/>
      </a-form-item>
      <a-form-item label="职位" name="positionCode">
        <a-select v-model:value="externalStaff.positionCode" placeholder="请选择职位" style="width: 200px">
          <a-select-option v-for="position in positionList"
                           v-bind:key='position.code'
                           :value="position.code">
            {{ positionInfo.positionName }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="所在位置" :rules="[{ required: true }]">
        <Area @selectedArea="selectedArea" :areaContext="areaContext" ref="addressRef"
                 style="width: 200px"></Area>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted} from 'vue'
import {PlusOutlined} from '@ant-design/icons-vue'
import {message} from 'ant-design-vue'
import {positionQuery} from '@/api/common'
import {staffQueryPage, staffSaveOrUpdate} from '@/api/staff'
import type {Position, Staff, User} from "@/type.ts";
import Area from "@/components/Area.vue";

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: '20%',
    align: 'center'
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: '20%',
    align: 'center'
  },
  {
    title: '职务',
    dataIndex: 'positionName',
    width: '20%',
    align: 'center'
  },
  {
    title: '所在地',
    dataIndex: 'place',
    width: '20%',
    align: 'center'
  },
  {
    title: '联系方式',
    dataIndex: 'phone',
    width: '20%',
    align: 'center'
  }
]
const open = ref(false)
const externalStaffList = ref<Staff[]>([])
const positionList = ref<Position[]>([])
const modalFormRef = ref()
const selectedAreaData = ref()
const areaContext = ref()
const userInfo = reactive<User>({})
const externalStaff = reactive<Staff>({})
const rules = reactive({
  name: [{
    required: true,
    message: '请输入姓名',
    trigger: 'blur'
  }, {
    min: 2,
    max: 5,
    message: '长度在2-5之间',
    trigger: 'change'
  }],
  phone: [{
    required: true,
    message: '请输入手机号'
  }, {
    min: 11,
    max: 11,
    message: '请输入11位手机号',
    trigger: 'change'
  }],
  positionCode: [{
    required: true,
    message: '请选择职位',
    trigger: 'blur'
  }]
})
onMounted(async () => {
  await staffQueryPage({
    current: pagination.current,
    pageSize: pagination.pageSize,
    userId: userInfo.userId
  }).then((res:any) => {
    pagination.total = res.total
    externalStaffList.value = res.records
  })
  await positionQuery().then(res => {
    positionList.value = res
  })
})

const selectedArea = (data) => {
  selectedAreaData.value = data
  console.log(data)
}

const submitSaveExternalStaff = () => {
  modalFormRef.value.validateFields().then(() => {
    if (selectedAreaData.value === undefined || selectedAreaData.value.length < 3) {
      message.warn('请补全所在地信息')
      return
    }
    externalStaff.userId = userInfo.userId
    externalStaff.areaId1 = selectedAreaData.value[0].areaId
    externalStaff.areaId2 = selectedAreaData.value[1].areaId
    externalStaff.areaId3 = selectedAreaData.value[2].areaId
    staffSaveOrUpdate(externalStaff).then(async () => {
      await staffQueryPage({
        current: pagination.current,
        pageSize: pagination.pageSize,
        userId: userInfo.userId
      }).then((res:any) => {
        externalStaffList.value = res.records
      })
    })
    message.success('第三方入驻成功')
    open.value = false
  })
}
const showModal = () => {
  if (JSON.parse(window.sessionStorage.getItem('userInfo')) === null) {
    message.error('请先登入')
    return
  }
  Object.assign(externalStaff, externalStaffInfoInit)
  Object.assign(userInfo, JSON.parse(window.sessionStorage.getItem('userInfo')))
  selectedAreaData.value = undefined
  addressRef.value.initData()
  areaContext.value = '请输入位置信息'
  open.value = true
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
    await staffQueryPage({
      current: pagination.current,
      pageSize: pagination.pageSize,
      userId: userInfo.userId
    }).then((res:any) => {
      pagination.total = res.total
      externalStaffList.value = res.records
    })
  }
})

</script>
