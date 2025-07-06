<template>
  <a-cascader
      v-model:value="value"
      :options="areaList"
      :load-data="loadData"
      change-on-select
  />
</template>
<script setup lang="ts">

import { ref, onBeforeMount} from 'vue'
import { areaQueryByPreId} from "@/api/common.ts";

const value = ref([])
const selectedAreaData = ref([])
const areaList = ref()
const preId = ref<number>()

onBeforeMount(async () => {
  value.value = []
  selectedAreaData.value = []
  preId.value = 1
  await areaQueryByPreId({preId:preId.value}).then((res:any) => {
    areaList.value = res.map((item: any) => {
      let isLeaf = (item.level === 3)
      return {
        value: item.areaId,
        label: item.areaName,
        isLeaf: isLeaf
      }
    })
  })
})

const loadData = (selectedOptions:any) => {
  const targetOption = selectedOptions[selectedOptions.length - 1]
  targetOption.loading = true
  preId.value = targetOption.value
  setTimeout(() => {
    targetOption.loading = false
    areaQueryByPreId({preId:preId.value}).then((res:any) => {
      targetOption.children = res.map((item: any) => {
        let isLeaf = item.level === 3
        return {
          value: item.areaId,
          label: item.areaName,
          isLeaf: isLeaf
        }
      })
    })
    areaList.value = [...areaList.value]
  }, 100)
}
const onChange = (_value:any, selectedOptions:any) => {
  selectedAreaData.value = selectedOptions.map((item:any) => {
    return {
      areaId: item.value,
      areaName: item.label
    }
  })

}

</script>
