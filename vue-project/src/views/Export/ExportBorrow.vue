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

      // this.borrowList((res) => {
      //   for(let i=0; res.length<2; i++){
      //     console.log(res[i])
      //   }
      // })

      this.addPage(doc);
    },
    addPage(doc){
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

      this.userData((res) => {
        ct.push({
          text: 'วันที่ ' + res.date,
          fontSize: 16,
          bold: true
        })
        ct.push({
          layout: 'noBorders',
          table: {
            widths: [ 70, '*', 50, '*' ],
            body: [
              [ 
                { text: 'ข้าพเจ้า ชื่อ ', 
                  fontSize: 16 ,
                  bold: true}, 
                { text: res.fname, fontSize: 16,
                  decoration: 'underline', 
                  decorationStyle: 'dotted' }, 
                { text: 'นามสกุล ', 
                  fontSize: 16,
                  bold: true }, 
                { text: res.lname, fontSize: 16,
                decoration: 'underline', 
                decorationStyle: 'dotted' }
              ]
            ]
          }
        })
      })

      this.userData((res) => {
        if(res.usertype === 'นักศึกษา'){
          ct.push({
            layout: 'noBorders',
            table: {
              widths: [ 70, '*', 50, '*' ],
              body: [
                [
                  { text: 'ตำแหน่ง ', 
                    fontSize: 16,
                    bold: true },
                  { text: '[ ] อาจารย์ / บุคลากร สังกัดหน่วยงาน ', fontSize: 16 },
                  { text:  ' ', colSpan:2, fontSize: 16}
                ],
                [
                  { text: ' '},
                  { text: '[*] นิสิต รหัสประจำตัวนิสิต ' + res.stuid, fontSize: 16 },
                  { text: res.department + ' ,' + res.faculty, 
                    fontSize: 16, colSpan:2,
                    decoration: 'underline', 
                    decorationStyle: 'dotted' }
                ]
              ]
            }
          })
        }else{
          ct.push({
            layout: 'noBorders',
            table: {
              widths: [ 70, '*', 50, '*' ],
              body: [
                [
                  { text: 'ตำแหน่ง ', 
                    fontSize: 16,
                    bold: true },
                  { text: '[*] อาจารย์ / บุคลากร สังกัดหน่วยงาน ', fontSize: 16 },
                  { text:  res.department + ' ,' + res.faculty,
                    colSpan:2, fontSize: 16,
                    decoration: 'underline', 
                    decorationStyle: 'dotted' }
                ],
                [
                  { text: ' '},
                  { text: '[ ] นิสิต รหัสประจำตัวนิสิต', fontSize: 16 },
                  { text: 'ภาควิชา ', fontSize: 16, colSpan:2}
                ]
              ]
            }
          })
        }
      })
      
      this.userData((res) => {
        ct.push({
          layout: 'noBorders',
          table: {
            widths: [ 70, '*', 50, '*' ],
            body: [
              [
                { text: ' '},
                { text: 'มีความประสงค์จะขอยืมวัสดุ หรือ ครุภัณฑ์ ของคณะวิศวกรรมศาสตร์ มหาวิทยาลัยนเรศวร เพื่อ', 
                  colSpan:3, fontSize: 16 },
              ],
              [
                { text: res.reason, fontSize: 16,
                  colSpan:4,
                  decoration: 'underline', 
                  decorationStyle: 'dotted' }
              ]
            ]
          }
        })
      })
      
      ct.push(' ')
      this.borrowList((res) => {
        res.forEach((doc) => {
          ct.push({
            columns: [
              {
                width: 75,
                text: 'รายการที่ '+ doc.id,
                fontSize: 16 , 
                bold: true
              },
              {
                width: 280,
                text: ' ชื่อ' + doc.name,
                fontSize: 16 , 
                decoration: 'underline', 
                decorationStyle: 'dotted'
              },
              {
                width: 30,
                text: 'ยี่ห้อ ',
                fontSize: 16, 
                bold: true
              },
              {
                width: 100,
                text: doc.brand,
                fontSize: 16 , 
                decoration: 'underline', 
                decorationStyle: 'dotted'
              }
            ]
          })

          ct.push({
            columns: [
              {
                width: 20,
                text: 'S/N ',
                fontSize: 16, 
                bold: true
              },
              {
                width: '*',
                text: doc.serial,
                fontSize: 16 , 
                decoration: 'underline', 
                decorationStyle: 'dotted'
              },
              {
                width: 100,
                text: 'เลขครุภัณฑ์ ',
                fontSize: 16, 
                bold: true
              },
              {
                width: '*',
                text: doc.item_code,
                fontSize: 16 , 
                decoration: 'underline', 
                decorationStyle: 'dotted'
              },
              {
                width: 100,
                text: 'จำนวน 1 ชิ้น',
                fontSize: 16
              }
            ]
          })
        })
      })
      
      ct.push(' ')
      ct.push(' ')
      this.userData((res) => {
        ct.push({
          text: 'ตามรายการที่ยืมนี้ ข้าพเจ้าจะรักษาเป็นอย่างดี หากเกิดการชำรุดเสียหาย สูญหาย หรืออยู่ในสภาพที่ไม่สะอาดเรียบร้อย ข้าพเจ้ายินดีรับผิดชอบโดยไม่มีเงื่อนไขใด ๆ ทั้งสิ้น',
          fontSize: 16,
          bold: true
        })

        ct.push(' ')
        ct.push(' ')
        ct.push({
          text: 'ลงชื่อ ...................................... ผู้ขอยืม',
          fontSize: 16
        })

        ct.push({
          text: '( '+ res.fname +' '+ res.lname +' )',
          fontSize: 16
        })
      })

      ct.push(' ')
      ct.push(' ')
      ct.push({
        columns: [
          {
            width: 320,
            text: 'ลงชื่อ ...................................... อาจารย์ (กรณ๊นิสิต เป็นผู้ยืม)',
            fontSize: 16
          },
          {
            width: '*',
            text: 'ลงชื่อ ...................................... ผู้อนุญาต',
            fontSize: 16
          }
        ]
      })

      ct.push({
        columns: [
          {
            width: 320,
            text: '(                                     )',
            fontSize: 16
          },
          {
            width: '*',
            text: '(  ผศ.ดร.อัครพันธ์ วงศ์กังแห  )',
            fontSize: 16
          }
        ]
      })

      ct.push(' ')
      ct.push({
        text: 'การรับและคืน',
        fontSize: 16,
        bold: true
      })

      ct.push(' ')
      ct.push({
        table: {
          headerRows: 1,
          widths: [ 50, 199, 199,50 ],
          body: [
            [ 
              { text: 'รายการที่', fontSize: 15,
                alignment: 'center', bold: true,
                fillColor: '#D1F2EB' }, 
              { text: 'การรับของ', fontSize: 15, 
                alignment: 'center', bold: true, 
                fillColor: '#D1F2EB' },
              { text: 'การคืนของ', fontSize: 15, 
                alignment: 'center', bold: true, 
                fillColor: '#D1F2EB' },
              { text: 'QR Code', fontSize: 15, 
                alignment: 'center', bold: true, 
                fillColor: '#D1F2EB' }
            ]
          ]
        }
      })

      this.borrowList((res) => {
        res.forEach((doc) => {
          ct.push({
            table: {
              widths: [ 50, 50, 140, 50, 140, 50 ],
              body: [
                [
                  { text: doc.id, alignment: 'center', fontSize: 15, rowSpan:2 },
                  { text: 'วันที่รับ', alignment: 'center', fontSize: 15, rowSpan:2 }, 
                  { text: 'ลงชื่อ.............................ผู้รับของ', fontSize: 15 }, 
                  { text: 'วันที่คืน',alignment: 'center', fontSize: 15, rowSpan:2 }, 
                  { text: 'ลงชื่อ.............................ผู้ส่งคืน', fontSize: 15 },
                  { qr: doc.item_code, fit: '45', alignment: 'center', rowSpan:2 }
                ],
                [
                  {},
                  {},
                  { text: 'ลงชื่อ.............................ผู้จ่ายของ', fontSize: 15 },
                  {},
                  { text: 'ลงชื่อ.............................ผู้รับคืน', fontSize: 15 },
                  {}
                ]
              ]
            }
          })
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
    }
	}
}
</script>