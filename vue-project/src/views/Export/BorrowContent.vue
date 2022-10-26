<template>
  <div>
    <div id="html">
        <!-- <center>
          <img width='400' src='https://i.ytimg.com/vi/1Ne1hqOXKKI/maxresdefault.jpg' />
        </center> -->
        <h1>Hello World!! สวัสดี</h1>
    </div>
    <button @click="exportPDF">Download PDF</button>
  </div>
</template>

<script>
// import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import THSarabunPSK from '../../assets/fonts/THSarabunPSK.ttf';

export default {
  methods: {
		exportPDF() {
      var pdf = new jsPDF('p', 'pt', 'a4');
      const content = document.getElementById('html').innerHTML;
      pdf.addFileToVFS("THSarabunPSK.ttf", THSarabunPSK);
      pdf.addFont("THSarabunPSK.ttf", "THSarabunPSK", "normal");
      pdf.setFont("THSarabunPSK");
      pdf.html(content, {
        callback: function (pdf) {
          pdf.save('mypdf.pdf')
        }
      }); 
    }
	}
}
</script>