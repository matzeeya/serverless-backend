<template>
  <div style="text-align:center;" >
    <h1>Export JSON to Excel</h1>
    <button @click="onExport" >Export</button> <!-- เพิ่มปุ่ม Export -->
  </div>
</template>

<script>
import { utils , writeFileXLSX } from 'xlsx' // import xlsx
export default {
  name: 'app',
  data(){
    return {
      // ข้อมูล JSON ทีต้องการ Export
      json : [
        { 'ลำดับ': '1', 'รายการ': 'เครื่องคอมพิวเตอร์', 'จำนวน/หน่วย': '1', 'หมายเลขครุภัณฑ์': '7450-010-12542', 'สถานที่เก็บ': 'EE102' },
        { 'ลำดับ': '2', 'รายการ': 'เครื่องคอมพิวเตอร์', 'จำนวน/หน่วย': '1', 'หมายเลขครุภัณฑ์': '7450-010-12543', 'สถานที่เก็บ': 'EE102' },
        { 'ลำดับ': '3', 'รายการ': 'เครื่องคอมพิวเตอร์', 'จำนวน/หน่วย': '1', 'หมายเลขครุภัณฑ์': '7450-010-12544', 'สถานที่เก็บ': 'EE102' },
      ]
    }
  },
  methods: {
    // เมื่อกดปุ่มจะทำการสร้างไฟล์ xcel ด้วย xlsx
    onExport() {
      const dataWS = utils.json_to_sheet(this.json)
      const wb = utils.book_new()
      utils.book_append_sheet(wb, dataWS)
      writeFileXLSX(wb,'รายการจำหน่าย.xlsx')
    },
  }
}
</script>