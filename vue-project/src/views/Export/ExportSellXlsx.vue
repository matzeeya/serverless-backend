<template>
  <section>
    <div style="text-align:center"><p><b>รายการครุภัณฑ์ที่จำหน่ายประจำปีงบประมาณ {{ thisYear }}</b></p></div>
    <b-table
      :data="isEmpty ? [] : data"
      :mobile-cards="hasMobileCards">

      <b-table-column field="index" label="ลำดับ" :td-attrs="columnTdAttrs" v-slot="props">
        {{ props.row.index }}
      </b-table-column>

      <b-table-column field="name" label="รายการ" :td-attrs="columnTdAttrs" v-slot="props">
        {{ props.row.name }}
      </b-table-column>

      <b-table-column field="unit" label="จำนวน/หน่วย" :td-attrs="columnTdAttrs" v-slot="props">
        {{ props.row.unit }}
      </b-table-column>

      <b-table-column field="item_code" label="หมายเลขครุภัณฑ์" :td-attrs="columnTdAttrs" v-slot="props">
        {{ props.row.item_code }}
      </b-table-column>

      <b-table-column field="room" label="สถานที่เก็บ" :td-attrs="columnTdAttrs" v-slot="props">
        {{ props.row.room }}
      </b-table-column>

      <template #empty>
        <div class="has-text-centered">No records</div>
      </template>
    </b-table>
    <button @click='onExport' >Export</button> 
  </section>
</template>

<script>
import { utils , writeFileXLSX } from 'xlsx' // import xlsx

export default {
  name: 'app',
  data(){
    return {
      data:[
        {'index':'1','name':'เครื่องคอมพิวเตอร์ สำหรับงานประมวลผลแบบที่ 1','unit':'1','item_code':'7450-010-13406','room':'EE113'},
        {'index':'2','name':'เครื่องคอมพิวเตอร์ สำหรับงานประมวลผลแบบที่ 1','unit':'1','item_code':'7450-010-13407','room':'EE113'},
        {'index':'3','name':'เครื่องคอมพิวเตอร์ สำหรับงานประมวลผลแบบที่ 1','unit':'1','item_code':'7450-010-13408','room':'EE509'},
        {'index':'4','name':'เครื่องคอมพิวเตอร์ สำหรับงานประมวลผลแบบที่ 1','unit':'1','item_code':'7450-010-13409','room':'EE509'},
      ],
      isEmpty: false,
      hasMobileCards: true,
      thisYear: new Date().getFullYear() + 543
    }
  },
  methods: {
    onExport() { // เมื่อกดปุ่มจะทำการสร้างไฟล์ xcel ด้วย xlsx
      const dataWS = utils.json_to_sheet(this.datas);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, dataWS);
      writeFileXLSX(wb,'รายการจำหน่าย '+ this.thisYear +'.xlsx');
    }
  }
}
</script>