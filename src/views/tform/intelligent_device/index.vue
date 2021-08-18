<template>
  <div class="app-container">
    <el-card shadow="always">
      <div slot="header" class="clearfix">
        <h1>智能设备or控制器项目测试申请单</h1>
        <p style="line-height: 0;font-size: smaller;color: red">（注：项目如有涉及APP端、WEB端、小程序、PC软件的请按对应模板一并填写多个送测单）
          申请日期：
          <el-date-picker v-model="form.occur_time" clearable type="date" placeholder="选择日期" size="small"></el-date-picker>
        <el-button style="float: right" type="primary" @click="submitForm">确 定</el-button>
        <el-button style="float: right" @click="resetForm('form')">取 消</el-button>
        </p>
      </div>
      <el-form ref="form" :model="form" :rules="rules"  :label-position="labelPosition" label-width="250px" inline>
        <el-row>
          <el-col>
            <el-form-item label="测试项目" prop="project_name" class="p1">
              <el-input v-model="form.project_name" placeholder="请输入测试项目" style="width: 450px"></el-input>
            </el-form-item>
            <el-form-item label="确认人" prop="people">
              <el-input v-model="form.project_people" placeholder="请输入确认人" style="width: 450px"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="测试方式" prop="test_way">
              <el-radio v-model="form.test_way" label="1">常规测试</el-radio>
              <el-radio v-model="form.test_way" label="2">迭代测试</el-radio>
              （需附上系统完整需求文档，本轮迭代内容需在需求文档额外标注清楚）
            </el-form-item>
          </el-col>
          <el-col v-if="form.test_way==2">
            <el-form-item label="迭代内容" prop="iteration_content">
              <el-input type="textarea" style="width: 690px" :autosize="{minRows: 1}" v-model="form.iteration_content"
                        placeholder="请输入迭代内容，例：（1）。。。（2）。。。（3）。。。"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="需求文档说明书">
              <el-upload class="upload-demo" ref="upload" :file-list="fileList" :http-request="requestUpload"
                         :on-preview="handlePreview" :on-remove="handleRemove" :auto-upload="false" action="">
                <template #trigger>
                  <el-button size="small" type="primary">选取文件</el-button>
                </template>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器
                </el-button>
                <!--el-input v-model="form.attachment" type="hidden"></el-input>
                <el-input v-model="form.attachmentName" type="hidden"></el-input-->
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="需求规格说明书PLM编号" prop="specification_number">
              <el-input v-model="form.specification_number" placeholder="请输入需求规格说明书PLM编号"
                        style="width: 450px"></el-input>
            </el-form-item>
            <el-form-item label="用户使用手册PLM编号" prop="user_manual_number">
              <el-input v-model="form.user_manual_number" placeholder="请输入用户使用手册PLM编号" style="width: 450px"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="用户使用手册" prop="private_report">
              <el-upload class="upload-demo" ref="upload" :file-list="fileList" :http-request="requestUpload"
                         :on-preview="handlePreview" :on-remove="handleRemove" :auto-upload="false" action="">
                <template #trigger>
                  <el-button size="small" type="primary">选取文件</el-button>
                </template>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器
                </el-button>
                <el-input v-model="form.private_report" type="hidden"></el-input>
                <el-input v-model="form.private_report" type="hidden"></el-input>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="项目编号" prop="project_number">
              <el-input v-model="form.project_number" placeholder="请输入项目编号" style="width: 450px"></el-input>
            </el-form-item>
            <el-form-item label="项目（产品）负责人" prop="project_person">
              <el-input v-model="form.project_person" placeholder="请输入项目（产品）负责人" style="width: 450px"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="项目bug管理地址" prop="project_bug_address">
              <el-input v-model="form.project_bug_address" placeholder="请输入项目bug管理地址" style="width: 450px"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="内测报告" prop="private_report">
              <el-upload class="upload-demo" ref="upload" :file-list="fileList" :http-request="requestUpload"
                         :on-preview="handlePreview" :on-remove="handleRemove" :auto-upload="false" action="">
                <template #trigger>
                  <el-button size="small" type="primary">选取文件</el-button>
                </template>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器
                </el-button>
                <el-input v-model="form.private_report" type="hidden"></el-input>
                <el-input v-model="form.private_report" type="hidden"></el-input>
              </el-upload>
            </el-form-item>
          </el-col>
          <h3>控制器以及嵌入程序送测信息</h3>
          <el-col>
            <el-form-item label="控制器型号及编码" prop="system_name_version_number">
              <el-input v-model="form.system_name_version_number" placeholder="例：TS008 30001406xxxx" style="width: 480px"></el-input>
              <p style="color: #CCC;margin: 0"></p>
            </el-form-item>
            <el-form-item label="程序名称及编码" prop="user_password">
              <el-input v-model="form.user_password" placeholder="例:app_MP_sdk#####_1.0.2.0_2a83aca8-806b310dfb5193c85a51da7fa05dxxxx.bin" style="width: 570px"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="PCB版本" prop="supporting_facility">
              <el-input v-model="form.supporting_facility" placeholder="例：V1.0" style="width: 480px"></el-input>
            </el-form-item>
            <el-form-item label="校验码" prop="project_system_address">
              <el-input v-model="form.project_system_address" placeholder="例：2a83aca8-806b310dfb5193c85a51da7fa05dxxxx" style="width: 570px"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="字节数" prop="database_type_address">
              <el-input v-model="form.database_type_address" placeholder="例：20KB" style="width: 480px"></el-input>
            </el-form-item>
            <el-form-item label="修改时间" prop="database_user_password">
              <!--el-input v-model="form.database_user_password" placeholder="请输入修改时间" style="width: 570px"></el-input-->
              <el-date-picker v-model="form.database_user_password" clearable type="date" placeholder="选择日期" style="width: 570px"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="芯片型号及编码" prop="computer_version">
              <el-input v-model="form.computer_version" placeholder="例：IC RTL8762C36000106xxxx" style="width: 480px"></el-input>
            </el-form-item>
            <el-form-item label="烧写器及所选芯片型号" prop="project_server_address">
              <el-input v-model="form.project_server_address" placeholder="例：USB转TTLPLxxxx" style="width: 570px"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="送测程序容量大小" prop="monitoring_point">
              <el-input v-model="form.monitoring_point" placeholder="请输入送测程序容量大小" style="width: 480px"></el-input>
            </el-form-item>
            <el-form-item label="芯片DATASHEET容量大小" prop="database_summary_design">
              <el-input v-model="form.database_summary_design" placeholder="例：160KB SRAM" style="width: 570px"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="通讯协议" prop="database_summary_design_attachment">
              <el-upload class="upload-demo" ref="upload" :file-list="fileList" :http-request="requestUpload"
                         :on-preview="handlePreview" :on-remove="handleRemove" :auto-upload="false" action="">
                <template #trigger>
                  <el-button size="small" type="primary">选取文件</el-button>
                </template>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                <el-input v-model="form.database_summary_design_attachment" type="hidden"></el-input>
                <el-input v-model="form.database_summary_design_attachment" type="hidden"></el-input>
              </el-upload>
            </el-form-item>
          </el-col>
          <h3>物料清单bom表</h3>
          <el-col>
            <el-button type="primary" @click="addRow(infiledList)">添加一行</el-button>
            <el-table :data="tableData" style="width: 100%" fit highlight-current-row>
              <el-table-column prop="" label="序号" width="50" align="center">
                <template slot-scope="scope">
                  {{scope.$index + 1}}
                </template>
              </el-table-column>
              <el-table-column prop="wuliaocode" label="物料代码" >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.wuliaocode" size="small"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="gongsicode" label="公司编码">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.gongsicode" size="small"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="partname" label="零部件名称">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.partname" size="small"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="number" label="单机净数量" width="90px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.number" size="small"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="demand" label="需求" width="90px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.demand" size="small"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="schedule" label="进度">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.schedule" size="small"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="gongsi" label="厂家">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.gongsi" size="small"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remark" size="small" type="textarea" :autosize="{minRows: 1}"></el-input>
                </template>
              </el-table-column>
              <el-table-column  label="操作" width="80px">
                <template slot-scope="scope">
                  <el-button @click="handleDelete(scope.$index)" type="text" size="mini" icon="el-icon-delete">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col>
            <div style="background-color: #F3F3F3;font-size: small;color:#7E7E7E">
              <p style="margin: 0">注：1.带*的选项默认必填，如有特殊情况，请备注说明；</p>
              <p style="margin: 0;text-indent: 2em">2.数据库类型/数据库地址：当部署在集群上时，请提供测试账户和密码；</p>
              <p style="margin: 0;text-indent: 2em">3.是否涉及UI界面测试：若需要检测实际应用系统是否符合原型UI设计，请附上UI设计文件。目前送测项目都要求加上联云logo,会验证使用规范与否；</p>
              <p style="margin: 0;text-indent: 2em">注： 软件功能项目列表是填写委托方被测软件所具有的功能模块及这些功能模块的功能说明，可根据需要可以列出1~3级子功能，并对最后一级功能做出功能说明（最后一级每条功能必须对应一条功能说明），填写格式参照下方的“应用软件产品功能列表（填写示范）”。</p>
              <p style="margin-top: 0;text-indent: 2em">※： 功能列表上所列出来的功能必须是可以实现或演示的，如果不能演示或实现，请不要列上来，并且功能在用户手册上都要有详细的操作说明。</p>
            </div>
          </el-col>
          <h3>功能测试列表（罗列功能点，注：软件功能项目列表根据需要可以列出1~3级子功能。）</h3>
          <el-col>
            <el-form-item label="产品名称" prop="product_name">
              <el-input v-model="form.product_name" placeholder="请输入产品名称" style="width: 450px"></el-input>
            </el-form-item>
            <el-form-item label="总功能数" prop="function_number">
              <el-input v-model="form.function_number" placeholder="(以“功能说明”的数量为统计个数的依据)" style="width: 450px"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-row v-for="(item, index) in courseInfo.daysArray">
              <el-col>
                <el-form-item label="功能说明" prop="function_declaration">
                  <el-input v-model="form.function_declaration" placeholder="软件功能项目" style="width: 215px"></el-input>
                  <span> - </span>
                </el-form-item>
                <el-form-item prop="subfunction">
                  <el-input v-model="form.subfunction" placeholder="子功能" style="width: 235px"></el-input>
                  <span> - </span>
                </el-form-item>
                <el-form-item prop="function_description">
                  <el-input v-model="form.function_description" placeholder="功能说明" style="width: 690px"></el-input>
                </el-form-item>
                <el-button v-if="index!=0" style="margin-left: 5px" icon="el-icon-delete" @click="delDays(index)"></el-button>
                <el-button v-if="index == 0" style="margin-left: 5px" icon="el-icon-document-add" @click="addDays()"></el-button>
              </el-col>
            </el-row>
          </el-col>

          <!--功能示范列表-->
          <el-col>
            <table>
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
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import {addSaveFile} from "@/api/vadmin/system/savefile";
    export default {
      name: "software",
      data(){
        return{
          infiledList:[],
          courseInfo:{
            daysArray:[{}]
          },
          tableData:[
            {wuliaocode:'305333',gongsicode:'200182060019',partname:'3M胶',number:'0.005',demand:'15',schedule:'总部调拨',gongsi:'xxx',remark:''},
          ],
          tableDetail: [],
          //新增一行
          add:[],
          //对齐方式
          labelPosition: 'right',
          form:{
            project_name:undefined,
            project_people:undefined,
            test_way:'2',
            iteration_content:undefined,
            specification_number:undefined,
            user_manual_number:undefined,
            project_number:undefined,
            project_bug_address:undefined,
            project_person:undefined,
            private_report:undefined,
            system_name_version_number:undefined,
            user_password:undefined,
            supporting_facility:undefined,
            project_system_address:undefined,
            database_type_address:undefined,
            database_user_password:undefined,
            computer_version:undefined,
            project_server_address:undefined,
            monitoring_point:undefined,
            database_summary_design:undefined,
            database_summary_design_attachment:undefined,
            a:"2",
            aaa:"2",
            sample:undefined,
            response_time:undefined,
            test_index:undefined,
            ui:"1",
            product_name:undefined,
            function_number:undefined,
            function_declaration:undefined,
            subfunction:undefined,
            function_description:undefined,
          },
          // 表单校验
          rules: {
            occur_time:[{required: true, message: '请选择申请日期', trigger: 'change'}],
            project_name:[{required: true, message: '请输入测试项目', trigger: 'change'}],
            project_people:[{required: true, message: '请输入确认人', trigger: 'change'}],
            test_way: [{required: true, message: '请选择测试方式', trigger: 'change'}],
            specification_number:[{required: true, message: '请输入需求规格说明书PLM编号', trigger: 'change'}],
            user_manual_number:[{required: true, message: '请输入用户使用手册PLM编号', trigger: 'change'}],
            project_number:[{required: true, message: '请输入项目编号', trigger: 'change'}],
            project_bug_address:[{required: true, message: '请输入项目bug管理地址', trigger: 'change'}],
            project_person:[{required: true, message: '请输入项目（产品）负责人', trigger: 'change'}],
            private_report:[{required: true, message: '请上传内测报告', trigger: 'change'}],
            system_name_version_number:[{required: true, message: '请输入系统名称及版本号', trigger: 'change'}],
            user_password:[{required: true, message: '请输入测试账户与密码', trigger: 'change'}],
            supporting_facility:[{required: true, message: '请输入配套设施', trigger: 'change'}],
            project_system_address:[{required: true, message: '请输入应用系统访问网址', trigger: 'change'}],
            database_type_address:[{required: true, message: '请输入数据库类型/地址', trigger: 'change'}],
            database_user_password:[{required: true, message: '请输入所连数据库名称/账号、密码', trigger: 'change'}],
            computer_version:[{required: true, message: '请输入电脑版本（兼容的pc系统）', trigger: 'change'}],
            project_server_address:[{required: true, message: '请输入应用服务器访问网址', trigger: 'change'}],
            monitoring_point:[{required: true, message: '请选择是否接入异常监测埋点', trigger: 'change'}],
            database_summary_design:[{required: true, message: '请选择数据库概要设计', trigger: 'change'}],
            a:[{required: true, message: '请选择是否涉及性能测试', trigger: 'change'}],
            product_name:[{required: true, message: '请输入产品名称', trigger: 'change'}],
            function_number:[{required: true, message: '请输入总功能数', trigger: 'change'}],
            function_declaration:[{required: true, message: '请输入软件功能项目', trigger: 'change'}],
            subfunction:[{required: true, message: '请输入子功能', trigger: 'change'}],
            function_description:[{required: true, message: '请输入功能说明', trigger: 'change'}],
          }
        }
      },
      methods:{
        // bom表添加一行
        addRow(tableData,event){
          this.tableData.push({
            wuliaocode:'',
            gongsicode:'',
            partname:'',
            number:'',
            demand:'',
            schedule:'',
            gongsi:'',
            remark:''
          })
        },
        //bom表删除一行
        handleDelete(index) {
          this.tableData.splice(index, 1)
        },
        //功能新增一行
        addDays() {
          this.courseInfo.daysArray.push({});
        },
        //功能删除新增行
        delDays(index){
          this.courseInfo.daysArray.splice(index, 1);
        },
        //附件上传校验
        beforeUpload(file) {
          const testFile = file.name.substring(file.name.lastIndexOf('.') + 1);
          //限制文件格式
          const type = (testFile === 'zip') || (testFile === 'rar') || (testFile === '7z') || (testFile === 'png') ||
            (testFile === 'jpeg') || (testFile === 'bmp') || (testFile === 'jpg') || (testFile === 'docx') || (testFile === 'xlsx')
            || (testFile === 'doc') || (testFile === 'xls') || (testFile === 'pptx') || (testFile === 'pdf') || (testFile === 'msg');
          //限制文件大小
          const size = file.size / 1024 / 1024 < 10;
          if (!type) {
            this.msgError('文件只能是zip,rar,7z,png,jpeg,bmp,jpg,docx,xlsx,doc,xls,pptx,pdf,msg格式!');
          }
          if (!size) {
            this.msgWarning('文件大小不能超过10MB');
          }
          return type && size;
        },
        // 文件上传钩子
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        handlePreview(file) {
          console.log(file);
        },
        // 自定义文件上传
        requestUpload(param) {
          let formData = new FormData();
          formData.append("file", param.file);
          addSaveFile(formData).then(response => {
            this.form.attachment = response.data.id;
            this.form.attachmentName = response.data.name;
            if (response.msg === 'success') {
              this.msgSuccess('上传成功!');
            } else {
              this.msgError('上传失败!')
            }
          })
        },
        //文件上传提交
        submitUpload() {
          this.$refs.upload.submit();
        },
        //提交表单
        submitForm(){

        },
        //取消提交，重置页面内容
        resetForm(form) {
          this.$refs[form].resetFields();
        },
      }
    }

</script>

<style scoped>
  table{border-collapse: collapse;table-layout: fixed;width: 100%}
  caption{font-size: 35px}
  .p1{}
  .p2{font-size: 15px;color: red;}
  td {text-align:left;font-size: 15px;border:solid 1px;column-width: 100px;height:40px}
</style>
