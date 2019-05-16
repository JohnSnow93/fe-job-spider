$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "/charts",
    dataType: "json",
    success: function(res){
      console.log(res);
      setSalaryChart(res);
    }
  });

});

function setSalaryChart(option) {
  const salaryChart = echarts.init(document.querySelector('#salary-chart'));
  salaryChart.setOption(option);
}
