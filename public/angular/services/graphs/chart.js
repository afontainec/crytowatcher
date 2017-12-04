/* eslint-disable */

services

  .service('chartOptions', function() {

  this.byDaySerie = {
      name: 'Name',
      type: 'line',
      smooth: true,
      symbol: 'emptyCircle',
      symbolSize: 3,
      data: [11, 11, 15, 13, 12, 13, 10],
      markPoint: {
        data: [{
          type: 'max',
          name: 'Cantidad'
        }, ]
      },
      markLine: {
        data: [{
          type: 'average',
          name: 'Average'
        }]
      }
    };

  this.byDay = {

    color: [
      '#2ec7c9', '#b6a2de', '#0cc2aa', '#6887ff', '#F0805A',
      '#6cc788', '#f44455', '#97b552', '#95706d', '#dc69aa',
      '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
      '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089', '#f77a99'
    ],

    title: {
      textStyle: {
        fontWeight: 'normal',
        color: '#008acd'
      }
    },

    legend: {
      textStyle: {
        color: '#aaa'
      },
      data: []
    },



    toolbox: {
      color: ['#1e90ff', '#1e90ff', '#1e90ff', '#1e90ff'],
      effectiveColor: '#ff4500'
    },

    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,1)',
      padding: [10, 15, 10, 15],
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#008acd'
        },
        crossStyle: {
          color: '#008acd'
        },
        shadowStyle: {
          color: 'rgba(120,120,120,0.1)'
        }
      }
    },

    dataZoom: {
      dataBackgroundColor: 'rgba(120,120,120,0.1)',
      fillerColor: 'rgba(120,120,120,0.05)',
      handleColor: '#ccc'
    },

    grid: {
      x: 40,
      y: 60,
      x2: 40,
      y2: 60
    },


    textStyle: {
      fontFamily: 'Arial, Verdana, sans-serif'
    },

    calculable: true,
    xAxis: [{
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: {
        lineStyle: {
          color: '#008acd'
        }
      },
      axisLabel: {
        textStyle: {
          color: '#ccc'
        }
      },
      splitLine: {
        lineStyle: {
          color: ['rgba(120,120,120,0.1)']
        }
      }

    }],
    yAxis: [{
      type: 'value',
      // min: 290000,
      // max: 315000,
      // splitNumber: 8,
      splitNumber: 5,
      axisLine: {
        lineStyle: {
          color: '#008acd'
        }
      },
      axisLabel: {
        margin: 3,


        textStyle: {
          color: '#ccc',
          fontSize: '4px'
        }
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(250,250,250,0)', 'rgba(200,200,200,0.05)']
        }
      },
      splitLine: {
        lineStyle: {
          color: ['rgba(120,120,120,0.1)']
        }
      }
    }],
    series: [ ]
  };

this.byHourSerie = {
    itemStyle: {
        normal: {
            barBorderRadius: 5
        },
        emphasis: {
            barBorderRadius: 5
        }
    },
  name: 'Cantidad',
  type: 'bar',
  data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
  markPoint: {
    data: [{
      type: 'max',
      name: 'Cantidad'
    }, ]
  },
  markLine: {
    data: [{
      type: 'average',
      name: 'Average'
    }]
  }
};

this.byHour = {

    color: [
      '#F0805A', '#9a7fd1', '#0cc2aa', '#6887ff', '#6cc788',
      '#f77a99', '#f44455', '#97b552', '#95706d', '#dc69aa',
      '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
      '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
    ],

    title: {
      textStyle: {
        fontWeight: 'normal',
        color: '#008acd'
      }
    },

    legend: {
      textStyle: {
        color: '#aaa'
      },
      data: ["Cantidad"]
    },



    toolbox: {
      color: ['#1e90ff', '#1e90ff', '#1e90ff', '#1e90ff'],
      effectiveColor: '#ff4500'
    },

    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,1)',
      padding: [10, 15, 10, 15],
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#008acd'
        },
        crossStyle: {
          color: '#008acd'
        },
        shadowStyle: {
          color: 'rgba(120,120,120,0.1)'
        }
      }
    },

    dataZoom: {
      dataBackgroundColor: 'rgba(120,120,120,0.1)',
      fillerColor: 'rgba(120,120,120,0.05)',
      handleColor: '#ccc'
    },

    grid: {
      x: 40,
      y: 60,
      x2: 40,
      y2: 60
    },


    textStyle: {
      fontFamily: 'Arial, Verdana, sans-serif'
    },

    calculable: true,
    xAxis: [{
    type : 'category',
      data : ['0:00','2:00','4:00','6:00','8:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00'],
      axisLine: {
        lineStyle: {
          color: '#008acd'
        }
      },
      axisLabel: {
        textStyle: {
          color: '#ccc'
        }
      },
      splitLine: {
        lineStyle: {
          color: ['rgba(120,120,120,0.1)']
        }
      }

    }],
    yAxis: [{
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#008acd'
        }
      },
      axisLabel: {
        textStyle: {
          color: '#ccc'
        }
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(250,250,250,0)', 'rgba(200,200,200,0.05)']
        }
      },
      splitLine: {
        lineStyle: {
          color: ['rgba(120,120,120,0.1)']
        }
      }
    }],
    series: []
  };
});
