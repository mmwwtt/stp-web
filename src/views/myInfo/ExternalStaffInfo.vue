<template>
  <div class="MyExternalStaffInfo">
    <h1>入驻信息</h1>
    <a-button style="float: right;margin: -15px 80px 10px 0" @click="showAddModal"><plus-outlined />我要入驻</a-button>
    <a-table
      style="width: 800px;margin: 0px auto"
      :columns="columns"
      rowKey="externalStaffId"
      :data-source="externalStaffInfoVOList"
      :pagination="pagination"
      :scroll="{ y: 450 }"
    >
      <template #bodyCell="{record, index, column}">
        <template v-if="column.dataIndex === 'index'">{{ index+1 }}</template>
        <template v-if="column.dataIndex === 'edit'">
          <a-button @click="showEditModal(record,index)"><edit-outlined />编辑</a-button>
        </template>
        <template v-if="column.dataIndex === 'externalStaffPlace'">
          {{record.areaName1}},{{record.areaName2}},{{record.areaName3}}
        </template>
      </template>
    </a-table>
  </div>
  <a-modal v-model:visible="visible" :title="title">
    <template #footer>
      <a-button @click="visible = false">取消</a-button>
      <a-button type="primary" @click="submitAddExternalStaffInfo">提交</a-button>
    </template>
    <a-form :model="externalStaffInfoVOForm" :rules="rules" ref="modalFormRef"
            :labelCol="{ style: { width: '80px' }}" style="width: 280px; margin: auto 50px">
      <a-form-item label="姓名" name="externalStaffName" >
        <a-input v-model:value="externalStaffInfoVOForm.externalStaffName" placeholder="请输入姓名"/>
      </a-form-item>
      <a-form-item label="手机" name="externalStaffPhone">
        <a-input v-model:value="externalStaffInfoVOForm.externalStaffPhone" placeholder="请输入手机号"/>
      </a-form-item>
      <a-form-item label="职位" name="positionId">
        <a-select v-model:value="externalStaffInfoVOForm.positionId" placeholder="请选择职位" style="width: 200px">
          <a-select-option v-for="positionInfo in positionInfoList"
                           v-bind:key='positionInfo.positionId'
                           :value="positionInfo.positionId">
            {{positionInfo.positionName}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="所在位置" :rules="[{ required: true }]">
        <Address @selectedArea="selectedArea" :areaContext="areaContext" ref="addressRef" style="width: 200px"></Address>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { EditOutlined, PlusOutlined } from '@ant-design/icons-vue'
import Address from '@/components/common/Address.vue'
import { getPositionInfoList } from '@/api/common'
import {
  getExternalStaffInfoVOListCountByUserId,
  getExternalStaffInfoVOListByUserId,
  saveExternalStaff,
  updateExternalStaffInfoByExternalStaffId,
  getExternalStaffInfoVOByExternalStaffId
} from '@/api/staff'
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: '20%',
    align: 'center'
  },
  {
    title: '姓名',
    dataIndex: 'externalStaffName',
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
    dataIndex: 'externalStaffPlace',
    width: '20%',
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
    Address,
    EditOutlined,
    PlusOutlined
  },
  setup () {
    const externalStaffInfoVOList = ref([])
    const positionInfoList = ref([])
    const userInfo = reactive({})
    const visible = ref(false)
    const flag = ref()
    const index = ref()
    const selectedAreaData = ref([])
    const areaContext = ref()
    const title = ref()
    const addressRef = ref({ initData: () => {} })
    const externalStaffInfoVOFormInit = reactive({
      externalStaffName: undefined,
      externalStaffPhone: undefined,
      externalStaffPosition: '',
      positionId: undefined,
      areaId1: undefined,
      areaId2: undefined,
      areaId3: undefined,
      areaName1: '',
      areaName2: '',
      areaName3: ''
    })
    const modalFormRef = ref()
    const externalStaffInfoVOForm = reactive({})
    const rules = reactive({
      externalStaffName: [{
        required: true,
        message: '请输入姓名',
        trigger: 'blur'
      }, {
        min: 2,
        max: 5,
        message: '长度在2-5之间',
        trigger: 'change'
      }],
      externalStaffPhone: [{
        required: true,
        message: '请输入手机号'
      }, {
        min: 11,
        max: 11,
        message: '请输入11位手机号',
        trigger: 'change'
      }],
      positionId: [{
        required: true,
        message: '请选择职位',
        trigger: 'blur'
      }]
    })
    const initData = async () => {
      Object.assign(userInfo, JSON.parse(window.sessionStorage.getItem('userInfo')))
      Object.assign(externalStaffInfoVOForm, externalStaffInfoVOFormInit)
      await getExternalStaffInfoVOListCountByUserId({ userId: userInfo.userId }).then(res => {
        pagination.total = res
      })
      await getExternalStaffInfoVOListByUserId({ userId: userInfo.userId, current: pagination.current, pageSize: pagination.pageSize }).then(res => {
        externalStaffInfoVOList.value = res
      })
      await getPositionInfoList().then(res => {
        positionInfoList.value = res
      })
    }
    const selectedArea = (data) => {
      selectedAreaData.value = data
      console.log(data)
    }

    const showEditModal = (externalStaffInfoVO, idx) => {
      Object.assign(externalStaffInfoVOForm, externalStaffInfoVO)
      areaContext.value = externalStaffInfoVOForm.areaName1 + ',' + externalStaffInfoVOForm.areaName2 + ',' + externalStaffInfoVOForm.areaName3
      selectedAreaData.value = undefined
      addressRef.value.initData()
      flag.value = '编辑'
      index.value = idx
      title.value = '编辑第三方信息'
      visible.value = true
    }
    const showAddModal = () => {
      Object.assign(externalStaffInfoVOForm, externalStaffInfoVOFormInit)
      areaContext.value = '请选择所在地'
      selectedAreaData.value = undefined
      addressRef.value.initData()
      flag.value = '新增'
      title.value = '新增第三方信息'
      visible.value = true
    }

    const submitAddExternalStaffInfo = async () => {
      modalFormRef.value.validateFields().then(() => {
        if (flag.value === '编辑') {
          if (selectedAreaData.value !== undefined) {
            if (selectedAreaData.value.length < 3) {
              message.warn('请补全所在地信息')
              return
            } else if (selectedAreaData.value.length === 3) {
              externalStaffInfoVOForm.areaId1 = selectedAreaData.value[0].areaId
              externalStaffInfoVOForm.areaId2 = selectedAreaData.value[1].areaId
              externalStaffInfoVOForm.areaId3 = selectedAreaData.value[2].areaId
            }
          }

          updateExternalStaffInfoByExternalStaffId(externalStaffInfoVOForm).then(res => {
            getExternalStaffInfoVOByExternalStaffId({ externalStaffId: res.externalStaffId }).then(res1 => {
              externalStaffInfoVOList.value.splice(index.value, 1, res1)
              visible.value = false
              message.success('供应信息修改成功')
            })
          })
        } else if (flag.value === '新增') {
          if (selectedAreaData.value === undefined || selectedAreaData.value.length < 3) {
            message.warn('请补全所在地信息')
            return
          }
          externalStaffInfoVOForm.userId = userInfo.userId
          externalStaffInfoVOForm.areaId1 = selectedAreaData.value[0].areaId
          externalStaffInfoVOForm.areaId2 = selectedAreaData.value[1].areaId
          externalStaffInfoVOForm.areaId3 = selectedAreaData.value[2].areaId
          saveExternalStaff(externalStaffInfoVOForm).then(res => {
            getExternalStaffInfoVOByExternalStaffId({ externalStaffId: res.externalStaffId }).then(res1 => {
              pagination.total += 1
              externalStaffInfoVOList.value.push(res1)
              visible.value = false
              message.success('供应信息添加成功')
            })
          })
        }
      })
    }
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      total: 0,
      pageSizeOptions: ['5', '10', '20', '30', '40', '100'],
      showTotal: (total) => `共 ${total} 条数据`,
      onChange: async (current, pageSize) => {
        pagination.pageSize = pageSize
        pagination.current = current
        await getExternalStaffInfoVOListByUserId({ userId: userInfo.userId, current: pagination.current, pageSize: pagination.pageSize }).then(res => {
          externalStaffInfoVOList.value = res
        })
      }
    })
    initData()
    return {
      selectedArea,
      externalStaffInfoVOList,
      columns,
      visible,
      submitAddExternalStaffInfo,
      externalStaffInfoVOForm,
      showEditModal,
      showAddModal,
      positionInfoList,
      pagination,
      areaContext,
      title,
      addressRef,
      rules,
      modalFormRef
    }
  }
})
</script>

<style scoped lang="less">
  .MyexternalStaffInfo {
    display: inline-block;
  }
</style>
