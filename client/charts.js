$(document).ready(function () {
  setSalaryChart();
});

function setSalaryChart() {
  const salaryChart = echarts.init(document.querySelector('#salary-chart'));

  const option = {
    baseOption: {
      title: {
        text: '前端职位薪水',
        left: 'center'
      },
      legend: {
        data: ['1年', '1-3年', '3-5年', '5-10年', '10年+'],
        right: 'right',
        top: '5%'
      },
      timeline: {
        data: ["彭州市", "都江堰市", "青白江区", "崇州市", "大邑县", "蒲江县", "简阳市", "金堂县", "新津县", "邛崃市", "青羊区", "温江区", "金牛区", "双流区", "武侯区", "郫都区", "新都区", "龙泉驿区", "成华区", "锦江区"],
        axisType: 'category',
        autoPlay: true
      },
      grid: {
        bottom: 80,
      },
      yAxis: {
        name: '月薪',
        data: ["5K-", "5-10K", "10-15K", "15-20K", "20-25K", "25-30K", '30K+', '面议']
      },
      xAxis: {
        name: '数量'
      },
      media: [
        // query 1
        {
          query: {
            maxAspectRatio: 1
          },
          option: {

            grid: {
              // left: 'center',
              top: '100',
              width: '80%',
              height: '60%'
            },
            legend: {
              left: '0',
              top: '6%',
              orient: 'horizontal'
            },
            timeline: {
              left: '10%',
              bottom: 0
            }

          }
        },
        //query 2
        {
          query: {
            minAspectRatio: 1
          },
          option: {
            grid: {
              left: 'center',
              top: 130,
              width: '60%',
              height: '60%'

            },
            legend: {
              right: '20%'
            },
            timeline: {
              bottom: 30
            }
          }
        }
      ],
      series: [
        {
          name: '1年',
          type: 'bar',
          stack: '1'

        },
        {
          name: '1-3年',
          type: 'bar',
          stack: '1'

        },

        {
          name: '3-5年',
          type: 'bar',
          stack: '1'

        },
        {
          name: '5-10年',
          type: 'bar',
          stack: '1'

        },
        {
          name: '10年+',
          type: 'bar',
          stack: '1'
        }]
    },
    options: [
      {
        "title": {"text": "彭州市"},
        "series": [
          {"data": [35, 289, 278, 259, 204, 71, 101, 120]},
          {"data": [3, 183, 323, 373, 261, 161, 272, 220]},
          {"data": [3, 18, 97, 207, 194, 139, 281, 112]},
          {"data": [2, 0, 6, 37, 52, 37, 124, 32]},
          {"data": [0, 0, 0, 0, 0, 0, 0, 1]}]
      },
      {
        "title": {"text": "金牛区"},
        "series": [{"data": [35, 289, 278, 259, 204, 71, 101, 120]},
          {"data": [3, 183, 323, 373, 261, 161, 272, 220]},
          {"data": [3, 18, 97, 207, 194, 139, 281, 112]},
          {"data": [2, 0, 6, 37, 52, 37, 124, 32]},
          {"data": [0, 0, 0, 0, 0, 0, 0, 1]}]
      }
    ]
  };

  salaryChart.setOption(option);
}
