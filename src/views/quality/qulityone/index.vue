<template>
  <div class="app-container">
    <h1>售后问题管理新增</h1>
    <el-form :model="form" ref="queryForm" :inline="true" :rules="rules" :label-position="labelPosition" label-width="100px">
      <el-form-item label="问题主题" prop="question_title">
        <el-input v-model="form.question_title" clearable size="small" placeholder="请输入问题主题"/>
      </el-form-item>
      <el-form-item label="机型类型" prop="machine_category">
        <el-input v-model="form.machine_category" clearable size="small" placeholder="请输入机型类型"/>
      </el-form-item>
      <el-form-item label="机型名称" prop="machine_name">
      <el-input v-model="form.machine_name" clearable size="small" placeholder="请输入机型名称"/>
      </el-form-item>
      <el-form-item label="涉及台数" prop="machine_num">
        <el-input v-model="form.machine_num" clearable size="small" placeholder="请输入涉及台数"/>
      </el-form-item>
      <el-form-item label="问题大类" prop="question_broad">
        <el-select v-model="form.question_broad" clearable size="small">
          <el-option v-for="dict in question_broadOptions" :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="责任部门" prop="duty_dep_id">
        <el-select v-model="form.duty_dep_id" clearable size="small" @queryTable="getList">
          <el-option v-for="dict in duty_dep_idOptions" :key="dict.id" :label="dict.deptName" :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="责任科室" prop="department">
        <el-select v-model="form.department" clearable size="small">
          <el-option v-for="dict in departmentOptions" :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="责任人" prop="duty_person">
        <el-input v-model="form.duty_person" clearable size="small" placeholder="请输入责任人"/>
      </el-form-item>
      <el-form-item label="发生时间" prop="occur_time">
        <el-date-picker v-model="form.occur_time" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="数量" prop="number">
        <el-input v-model="form.number" clearable size="small" placeholder="请输入数量"/>
      </el-form-item>
      <el-form-item label="重要程度" prop="question_level">
        <el-select v-model="form.question_level" clearable size="small">
          <el-option v-for="dict in question_levelOptions" :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="问题来源" prop="question_origin">
        <el-select v-model="form.question_origin" clearable size="small">
          <el-option v-for="dict in question_originOptions" :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="关闭与否" prop="title_status">
        <el-select v-model="form.title_status" clearable size="small">
          <el-option v-for="dict in title_statusOptions" :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="黑点" prop="black_point">
        <el-input v-model="form.black_point" clearable size="small" placeholder="请输入黑点"/>
      </el-form-item>
      <el-form-item label="问题描述" prop="question_description" >
        <div style="margin: 0 500px;"></div>
        <el-input type="textarea" :autosize="{ minRows: 5}" v-model="form.question_description" placeholder="请输入问题描述"></el-input>
      </el-form-item>
      <el-form-item label="最新进度" prop="question_schedule">
        <div style="margin: 0 500px;"></div>
        <el-input type="textarea" :autosize="{ minRows: 5}" v-model="form.question_schedule" placeholder="请输入最新进度"></el-input>
      </el-form-item>
      <el-form-item label="附件" prop="attachment">
        <div style="margin: 0 500px;"></div>
        <el-upload v-model="form.attachment" :before-upload="beforeUpload" class="upload-demo" ref="upload" action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item >
        <div style="margin: 0 500px;"></div>
        <el-button type="primary" @click="onSubmit('queryForm')">提交</el-button>
        <el-button @click="resetForm('queryForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild } from "@/api/vadmin/permission/dept";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import {getList} from "../../../api/vadmin/permission/msg";
  import log from "../../vadmin/monitor/job/log";

  export default {
    name: "Index",
    components: {Treeselect},
    data() {
      return {
        // 遮罩层
        loading: true,
        //附件
        fileList: [],
        // 责任部门树选项
        duty_dep_idOptions: [
          {"id":2,"create_datetime":"2021-02-27 07:25:09","update_datetime":"2021-07-20 14:56:13","creator_name":"admin","parentId":1,"dept_belong_id":"1","deptName":"计算机中心","orderNum":1,"owner":null,"phone":null,"email":null,"status":"1"}
        ],
        // 责任科室树选项
        departmentOptions:[
          {value: '选项1', label: '科室1'},
          {value: '选项2', label: '科室2'},
          {value: '选项3', label: '科室3'}
        ],
        value: '',
        //问题大类树选项
        question_broadOptions: [
          {value: '选项1', label: '类1'},
          {value: '选项2', label: '类2'},
          {value: '选项3', label: '类3'}
        ],
        //重要程度树选项
        question_levelOptions: [],
        //问题来源树选项
        question_originOptions: [
          {value: '选项1', label: '来源1'},
          {value: '选项2', label: '来源2'}
        ],
        //关闭与否树选项
        title_statusOptions: [
          {value: '选项1', label: '是'},
          {value: '选项2', label: '否'}
        ],
        //对齐方式
        labelPosition: 'right',
        // 表单参数
        form: {
          question_title: '',
          machine_category: '',
          machine_name: '',
          machine_num: '',
          question_broad: '',
          question_slender: '',
          department:'',
          duty_dep_id: '',
          duty_person: '',
          occur_time: '',
          number: '',
          question_level: '',
          question_origin: '',
          title_status: '',
          black_point: '',
          question_description: '',
          question_schedule: '',
          attachment: '',
        },
        // 表单校验
        rules: {
          question_title: [{required: true, message: '请输入活动主题', trigger: 'blur'}],
          machine_category: [{required: true, message: '请输入机型类别', trigger: 'blur'}],
          machine_name: [{required: true, message: '请输入机型名称', trigger: 'blur'}],
          machine_num: [{required: true, message: '请输入涉及台数', trigger: 'blur'}],
          question_broad: [{required: true, message: '请输入问题大类', trigger: 'blur'}],
          question_slender: [{required: true, message: '请输入问题细类', trigger: 'blur'}],
          duty_dep_id: [{required: true, message: '请选择责任部门', trigger: 'change'}],
          department: [{required: true, message: '请选择责任科室', trigger: 'change'}],
          duty_person: [{required: true, message: '请输入责任人', trigger: 'blur'}],
          occur_time: [{required: true, message: '请输入发生时间', trigger: 'blur'}],
          number: [{required: true, message: '请输入数量', trigger: 'blur'}],
          question_level: [{required: true, message: '请选择重要程度', trigger: 'change'}],
          question_origin: [{required: true, message: '请选择问题来源', trigger: 'change'}],
          title_status: [{required: true, message: '请选择关闭与否', trigger: 'change'}],
          black_point: [{required: true, message: '请输入黑点', trigger: 'blur'}],
          question_description: [{required: true, message: '请输入问题描述', trigger: 'blur'}],
          question_schedule: [{required: true, message: '请输入最新进度', trigger: 'blur'}],
          attachment: [{required: true, message: '请选择附件', trigger: 'change'}],
        },
        //发生时间选择
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
      };
    },
    created() {
      this.getList();
      this.getlevelList();
    },
    methods: {
      //查询重要程度
      getlevelList(){
        this.loading = true;
        listLevel(this.form).then(response => {
          console.log(response.data.result)
          this.question_levelOptions = this.handleTree(response.data.result);
          this.loading = false;
        });
      },
      //附件上传校验
      beforeUpload(file){
        var testfile=file.name.substring(file.name.lastIndexOf('.')+1);
        //限制文件格式
        const type=(testfile === 'zip') || (testfile === 'rar');
        //限制文件大小
        const size=file.size / 1024 / 1024 < 10;
        if(!type){
          this.$mount({
            message: '文件只能是zip、rar格式！',
            type: 'warning'
          });
        }if(!size){
          this.$message({
            message: '文件大小不能超过10MB!',
            type: 'warning'
          });
        }
        return type && size;
      },
      /** 查询部门列表 */
      getList() {
        this.loading = true;
        listDept(this.form).then(response => {
          this.duty_dep_idOptions = this.handleTree(response.data.result);
          console.log(this.duty_dep_idOptions)

          this.loading = false;
        });
      },
      //提交附件
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      //提交表单
      onSubmit(queryForm) {
        this.$refs[queryForm].validate((valid) => {
          if (valid) {
            const cloneData = JSON.parse(JSON.stringify(this.form))
            addQuality(cloneData).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              alert('submit!');
            });} else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //点击取消重置表单内容
      resetForm(queryForm) {
        this.$refs[queryForm].resetFields();
      },
    },
  };
</script>

