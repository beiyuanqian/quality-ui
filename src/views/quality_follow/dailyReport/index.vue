<template>
  <div class="app-container">
    <el-form :model="form" inline>
      <el-form-item label="质量问题单日期" prop="create_datetime">
        <el-date-picker v-model="form.create_datetime" clearable type="date" format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        style="width: 188px" size="small" :picker-options="pickerOptions"
                        placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <div id="main" style="height: 400px;margin-top: 20px;margin-left: 20px;margin-right: 20px">
      <v-chart class='char' :option="option1" style="width: 100%;height: 100%"></v-chart>
    </div>
    <div style="height: 400px;margin-top: 20px;margin-left: 20px;margin-right: 20px">
      <v-chart class='char' :option="option2" style="width: 100%;height: 100%"></v-chart>
    </div>
  </div>
  <!--<div id="main" style="height: 400px;margin-top: 20px;margin-left: 20px;margin-right: 20px">
    <v-chart class='char' :option="option" style="width: 100%;height: 100%"></v-chart>
  </div>-->
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        //form
        form: {
          create_datetime: undefined
        },
        //日期禁用
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        option1: {
          //设置绘图网格范围
          grid: {
            left: '1%',
            right: '1%',
            bottom: '3%',
            containLabel: true
          },
          //标题和副标题
          title: {
            text: '科室质量问题维护情况',
            subtext: '日期时间'
          },
          //设置数据类型颜色图标
          legend: {
            data: ['未维护进度问题', '新增问题', '新关闭问题']
          },
          //工具栏
          toolbox: {
            feature: {
              //显示类型切换
              magicType: {
                show: true,
                type: ['line', 'bar', 'stack', 'tiled']
              },
              //数据视图
              dataView: {},
              //保存成图片
              saveAsImage: {show: true},
              //还原
              restore: {show: true}
            }
          },
          //触发提示
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          //横坐标轴
          xAxis: [
            {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              //设置横坐标为剧中显示
              /* axisTick: {
                 alignWithLabel: true
               }*/
            },
          ],
          //竖坐标轴
          yAxis: {
            type: 'value'
          },
          //数据
          series: [
            {
              name: '未维护进度问题',
              data: [120, 200, 150, 80, 70, 110, 130],
              type: 'bar',
              stack: '总数',
              //是否在图形主体上显示数据
              label: {
                show: true
              }
            },
            {
              name: '新增问题',
              data: [80, 70, 110, 130, 120, 200, 150],
              type: 'bar',
              stack: '总数',
              label: {
                show: true
              }
            },
            {
              name: '新关闭问题',
              data: [80, 70, 110, 130, 120, 200, 150],
              type: 'bar',
              stack: '总数',
              label: {
                show: true
              }
            }
          ]
        },
        option2: {
          //设置绘图网格范围
          grid: {
            left: '1%',
            right: '1%',
            bottom: '3%',
            containLabel: true
          },
          //标题和副标题
          title: {
            text: '科室质量问题单数情况',
            subtext: '日期时间'
          },
          //设置数据类型颜色图标
          legend: {
            data: ['已关闭问题数', '未关闭问题数', '问题总数']
          },
          //工具栏
          toolbox: {
            feature: {
              //显示类型切换
              magicType: {
                show: true,
                type: ['line', 'bar', 'stack', 'tiled']
              },
              //数据视图
              dataView: {},
              //保存成图片
              saveAsImage: {show: true},
              //还原
              restore: {show: true}
            }
          },
          //触发提示
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          //横坐标轴
          xAxis: [
            {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              //设置横坐标为剧中显示
              /* axisTick: {
                 alignWithLabel: true
               }*/
            },
          ],
          //竖坐标轴
          yAxis: {
            type: 'value'
          },
          //数据
          series: [
            {
              name: '已关闭问题数',
              data: [80, 200, 150, 80, 70, 110, 130],
              type: 'bar',
              stack: '总数',
              //是否在图形主体上显示数据
              label: {
                show: true
              }
            },
            {
              name: '未关闭问题数',
              data: [80, 70, 110, 130, 120, 200, 150],
              type: 'bar',
              stack: '总数',
              label: {
                show: true
              }
            },
            {
              name: '问题总数',
              data: [160, 270, 260, 210, 190, 310, 280],
              type: 'line',
              label: {
                show: true
              }
            }
          ]
        },
      }
    },
    created() {
    },
    methods: {},
    mounted() {
    }
  }
</script>

<style scoped>

</style>
