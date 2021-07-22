<template>
  <div class="app-container">
    <h1>售后问题管理新增</h1>
    <el-form :model="form" ref="queryForm" :inline="true" :rules="rules" :label-position="labelPosition" label-width="100px" >
      <el-form-item label="问题主题" prop="question_title">
        <el-input v-model="form.question_title" clearable size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="机型类型" prop="machine_category">
        <el-input v-model="form.machine_category" clearable size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="机型名称" prop="machine_name">
        <el-input v-model="form.machine_name" clearable size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="涉及台数" prop="machine_num">
        <el-input v-model="form.machine_num" clearable size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="问题大类" prop="question_broad">
        <el-select v-model="form.question_broad" clearable size="small">
          <el-option v-for="dict in question_broadOptions" :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="责任科室" prop="duty_dep_id">
        <el-select v-model="form.duty_dep_id" clearable size="small">
          <el-option v-for="dict in duty_dep_idOptions" :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="责任人" prop="duty_person">
        <el-input v-model="form.duty_person" clearable size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="发生时间" prop="occur_time">
        <el-date-picker v-model="form.occur_time" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="数量" prop="number">
        <el-input v-model="form.deptName" clearable size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="fileList">
        <div slot="tip" class="el-upload__tip">注意：只能上传jpg/png文件，且不超过500kb</div>
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
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
        <el-input v-model="form.black_point" clearable size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="问题描述" prop="question_description" >
        <div style="margin: 0 500px;"></div>
        <el-input type="textarea" :autosize="{ minRows: 5}" v-model="form.question_description" ></el-input>
      </el-form-item>
      <el-form-item label="最新进度" prop="question_schedule">
        <div style="margin: 0 500px;"></div>
        <el-input type="textarea" :autosize="{ minRows: 5}" v-model="form.question_schedule"></el-input>
      </el-form-item>
      <el-form-item label="附件" prop="attachment">
        <div style="margin: 0 500px;"></div>
        <el-input v-model="form.attachment" :disabled="true">></el-input>
      </el-form-item>
      <el-upload class="upload-demo" ref="upload" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview"
                 :on-remove="handleRemove" :file-list="fileList" :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('queryForm')">提交</el-button>
        <el-button @click="resetForm('queryForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";

  export default {
    name: "Index",
    components: {Treeselect},
    data() {
      return {
        // 遮罩层
        loading: true,
        // 责任科室树选项
        duty_dep_idOptions: [
          {value: '选项1', label: '计算机中心'},
          {value: '选项2', label: '大数据中心'},
          {value: '选项3', label: '物联网研究院'}
        ],
        value: '',
        //问题大类树选项
        question_broadOptions:[
          {value: '选项1', label: '类1'},
          {value: '选项2', label: '类2'},
          {value: '选项3', label: '类3'}
        ],
        //重要程度树选项
        question_levelOptions:[
          {value: '选项1', label: '重要'},
          {value: '选项2', label: '一般'}
        ],
        //问题来源树选项
        question_originOptions:[
          {value: '选项1', label: '来源1'},
          {value: '选项2', label: '来源2'}
        ],
        //关闭与否树选项
        title_statusOptions:[
          {value: '选项1', label: '是'},
          {value: '选项2', label: '否'}
        ],
        //对齐方式
        labelPosition: 'right',
        // 表单参数
        form: {
          question_title:'',
          machine_category:'',
          machine_name:'',
          machine_num:'',
          question_broad:'',
          question_slender:'',
          duty_dep_id:'',
          duty_person:'',
          occur_time:'',
          number:'',
          question_level:'',
          question_origin:'',
          title_status:'',
          black_point :'',
          question_description:'',
          question_schedule :'',
          attachment:'',
        },
        // 表单校验
        rules: {
          question_title:[{ required: true, message: '请输入活动主题', trigger: 'blur' }],
          machine_category:[{ required: true, message: '请输入机型类别', trigger: 'blur' }],
          machine_name:[{ required: true, message: '请输入机型名称', trigger: 'blur' }],
          machine_num:[{ required: true, message: '请输入涉及台数', trigger: 'blur' }],
          question_broad:[{ required: true, message: '请输入问题大类', trigger: 'blur' }],
          question_slender:[{ required: true, message: '请输入问题细类', trigger: 'blur' }],
          duty_dep_id:[{ required: true, message: '请选择责任科室', trigger: 'change' }],
          duty_person:[{ required: true, message: '请输入责任人', trigger: 'blur' }],
          occur_time:[{ required: true, message: '请输入发生时间', trigger: 'blur' }],
          number:[{ required: true, message: '请输入数量', trigger: 'blur' }],
          question_level:[{ required: true, message: '请选择重要程度', trigger: 'change' }],
          question_origin:[{ required: true, message: '请选择问题来源', trigger: 'change' }],
          title_status:[{ required: true, message: '请选择关闭与否', trigger: 'change' }],
          black_point :[{ required: true, message: '请输入黑点', trigger: 'blur' }],
          question_description:[{ required: true, message: '请输入问题描述', trigger: 'blur' }],
          question_schedule :[{ required: true, message: '请输入最新进度', trigger: 'blur' }],
          attachment:[{ required: true, message: '请选择附件', trigger: 'change' }],
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
      this.getDicts("sys_normal_disable").then(response => {
        this.duty_dep_idOptions = response.data;
      });
    },
    methods: {
      onSubmit(queryForm) {
        this.$refs[queryForm].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(queryForm) {
        this.$refs[queryForm].resetFields();
      },
    }
  };
</script>

