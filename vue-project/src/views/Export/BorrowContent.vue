<template>
  <div></div>
</template>

<script>
import pdfMake from 'pdfmake'
import pdfFonts from './../../assets/Thaifonts.js'

export default {
  data() {
    return {
      dates: null
    }
  },
  mounted() {
    this.exportPDF()
  },
  methods: {
		exportPDF() {
      var doc = this.docContent();

      const docDefinition = {
        pageSize: 'A4',
        content: doc,
        defaultStyle: { 
          font: 'THSarabunPSK'
        }
      }
      pdfMake.vfs = pdfFonts.pdfMake.vfs
      pdfMake.fonts = {
        THSarabunPSK:{
          normal: 'THSarabunPSK.ttf',
          bold: 'THSarabunPSKBold.ttf'
        }
      }
      pdfMake.createPdf(docDefinition).open();
    },
    docContent(){
      var ct = []
      ct.push({
        text: 'ใบยืมวัสดุ และครุภัณฑ์',
        fontSize: 24,
        bold: true,
        alignment: 'center'
      });

      ct.push({
        text: 'คณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร',
        fontSize: 24,
        bold: true,
        alignment: 'center'
      })
      ct.push(' ')

      ct.push({
        // absolutePosition: { x: 50, y: 150},
        text: 'วันที่ ' + this.getDate(),
        fontSize: 16
      })
      ct.push(' ')
      
      ct.push({
        layout: 'lightHorizontalLines', // optional
        table: {
          headerRows: 1,
          widths: [ 50, '*', 50, '*' ],

          body: [
            [ { text: 'ข้าพเจ้า ชื่อ ', fontSize: 16 }, 
            { text: 'มัทรียา', fontSize: 16,
              decoration: 'underline', 
              decorationStyle: 'dotted' }, 
            { text: 'นามสกุล ', fontSize: 16 }, 
            { text: 'ราชบัวศรี', fontSize: 16,
            decoration: 'underline', 
            decorationStyle: 'dotted' }
            ]
          ]
        }
      })

      // ct.push({
      //   columns: [
      //     { text: 'ข้าพเจ้า ชื่อ ', fontSize: 16 },
      //     { text: 'มัทรียา', fontSize: 16,
      //       decoration: 'underline', 
      //       decorationStyle: 'dotted' },
      //     { text: 'นามสกุล ', fontSize: 16 },
      //     { text: 'ราชบัวศรี', fontSize: 16,
      //       decoration: 'underline', 
      //       decorationStyle: 'dotted' }
      //   ]
      // })

      // ct.push({
      //   columns: [
      //     { text: 'ตำแหน่ง ', fontSize: 16 },
      //     { text: '[ ] อาจารย์/บุคลากร สังกัดหน่วยงาน ', fontSize: 16 }
      //   ]
      // })

      // ct.push({
      //   columns: [
      //     { text: '[ ] นิสิต รหัสประจำตัวนิสิต ', fontSize: 16 },
      //     { text: '65074519', fontSize: 16,
      //       decoration: 'underline', 
      //       decorationStyle: 'dotted' },
      //     { text: 'ภาควิชา ', fontSize: 16 },
      //     { text: 'วิศวกรรมไฟฟ้าและคอมพิวเตอร์, คณะวิศวกรรมศาสตร์', fontSize: 16,
      //       decoration: 'underline', 
      //       decorationStyle: 'dotted' }
      //   ]
      // })

      return ct;
    },
    getDate(){
      let dates = '3 เดือน พฤศจิกายน พ.ศ.2565'
      return dates;
    }
	}
}
</script>