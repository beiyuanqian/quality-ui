<template>
  <div class="app-container">
    <el-card shadow="always">
      <h2>责任科室答复</h2>
      <el-form :model="form" ref="queryForm" :inline="true" :rules="rules" :label-position="labelPosition"
               label-width="120px">
        <el-row>
          <el-form-item label="分析科室" prop="officeId">
            <el-input v-model="form.officeIdParams" placeholder="请输入分析科室" clearable size="small"/>
          </el-form-item>

          <el-form-item label="处理人" prop="userName">
            <el-select v-model="form.userName" placeholder="请选择处理人" size="small" clearable>
              <el-option v-for="item in userNameList" :value="item.value" :label="item.label" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="维护状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择维护状态" size="small" clearable>
              <el-option v-for="item in statusList" :value="item.value" :label="item.label"
                         :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="每日答复" prop="content">
            <el-input v-model="form.content" type="textarea" style="width: 825px" :autosize="{ minRows: 2}" placeholder="请输入每日答复"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="添加附件" prop="attachment">
            <el-upload class="upload-demo" :limit="1" ref="upload" :file-list="fileList" :http-request="requestUpload"
                       :on-preview="handlePreview" :on-remove="handleRemove" :before-upload="beforeUpload"
                       :auto-upload="false" action="">
              <template #trigger>
                <el-button size="small" type="primary" :disabled="form.attachment">选取文件</el-button>
              </template>
              <el-button style="margin-left: 10px;" size="small" type="success" :disabled="form.attachment"
                         @click="submitUpload">上传到服务器
              </el-button>
              <el-button style="margin-left: 10px;" size="small" type="danger" :disabled="!form.attachment"
                         @click="deleteAttachment(form.attachment,form.attachmentName)">删除附件
              </el-button>
              <div slot="tip" class="el-upload__tip">
                文件只能是zip,rar,7z,png,jpeg,bmp,jpg,docx,xlsx,doc,xls,pptx,pdf,msg格式，且不超过10M
              </div>
            </el-upload>
          </el-form-item>
        </el-row>
      </el-form>
      <h2>每日进度查看</h2>
      <el-table v-loading="loading" :data="keepList" style="width: 100%;text-align: center" border>
        <el-table-column prop="machine_category" label="日期" align="center"></el-table-column>
        <el-table-column prop="machine_category" label="用户名" width="200" align="center"></el-table-column>
        <el-table-column prop="machine_category" label="名称" align="center"></el-table-column>
        <el-table-column prop="machine_category" label="答复内容" align="center"></el-table-column>
        <el-table-column prop="machine_category" label="附件" align="center"></el-table-column>
      </el-table>
      <h2>任务单详情</h2>
      <el-descriptions class="margin-top" direction="vertical" :column="2" title="任务单详情查看" border>
        <el-descriptions-item label="状态">{{123}}</el-descriptions-item>
        <el-descriptions-item label="任务单号">{{213}}</el-descriptions-item>
        <el-descriptions-item label="发生时间">{{213}}</el-descriptions-item>
        <el-descriptions-item label="下单人">{{12}}</el-descriptions-item>
        <el-descriptions-item label="是否涉及其它产品">{{123}}</el-descriptions-item>
        <el-descriptions-item label="附件">{{123}}</el-descriptions-item>
        <el-descriptions-item label="科室">{{31}}</el-descriptions-item>
        <el-descriptions-item label="科室跟进人">{{231}}</el-descriptions-item>
        <el-descriptions-item label="问题来源">{{312}}</el-descriptions-item>
        <el-descriptions-item label="问题描述">{{132}}</el-descriptions-item>
        <el-descriptions-item label="原因分析">{{132}}</el-descriptions-item>
        <el-descriptions-item label="临时方案">{{13}}</el-descriptions-item>
        <el-descriptions-item label="长期方案">{{13}}</el-descriptions-item>
        <el-descriptions-item label="预防措施">{{12}}</el-descriptions-item>
        <el-descriptions-item label="详细计划(时间、节点)">{{132}}</el-descriptions-item>
        <el-descriptions-item label="最新进度">{{132}}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script>
  import {listDept} from "@/api/vadmin/permission/dept";
  import {addSaveFile, delSaveFile} from "@/api/vadmin/system/savefile";
  import {getUserProfile, listUser} from "@/api/vadmin/permission/user";
  import {getDept} from "@/api/vadmin/permission/dept";
  import {validEmails, isInteger} from "@/utils/validate";

  export default {
    name: "Index",
    data() {

      return {
        // 遮罩层
        loading: false,
        //每日进度列表
        keepList: [
          {machine_category:"123"},
          ],
        //附件列表
        fileList: [],
        //对齐方式
        labelPosition: 'right',
        //处理人列表
        conductorList:[
          {value: "123", label: "123"},
          {value: "asd", label: "asd"},
        ],
        //部门树选项
        officeIdParams: {
          pageNum: 'all',
          parentId: 5,
        },
        //科室列表
        officeIdOptions: [],
        //维护状态选择
        keep_statusList: [
          {value: "每日答复", label: "每日答复"},
          {value: "一周答复", label: "一周答复"}
        ],
        // 表单参数
        form: {
          office:undefined,
          conductor:undefined,
          keep_status: undefined,
          daily_reply:undefined,
          attachment: undefined,
          attachmentName: undefined,
        },
        // 表单校验
        rules: {
          office:[{required: true, message: '请输入分析科室', trigger: 'change'}],
          conductor:[{required: true, message: '请输入处理人', trigger: 'change'}],
          keep_status: [{required: true, message: '请输入维护状态', trigger: 'change'}],
          daily_reply:[{required: true, message: '请输入每日答复', trigger: 'change'}],
        },
      }
    },
    created() {

    },
    methods: {

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
        const loading = this.$loading({
          lock: true,
          spinner: 'el-icon-loading',
          text: '文件上传中',
          background: 'rgba(0,0,0,0.7)'
        });
        addSaveFile(formData).then(response => {
          loading.close();
          this.form.attachment = response.data.id;
          this.form.attachmentName = response.data.name;
          this.fileList = [];
          if (response.msg === 'success') {
            this.msgSuccess('上传成功!');
            this.fileList = response.data;
          } else {
            this.msgError('上传失败!')
          }
        })
      },
      //文件上传提交
      submitUpload() {
        this.$refs.upload.submit();
      },
      //已上传附件的删除
      deleteAttachment(attachment, attachmentName) {
        this.$confirm('是否确认删除名称为"' + attachmentName + '"的文件?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          //删除文件内容
          return delSaveFile(attachment);
        }).then(() => {
          this.fileList = [];
          this.form.attachment = null;
          this.form.attachmentName = null;
          this.msgSuccess("删除成功");
        })
      },
      //提交表单
      onSubmit(queryForm) {

      },
      //点击取消重置表单内容
      resetForm(queryForm) {
        this.$refs[queryForm].resetFields();
        this.getUserInfo();
      },

    },
  };
</script>

