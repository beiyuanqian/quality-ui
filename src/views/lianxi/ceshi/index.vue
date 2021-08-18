<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules">
      <el-row>
        <el-col :span="6"><div class="grid-content bg-purple" style="border-radius: 4px;min-height: 36px;"></div></el-col>
        <el-col :span="11">
          <div class="grid-content bg-purple" style="border-radius: 4px;min-height: 36px;font-size: 35px;text-align: center;">
            WEB项目测试申请单
          </div></el-col>
        <el-col :span="7"><div class="grid-content bg-purple" style="border-radius: 4px;min-height: 36px;"></div></el-col>
      </el-row>
      <el-row>
        <el-col :span="6"><div class="grid-content bg-purple" style="border-radius: 4px;min-height: 36px;"></div></el-col>
        <el-col :span="11">
          <div class="grid-content bg-purple" style="border-radius: 4px;min-height: 36px;text-align: center;color: red">
            （注：项目如有涉及APP端、控制器、小程序的请按对应模板一并填写多个送测单）
          </div></el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple" style="border-radius: 4px;min-height: 36px;text-align: center;color: red">
            申请日期：
            <el-date-picker v-model="form.occur_time" clearable type="date" placeholder="选择日期" size="small"></el-date-picker>
          </div>
        </el-col>
        <el-col :span="1"><div class="grid-content bg-purple" style="border-radius: 4px;min-height: 36px;"></div></el-col>
      </el-row>
      <table style="border-collapse: collapse;table-layout: fixed;width: 100%">
        <!--caption>
          <p style="line-height: 0">WEB项目测试申请单</p>
          <p style="line-height: 0;display: inline">
            <span class="p1">（注：项目如有涉及APP端、控制器、小程序的请按对应模板一并填写多个送测单）</span>
          </p>
          <p class="p2" style="line-height: 0;">
            <span>申请日期：
              <el-date-picker v-model="form.occur_time" clearable type="date" placeholder="选择日期"></el-date-picker>
            </span>
          </p>
        </caption-->
        <tr>
          <td colspan="2">测试项目</td>
          <td colspan="6" contentEditable="true">{{this.projectCode}}</td>
          <td colspan="2">确认人</td>
          <td colspan="2" contentEditable="true"></td>
        </tr>
        <tr>
          <td colspan="2">测试方式</td>
          <td colspan="10">
            <el-radio v-model="form.radio" label="1">常规测试</el-radio>
            <el-radio v-model="form.radio" label="2">迭代测试</el-radio>
            （需附上系统完整需求文档，本轮迭代内容需在需求文档额外标注清楚）
          </td>
        </tr>
        <tr>
          <td colspan="2">迭代内容</td>
          <td colspan="10" contentEditable="true"></td>
        </tr>
        <tr>
          <td colspan="2">需求规格说明书PLM编号</td>
          <td colspan="4" contentEditable="true"></td>
          <td colspan="2">用户使用手册PLM编号</td>
          <td colspan="4" contentEditable="true"></td>
        </tr>
        <tr>
          <td colspan="2">项目编号</td>
          <td colspan="4" contentEditable="true"></td>
          <td colspan="2">项目（产品）负责人</td>
          <td colspan="4" contentEditable="true"></td>
        </tr>
        <tr>
          <td colspan="2">项目bug管理地址</td>
          <td colspan="10" contentEditable="true"></td>
        </tr>
        <tr>
          <td colspan="2">内测报告</td>
          <td colspan="10" contentEditable="true"></td>
        </tr>
        <tr>
          <td colspan="12" style="text-align: center;background-color:#CCC">应用软件测试申请信息</td>
        </tr>
        <tr>
          <td colspan="2">系统名称及版本号</td>
          <td colspan="4" contentEditable="true"></td>
          <td colspan="2">测试账户与密码</td>
          <td colspan="4" contentEditable="true"></td>
        </tr>
        <tr>
          <td colspan="2">配套设施</td>
          <td colspan="4" contentEditable="true"></td>
          <td colspan="2">应用系统访问网址</td>
          <td colspan="4" contentEditable="true"></td>
        </tr>
        <tr>
          <td colspan="2">数据库类型/地址</td>
          <td colspan="4" contentEditable="true"></td>
          <td colspan="2">所连数据库名称/账号、密码</td>
          <td colspan="4" contentEditable="true"></td>
        </tr>
        <tr>
          <td colspan="2">浏览器（兼容的浏览器）</td>
          <td colspan="10" contentEditable="true"></td>
        </tr>
        <tr>
          <td colspan="2">电脑版本（兼容的pc系统）</td>
          <td colspan="4" contentEditable="true"></td>
          <td colspan="2">应用服务器部署地址</td>
          <td colspan="4" contentEditable="true"></td>
        </tr>
        <tr>
          <td rowspan="2" colspan="2">是否接入异常检测埋点</td>
          <td colspan="4">
            <el-radio v-model="form.type" label="1">涉及（请列出检测埋点信息）</el-radio>
            <div>
              <p style="margin: 0">例：（1）业务异常和未知异常捕捉，未知异常、业务异常、非法参数异常、资源不存在异常</p>
              <p style="margin: 0;text-indent: 2em">（2）月数据上传：每个月12号进行扫描上传（目前为了方便测试，测试环境设置每隔5分钟扫描一次进行上传）</p>
              <p style="margin: 0;text-indent: 2em">（3）......</p>
            </div>
          </td>
          <td rowspan="2" colspan="6" contentEditable="true"></td>
        </tr>
        <tr>
          <td colspan="4">
            <el-radio v-model="form.type" label="2">不涉及(备注原因)</el-radio>
          </td>
        </tr>
        <tr>
          <td rowspan="2" colspan="2">数据库概要设计（包括数据流向、数据字典、数据逻辑）</td>
          <td colspan="4">
            <el-radio v-model="form.a" label="1">已在需求文档里面体现</el-radio>
          </td>
          <td rowspan="2" colspan="2">数据库概要设计（附件）</td>
          <td rowspan="2" colspan="4" contentEditable="true">（请将数据库设计文档与送测单邮件附件一并提供）</td>
        </tr>
        <tr>
          <td colspan="4">
            <el-radio v-model="form.a" label="2">在此附上独立数据库概要设计（见右方）</el-radio>
          </td>
        </tr>
        <tr>
          <td rowspan="2" colspan="2">是否涉及性能测试</td>
          <td colspan="4">
            <el-radio v-model="form.b" label="1">涉及（给出具体的性能指标，见下方）</el-radio>
          </td>
          <td rowspan="2" colspan="2">是否按联云UI规范设计</td>
          <td colspan="4">
            <el-radio v-model="form.b" label="1">是（请邮件附上UI设计文件）</el-radio>
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <el-radio v-model="form.b" label="2">不涉及</el-radio>
          </td>
          <td colspan="4">
            <el-radio v-model="form.b" label="2">否（请邮件提供特殊申请单或特殊说明）</el-radio>
          </td>
        </tr>
        <tr>
          <td colspan="2">性能测试场景（或接口）</td>
          <td colspan="4">
            <div>
              <p style="margin: 0">例：（1）页面查看</p>
              <p style="margin: 0;text-indent: 2em">（2）页面搜索</p>
              <p style="margin: 0;text-indent: 2em">（3）混合场景</p>
              <p style="margin: 0;text-indent: 2em">（4）.....</p>
            </div>
          </td>
          <td colspan="2">性能测试并发数</td>
          <td colspan="4" contentEditable="true"></td>
        </tr>
        <tr>
          <td colspan="2">性能测试响应时间</td>
          <td colspan="4" contentEditable="true"></td>
          <td colspan="2">其他性能指标</td>
          <td colspan="4" contentEditable="true"></td>
        </tr>
        <tr>
          <td colspan="12">
            <div>
              <p style="margin: 0">注：1.带*的选项默认必填，如有特殊情况，请备注说明；</p>
              <p style="margin: 0;text-indent: 2em">2.数据库类型/数据库地址：当部署在集群上时，请提供测试账户和密码；</p>
              <p style="margin: 0;text-indent: 2em">3.是否涉及UI界面测试：若需要检测实际应用系统是否符合原型UI设计，请附上UI设计文件。目前送测项目都要求加上联云logo,会验证使用规范与否；</p>
              <p style="margin: 0;text-indent: 2em">注： 软件功能项目列表是填写委托方被测软件所具有的功能模块及这些功能模块的功能说明，可根据需要可以列出1~3级子功能，并对最后一级功能做出功能说明（最后一级每条功能必须对应一条功能说明），填写格式参照下方的“应用软件产品功能列表（填写示范）”。</p>
              <p style="margin: 0;text-indent: 2em">※： 功能列表上所列出来的功能必须是可以实现或演示的，如果不能演示或实现，请不要列上来，并且功能在用户手册上都要有详细的操作说明。</p>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="12">1.功能测试列表（罗列功能点）</td>
        </tr>
        <tr>
          <td colspan="4">产品名称</td>
          <td colspan="8" contentEditable="true"></td>
        </tr>
        <tr>
          <td colspan="4">总功能数</td>
          <td colspan="8">（以“功能说明”的数量为统计个数的依据）</td>
        </tr>
        <tr>
          <td colspan="4">软件功能项目</td>
          <td colspan="8">功能说明</td>
        </tr>
        <tr>
          <td colspan="2" contentEditable="true"></td>
          <td colspan="2" contentEditable="true"></td>
          <td colspan="8" contentEditable="true"></td>
        </tr>
        <tr>
          <td colspan="2" contentEditable="true"></td>
          <td colspan="2" contentEditable="true"></td>
          <td colspan="8" contentEditable="true"></td>
        </tr>
        <tr>
          <td colspan="2" contentEditable="true"></td>
          <td colspan="2" contentEditable="true"></td>
          <td colspan="8" contentEditable="true"></td>
        </tr>
        <tr>
          <td colspan="2" contentEditable="true"></td>
          <td colspan="2" contentEditable="true"></td>
          <td colspan="8" contentEditable="true"></td>
          <el-button class="add" @click="addL(add.length)" title="添加一行" style="cursor:pointer;">+</el-button>
        </tr>
        <tr v-for="(item,index) in add" :key="item.id">
          <td colspan="2" contentEditable="true"></td>
          <td colspan="2" contentEditable="true"></td>
          <td colspan="8" contentEditable="true"></td>
        </tr>
        <tr>
          <td colspan="12">注：软件功能项目列表根据需要可以列出1~3级子功能。</td>
        </tr>
        <tr>
          <td colspan="12" style="text-align: center;background-color:#CCC">应用软件产品功能列表（填写示范）</td>
        </tr>
        <tr style="background-color:#CCC">
          <td colspan="4">产品名称</td>
          <td colspan="8">中小学学校信息管理系统</td>
        </tr>
        <tr style="background-color:#CCC">
          <td colspan="4">功能数</td>
          <td colspan="8">（以“功能说明”的数量为统计个数的依据）</td>
        </tr>
        <tr style="background-color:#CCC">
          <td colspan="4">软件功能项目</td>
          <td colspan="8">功能说明</td>
        </tr>
        <tr style="background-color:#CCC">
          <td rowspan="5" colspan="2">设置</td>
          <td colspan="2">学校基本信息</td>
          <td colspan="8">设置学校基本信息和属性</td>
        </tr>
        <tr style="background-color:#CCC">
          <td colspan="2">年级设置</td>
          <td colspan="8">设置学校开设年级、学制等</td>
        </tr>
        <tr style="background-color:#CCC">
          <td colspan="2">班级设置</td>
          <td colspan="8">对班级进行编码，设置班级开班时间等基本属性</td>
        </tr>
        <tr style="background-color:#CCC">
          <td colspan="2">课程设置</td>
          <td colspan="8">对不同年级开设课程进行设置</td>
        </tr>
        <tr style="background-color:#CCC">
          <td colspan="2">系统参数设置</td>
          <td colspan="8">设置图片存放路径等参数</td>
        </tr>
        <tr style="background-color:#CCC">
          <td rowspan="6" colspan="2">学生信息管理</td>
          <td colspan="2">基本信息</td>
          <td colspan="8">记录学生基本信息、出生年月、家庭情况、和学籍变动情况</td>
        </tr>
        <tr style="background-color:#CCC">
          <td colspan="2">学籍档案</td>
          <td colspan="8">记录学生在校行为表现。包括奖励、处罚、考勤、考评，考试成绩等</td>
        </tr>
        <tr style="background-color:#CCC">
          <td colspan="2">毕业</td>
          <td colspan="8">对毕业生进行毕业处理，记录学生毕业去向等信息</td>
        </tr>
        <tr style="background-color:#CCC">
          <td colspan="2">学生调班</td>
          <td colspan="8">学生可在学校同年级或不同年级班间调整，并记录调班信息</td>
        </tr>
        <tr style="background-color:#CCC">
          <td colspan="2">重新分班</td>
          <td colspan="8">可选择按男女比例，按入学成绩、考试成绩，平均或集中分配到同年级各个不同的班</td>
        </tr>
        <tr style="background-color:#CCC">
          <td colspan="2">转学办理</td>
          <td colspan="8">对转出学生进行分类、办理转学手续，出具转学证明等</td>
        </tr>
        <tr style="background-color:#CCC">
          <td rowspan="3" colspan="2">学生考试成绩管理</td>
          <td colspan="2">考试成绩录入</td>
          <td colspan="8">录入学生各门课的考试成绩。</td>
        </tr>
        <tr style="background-color:#CCC">
          <td colspan="2">科目成绩统计</td>
          <td colspan="8">可统计各门课的最高分、最低分、平均分等，可按任课老师等条件进行比较</td>
        </tr>
        <tr style="background-color:#CCC">
          <td colspan="2">学生成绩统计</td>
          <td colspan="8">可统计出总分最高分、最低分、平均分；单科最高分、最低分、平均分等</td>
        </tr>
        <tr style="background-color:#CCC">
          <td rowspan="2" colspan="2">...</td>
          <td colspan="2">...</td>
          <td colspan="8">...</td>
        </tr>
        <tr style="background-color:#CCC">
          <td colspan="2">...</td>
          <td colspan="8">...</td>
        </tr>

      </table>
    </el-form>


    <div slot="footer" class="dialog-footer" style="text-align: center;padding-top: 10px;">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="resetForm('form')">取 消</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "software",
    data(){

      return{
        add:[],
        form:{
          projectCode: '',
          radio:'1',
          type:"2",
          a:"1",
          b:"1",
        },
        // 表单校验
        rules: {
          question_title:[{required: true, message: '请输入问题主题', trigger: 'change'}],
          radio: [{required: true, message: '请输入问题主题', trigger: 'change'}],
        }
      }
    },
    created(){

      //else{
        // 条件成立，则无须处理（也可以做一个提示）
        //this.$message.success('恭喜你，当前项目编号已经是“涵涵涵”了')
      //}

      // 赋值
      //this.projectCode = "涵涵涵"
    },
    methods:{
      //添加一行
      addL(i){
        this.add.push({})
        console.log("123")
      },
      //提交表单
      submitForm(){
        // 获取
        let get_value = this.projectCode

        //验证
        if(get_value === ""){
          // 条件不成立 设置值为自己需要的值
          this.$message.error('请填写')
          //this.projectCode = "涵涵涵"
        }
      },
      //取消提交，重置页面内容
      resetForm(form){

      }
    }
  }

</script>

<style scoped>
  /*caption{font-size: 35px}
  .p1{font-size: 15px;color: red;}
  .p2{font-size: 15px;color: red;}*/
  td {text-align:left;font-size: 15px;border:solid 1px;column-width: 100px;height:40px}
</style>
