<template>
  <div style='text-align:center;' >
    <h1>Export JSON to Excel</h1>
    <button @click='onExport' >Export</button> <!-- เพิ่มปุ่ม Export -->
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
        { no: '1', name: 'เครื่องคอมพิวเตอร์', unit: '1', item_code: '7450-010-12542', room: 'EE102' },
        { no: '2', name: 'เครื่องคอมพิวเตอร์', unit: '1', item_code: '7450-010-12543', room: 'EE102' },
        { no: '3', name: 'เครื่องคอมพิวเตอร์', unit: '1', item_code: '7450-010-12544', room: 'EE102' },
      ]
    }
  },
  methods: {
    // เมื่อกดปุ่มจะทำการสร้างไฟล์ xcel ด้วย xlsx
    onExport() {
      const dataWS = utils.json_to_sheet(this.json, {header:['ลำดับ','รายการ','จำนวน/หน่วย','หมายเลขครุภัณฑ์','สถานที่เก็บ']})
      const wb = utils.book_new()
      utils.book_append_sheet(wb, dataWS)
      writeFileXLSX(wb,'รายการจำหน่าย.xlsx')
    },
  }
}
</script>