<template>
  <div class="app-container">
    <el-form :model="form" ref="queryForm" :inline="true" :rules="rules" :label-position="labelPosition"
             label-width="80px">
      <el-row>
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
            <el-option v-for="dict in question_broadOptions" :key="dict.question_name" :label="dict.question_name"
                       :value="dict.question_name"/>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="问题细类" prop="question_slender">
          <el-input v-model="form.question_slender" clearable size="small" placeholder="请输入问题细类"/>
        </el-form-item>
        <el-form-item label="责任部门" prop="duty_dep_id">
          <el-select v-model="form.duty_dep_id" size="small" placeholder="请选择" disabled>
            <el-option v-for="item in duty_dep_idOptions" :value="item.id" :label="item.deptName"
                       :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="责任科室" prop="duty_office_id">
          <el-select v-model="form.duty_office_id" size="small" placeholder="请选择" clearable>
            <el-option v-for="item in duty_office_idOptions" :value="item.id" :label="item.deptName"
                       :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="责任人" prop="duty_person">
          <el-input v-model="form.duty_person" clearable size="small" placeholder="请输入责任人"/>
        </el-form-item>
        <el-form-item label="故障数量" prop="number">
          <el-input v-model="form.number" clearable size="small" placeholder="请输入数量"/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="发生时间" prop="occur_time">
          <el-date-picker v-model="form.occur_time" clearable type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="重要程度" prop="question_level">
          <el-select v-model="form.question_level" clearable size="small">
            <el-option v-for="dict in question_levelOptions" :key="dict.question_level" :label="dict.question_level"
                       :value="dict.question_level"/>
          </el-select>
        </el-form-item>
        <el-form-item label="问题来源" prop="question_origin">
          <el-select v-model="form.question_origin" clearable size="small">
            <el-option v-for="dict in question_originOptions" :key="dict.question_origin" :label="dict.question_origin"
                       :value="dict.question_origin"/>
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
      </el-row>
      <el-row>
        <el-form-item label="问题描述" prop="question_description">
          <el-input type="textarea" style="width: 900px" :autosize="{minRows: 5}" v-model="form.question_description"
                    placeholder="请输入问题描述"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="最新进度" prop="question_schedule">
          <el-input type="textarea" style="width: 900px" :autosize="{ minRows: 5}" v-model="form.question_schedule"
                    placeholder="请输入最新进度"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="添加附件" prop="attachment">
          <el-upload class="upload-demo" :limit="1" ref="upload" :file-list="fileList" :http-request="requestUpload"
                     :on-preview="handlePreview" :on-remove="handleRemove" :auto-upload="false" action="">
            <template #trigger>
              <el-button size="small" type="primary">选取文件</el-button>
            </template>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          </el-upload>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="发送邮箱" prop="userEmail">
          <el-select style="width:900px;" v-model="form.userEmail" size="small" placeholder="请选择用户邮箱" multiple clearable>
            <el-option v-for="item in userList" v-if="item.email" :value="item.email" :label="item.email" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="抄送邮箱" prop="emailList">
          <el-input style="width: 900px" v-model="form.emailList" size="small" placeholder="请输入邮箱号,多个邮箱号请用英文逗号隔开"
                    clearable></el-input>
        </el-form-item>
      </el-row>
      <el-form-item>
        <div style="margin: 0 500px;"></div>
        <el-button type="primary" @click="onSubmit('queryForm')">提交</el-button>
        <el-button @click="resetForm('queryForm')">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.attachment" type="hidden"></el-input>
        <el-input v-model="form.attachmentName" type="hidden"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {listDept} from "@/api/vadmin/permission/dept";
  import {broadList} from '@/api/quality/broad';
  import {levelList} from '@/api/quality/level';
  import {originList} from '@/api/quality/origin';
  import {questionAdd} from '@/api/quality/question';
  import {addSaveFile} from "@/api/vadmin/system/savefile";
  import {getUserProfile, listUser} from "@/api/vadmin/permission/user";
  import {getDept} from "@/api/vadmin/permission/dept";
  import {validEmails, isInteger} from "@/utils/validate";

  export default {
    name: "Index",
    data() {
      const checkEmail = (rule, value, callback) => {
        if (!validEmails(value)) {
          return callback(new Error('邮箱格式不正确'))
        } else {
          callback();
        }
      };
      const checkInteger = (rule, value , callbacke) => {
       if (!isInteger(value)){
         return callbacke(new Error('请输入正正数'))
       } else{
         callbacke();
       }
      };
      return {
        // 遮罩层
        loading: true,
        //附件
        fileList: [],
        //责任部门树
        deptParams: {
          pageNum: 'all',
          parentId: 1,
        },
        // 责任部门树选项
        duty_dep_idOptions: [],
        // 责任科室树选项
        duty_office_idOptions: [],
        // 问题大类提交
        broadParams: {
          pageNum: 'all'
        },
        //问题大类树选项
        question_broadOptions: [],
        //重要程度提交
        levelParams: {
          pageNum: 'all'
        },
        //重要程度树选项
        question_levelOptions: [],
        //问题来源提交
        originParams: {
          pageNum: 'all'
        },
        //问题来源树选项
        question_originOptions: [],
        //关闭与否树选项
        title_statusOptions: [
          {value: '否', label: '否'},
          {value: '是', label: '是'}
        ],
        //对齐方式
        labelPosition: 'right',
        //全部用户信息列表
        userList: [],
        // 表单参数
        form: {
          question_title: undefined,
          machine_category: undefined,
          machine_name: undefined,
          machine_num: undefined,
          question_broad: undefined,
          question_slender: undefined,
          duty_dep_id: undefined,
          dutyDeptName: undefined,
          duty_office_id: undefined,
          duty_person: undefined,
          occur_time: undefined,
          number: undefined,
          question_level: undefined,
          question_origin: undefined,
          title_status: '否',
          black_point: undefined,
          question_description: undefined,
          question_schedule: undefined,
          attachment: undefined,
          attachmentName: undefined,
          // 填写的邮箱号
          emailList: undefined,
          // 用户邮箱
          userEmail: [],
        },
        // 表单校验
        rules: {
          question_title: [{required: true, message: '请输入问题主题', trigger: 'change'}],
          duty_dep_id: [{required: true, message: '请选择责任部门', trigger: 'change'}],
          duty_person: [{required: true, message: '请输入责任人', trigger: 'change'}],
          occur_time: [{required: true, message: '请输入发生时间', trigger: 'change'}],
          question_level: [{required: true, message: '请选择重要程度', trigger: 'change'}],
          question_origin: [{required: true, message: '请选择问题来源', trigger: 'change'}],
          title_status: [{required: true, message: '请选择关闭与否', trigger: 'change'}],
          question_description: [{required: true, message: '请输入问题描述', trigger: 'change'}],
          question_schedule: [{required: true, message: '请输入最新进度', trigger: 'change'}],
          emailList: [{ validator:checkEmail, trigger: 'change'}],
          number: [{validator: checkInteger, trigger: 'change'}],
          machine_num: [{validator: checkInteger, trigger: 'change'}]
        },
      }
    },
    created() {
      this.getBroadList();
      this.getLevelList();
      this.getOriginList();
      this.getUserInfo();
      this.getUserList();
    },
    methods: {
      //获取问题来源
      getOriginList() {
        originList(this.originParams).then(response => {
          this.question_originOptions = response.data
        })
      },
      // 获取重要程度
      getLevelList() {
        levelList(this.levelParams).then(response => {
          this.question_levelOptions = response.data
        })
      },
      // 获取问题大类listAll
      getBroadList() {
        broadList(this.broadParams).then(response => {
          this.question_broadOptions = response.data
        })
      },
      //获取部门信息列表
      getDeptInfo(id) {
        getDept(id).then(response => {
          this.form.duty_dep_id = response.data.id;
          this.duty_dep_idOptions.push(response.data);
        })
      },
      //加载科室list
      getOfficeList(officeId) {
        this.deptParams.parentId = officeId;
        listDept(this.deptParams).then(response => {
          this.duty_office_idOptions = response.data
        })
      },
      //加载全部人员信息
      getUserList(){
        listUser(this.levelParams).then(response => {
          this.userList = response.data;
        })
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
      // 获取用户个人信息
      getUserInfo() {
        getUserProfile().then(response => {
          this.form.userEmail.push(response.data.email);
          // 判断用户部门的parentId是否为根节点
          if (response.data.dept.parentId === '' || response.data.dept.parentId === null) {
            this.form.duty_dep_id = response.data.dept.id;
            this.duty_dep_idOptions.push(response.data.dept);
            this.getOfficeList(response.data.dept.id)
          } else if (response.data.dept.parentId === 1) {
            this.form.duty_dep_id = response.data.dept.id;
            this.duty_dep_idOptions.push(response.data.dept);
          } else {
            // 获取部门信息
            this.getDeptInfo(response.data.dept.parentId);
            // 获取部门信息列表
            this.getOfficeList(response.data.dept.parentId);
          }
        })
      },
      //提交表单
      onSubmit(queryForm) {
        this.$refs[queryForm].validate((valid) => {
          // 问题新增提交
          if (valid) {
            const cloneData = JSON.parse(JSON.stringify(this.form));
            //邮箱拼接
            const Email = cloneData.userEmail.concat(cloneData.emailList.split(','));
            questionAdd(cloneData).then(response => {
              this.msgSuccess("新增成功");
              //跳转至显示页面
              this.questionPath(response.data.id, Email);
            });
          } else {
            console.log('error submit!!');
          }
        });
        this.$refs[queryForm].resetFields();
        this.getUserInfo();
      },
      //点击取消重置表单内容
      resetForm(queryForm) {
        this.$refs[queryForm].resetFields();
        this.getUserInfo();
      },
      questionPath(questionId, emailList) {
        this.$router.push({path: '/quality/questionList', query: { questionId: questionId, emailList: emailList }});
      }

    },
  };
</script>

