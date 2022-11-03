<template>
  <div></div>
</template>

<script>
import pdfMake from 'pdfmake'
import pdfFonts from './../../assets/Thaifonts.js'

export default {
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
        text: 'วันที่ ',
        fontSize: 16
      })
      ct.push(' ')
      
      this.userData((res) => {
        ct.push({
          layout: 'lightHorizontalLines', // optional
          table: {
            headerRows: 1,
            widths: [ 50, '*', 50, '*' ],
            body: [
              [ 
                { text: 'ข้าพเจ้า ชื่อ ', fontSize: 16 }, 
                { text: res.fname, fontSize: 16,
                  decoration: 'underline', 
                  decorationStyle: 'dotted' }, 
                { text: 'นามสกุล ', fontSize: 16 }, 
                { text: res.lname, fontSize: 16,
                decoration: 'underline', 
                decorationStyle: 'dotted' }
              ]
            ]
          }
        })
      })
      

      return ct;
    },
    userData(callback){
      let data = JSON.parse(localStorage.getItem('userData'));
      callback(data)
    },
    borrowList(callback){
      let data = JSON.parse(localStorage.getItem('borrowList'));
      callback(data)
      // data.forEach((doc) => {
      //   console.log('doc ',doc);
      // });
    }
	}
}
</script>