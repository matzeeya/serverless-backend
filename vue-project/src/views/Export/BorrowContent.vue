<template>
  <div id='app' ref='document'>
    <div id='element-to-convert'>
      <center>
        <img width='400' src='https://i.ytimg.com/vi/1Ne1hqOXKKI/maxresdefault.jpg' />
      </center>
    </div>  
    <button @click='exportToPDF'>Export to PDF</button>
  </div>
</template>

<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" 
  integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==" 
  crossorigin="anonymous" referrerpolicy="no-referrer">
</script>
<script>
export default {
  methods: {
		exportToPDF() {
			html2pdf(document.getElementById('element-to-convert'));
		}
	}
}
</script>