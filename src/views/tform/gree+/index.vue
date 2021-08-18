<template>
  <div class="app-container">
    <el-card shadow="always">
      <div slot="header" class="clearfix">
        <h1>格力+智能单品项目测试申请单</h1>
        <p style="line-height: 0;font-size: smaller;color: red">
          申请日期：
          <el-date-picker v-model="form.occur_time" clearable type="date" placeholder="选择日期" size="small"></el-date-picker>
        <el-button style="float: right" type="primary" @click="submitForm">确 定</el-button>
        <el-button style="float: right" @click="resetForm('form')">取 消</el-button>
        </p>
      </div>
      <el-form ref="form" :model="form" :rules="rules" :inline="true" :label-position="labelPosition" label-width="250px">
        <el-row>
          <el-col>
            <el-form-item label="测试项目" prop="project_name" class="p1">
              <el-input v-model="form.project_name" placeholder="请输入测试项目" style="width: 450px"></el-input>
            </el-form-item>
            <el-form-item label="送测负责人" prop="people">
              <el-input v-model="form.project_people" placeholder="请输入送测负责人" style="width: 450px"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="产品整机负责人" prop="database_type_address">
              <el-input v-model="form.database_type_address" placeholder="请输入产品整机负责人" style="width: 450px"></el-input>
            </el-form-item>
            <el-form-item label="软件负责人" prop="database_user_password">
              <el-input v-model="form.database_user_password" placeholder="请输入软件负责人" style="width: 450px"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="bug提交地址" prop="computer_version">
              <el-input v-model="form.computer_version" placeholder="请输入bug提交地址" style="width: 690px"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="产品整机功能说明书">
              <el-upload class="upload-demo" ref="upload" :file-list="fileList" :http-request="requestUpload"
                         :on-preview="handlePreview" :on-remove="handleRemove" :auto-upload="false" action="">
                <template #trigger>
                  <el-button size="small" type="primary">选取文件</el-button>
                </template>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                <!--el-input v-model="form.attachment" type="hidden"></el-input>
                <el-input v-model="form.attachmentName" type="hidden"></el-input-->
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="软件功能说明书">
              <el-upload class="upload-demo" ref="upload" :file-list="fileList" :http-request="requestUpload"
                         :on-preview="handlePreview" :on-remove="handleRemove" :auto-upload="false" action="">
                <template #trigger>
                  <el-button size="small" type="primary">选取文件</el-button>
                </template>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                <!--el-input v-model="form.attachment" type="hidden"></el-input>
                <el-input v-model="form.attachmentName" type="hidden"></el-input-->
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="相关配件清单">
              <el-upload class="upload-demo" ref="upload" :file-list="fileList" :http-request="requestUpload"
                         :on-preview="handlePreview" :on-remove="handleRemove" :auto-upload="false" action="">
                <template #trigger>
                  <el-button size="small" type="primary">选取文件</el-button>
                </template>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                <!--el-input v-model="form.attachment" type="hidden"></el-input>
                <el-input v-model="form.attachmentName" type="hidden"></el-input-->
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="内测报告" prop="private_report">
              <el-upload class="upload-demo" ref="upload" :file-list="fileList" :http-request="requestUpload"
                         :on-preview="handlePreview" :on-remove="handleRemove" :auto-upload="false" action="">
                <template #trigger>
                  <el-button size="small" type="primary">选取文件</el-button>
                </template>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                <el-input v-model="form.private_report" type="hidden"></el-input>
                <el-input v-model="form.private_report" type="hidden"></el-input>
              </el-upload>
            </el-form-item>
          </el-col>
          <h3>主体软件</h3>
          <el-col>
            <el-form-item label="Android版本号：" prop="system_name_version_number">
              <el-input v-model="form.system_name_version_number" placeholder="请输入软件包名"></el-input>
            </el-form-item>
            <el-form-item label="程序包名：" prop="user_password">
              <el-input v-model="form.user_password" placeholder="请输入版本号"></el-input>
            </el-form-item>
            <el-form-item label="修改时间" prop="database_type_address">
              <el-date-picker v-model="form.occur_time" clearable type="date" placeholder="选择日期" size="small"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="IOS版本号：" prop="system_name_version_number">
              <el-input v-model="form.system_name_version_number" placeholder="请输入软件包名"></el-input>
            </el-form-item>
            <el-form-item label="程序包名：" prop="user_password">
              <el-input v-model="form.user_password" placeholder="请输入版本号"></el-input>
            </el-form-item>
            <el-form-item label="修改时间" prop="database_type_address">
              <el-date-picker v-model="form.occur_time" clearable type="date" placeholder="选择日期" size="small"></el-date-picker>
            </el-form-item>
          </el-col>
          <h3>主体软件要求</h3>
          <el-col>
            <el-form-item label="Android" prop="a">
              <el-radio v-model="form.a" label="1">正式服</el-radio>
              <el-radio v-model="form.a" label="2">测试服</el-radio>
            </el-form-item>
            <el-form-item label="下载方式或链接" prop="database_type_address" style="padding-left: 3em">
              <el-input style="width: 690px" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="IOS" prop="a">
              <el-radio v-model="form.a" label="1">正式服</el-radio>
              <el-radio v-model="form.a" label="2">测试服</el-radio>
            </el-form-item>
            <el-form-item label="下载方式或链接" prop="database_type_address" style="padding-left: 3em">
              <el-input style="width: 690px" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <h3>整机信息</h3>
          <el-col>
            <el-form-item label="整机主体版本号：" prop="system_name_version_number">
              <el-input v-model="form.system_name_version_number" placeholder="请输入软件包名" style="width: 450px"></el-input>
            </el-form-item>
            <el-form-item label="整机其他程序版本号(如显示屏)：" prop="user_password">
              <el-input v-model="form.user_password" placeholder="请输入版本号" style="width: 450px"></el-input>
            </el-form-item>
          </el-col>
          <h3>插件信息</h3>
          <el-col>
            <el-form-item label="插件版本号：" prop="system_name_version_number">
              <el-input v-model="form.system_name_version_number" placeholder="请输入软件包名" style="width: 450px"></el-input>
            </el-form-item>
            <el-form-item label="MID(型号ID)：" prop="user_password">
              <el-input v-model="form.user_password" placeholder="请输入版本号" style="width: 450px"></el-input>
            </el-form-item>
          </el-col>
          <h3>配套信息</h3>
          <el-col>
            <el-form-item label="配套的网关版本号：" prop="system_name_version_number">
              <el-input v-model="form.system_name_version_number" placeholder="请输入配套的网关版本号" style="width: 450px"></el-input>
            </el-form-item>
            <el-form-item label="配套的空调：" prop="user_password">
              <el-input v-model="form.user_password" placeholder="请输入配套的空调" style="width: 450px"></el-input>
            </el-form-item>
            <el-form-item label="其它配套信息" prop="database_type_address">
              <el-input v-model="form.database_type_address" placeholder="请输入其它配套信息" style="width: 450px"></el-input>
            </el-form-item>
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
            supporting_facility:"2",
            project_system_address:undefined,
            database_type_address:undefined,
            database_user_password:undefined,
            computer_version:undefined,
            project_server_address:undefined,
            monitoring_point:"2",
            database_summary_design:'1',
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
