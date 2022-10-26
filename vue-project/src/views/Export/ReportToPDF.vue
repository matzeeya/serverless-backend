<template>
  <div>
    <div id="html">
      <h1>Hello World!! สวัสดี</h1>
        <center>
          <img width='400' src='https://i.ytimg.com/vi/1Ne1hqOXKKI/maxresdefault.jpg' />
        </center>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf';

export default {
  mounted() {
    this.exportPDF()
  },
  methods: {
		exportPDF() {
      var pdf = new jsPDF('p', 'pt', 'a4');
      const content = document.getElementById('html').innerHTML;
      pdf.html(content, {
        callback: function (pdf) {
          pdf.save('mypdf.pdf');
        }
      }); 
    }
	}
}
</script>