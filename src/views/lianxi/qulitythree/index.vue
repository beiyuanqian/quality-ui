<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-row>
        <el-col>
          <el-form-item label="问题主题" prop="question_title">
            <el-input v-model="queryParams.question_title" placeholder="请输入问题主题" clearable size="small"/>
          </el-form-item>
          <el-form-item label="机型类别" prop="machine_category">
            <el-input v-model="queryParams.machine_category"  placeholder="请输入机型类别" clearable size="small"></el-input>
          </el-form-item>
          <el-form-item label="问题描述" prop="question_description">
            <el-input v-model="queryParams.question_description" placeholder="请输入问题描述" clearable size="small"></el-input>
          </el-form-item>
          <el-form-item label="责任部门" prop="duty_dep_id">
            <el-select v-model="queryParams.duty_dep_id"  placeholder="请选择部门" size="small" @change="getOfficeList(queryParams.duty_dep_id)">
              <el-option v-for="item in deptList" :value="item.id" :label="item.deptName" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="责任科室" prop="duty_office_id">
            <el-select v-model="queryParams.duty_office_id" placeholder="请选择科室" size="small">
              <el-option v-for="item in officeList" :value="item.id" :label="item.deptName" :key="item.id" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="责任人员" prop="duty_person">
            <el-input v-model="queryParams.duty_person" placeholder="请输入责任人" clearable size="small"></el-input>
          </el-form-item>
          <el-form-item label="问题大类" prop="question_broad">
            <el-select v-model="queryParams.question_broad" placeholder="请选择" clearable size="small">
              <el-option v-for="item in broadList" :value="item.question_name" :label="item.question_name" :key="item.question_name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题细类" prop="question_slender">
            <el-input v-model="queryParams.question_slender" placeholder="请选择" clearable size="small"></el-input>
          </el-form-item>
          <el-form-item label="关闭与否" prop="title_status">
            <el-select v-model="form.title_status" clearable size="small">
              <el-option v-for="dict in title_statusOptions" :key="dict.value" :label="dict.label" :value="dict.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="发生时间" prop="occur_time">
            <el-date-picker v-model="queryParams.occur_time" size="small" clearable placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery('queryForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8" >
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="addQuestion"
          v-hasPermi="['quality:question:post']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="updateQuestion"
          v-hasPermi="['quality:question:{id}:put']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          :disable="multiple"
          size="mini"
          @click="deleteQuestion"
          v-hasPermi="['quality:question:{id}:delete']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getQuestionList"></right-toolbar>
    </el-row>

    <!--售后问题Table-->
    <el-table v-loading="loading" :data="questionList" @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        fixed
        width="200"
        class-name="small-padding fixed-width"
        v-if="hasPermi(['quality:question:{id}:put','quality:question:{id}:post','quality:question:{id}:delete'])"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-hasPermi="['quality:question:{id}:put']"
            @click="updateQuestion(scope.row)"
          >更新
          </el-button>
          <!-- <el-button
             size="mini"
             type="text"
             icon="el-icon-plus"
             v-hasPermi="['quality:question:post']"
           >复制
           </el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            v-hasPermi="['quality:question:get']"
            @click="lookQuestion(scope.row)"
          >详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            v-hasPermi="['quality:question:{id}:delete']"
            @click="deleteQuestion(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="question_title" label="问题主题" width="150"></el-table-column>
      <el-table-column prop="occur_time" label="发生时间" width="150"></el-table-column>
      <el-table-column prop="title_status" label="状态" width="150"></el-table-column>
      <el-table-column prop="machine_category" label="机别类型" width="150"></el-table-column>
      <el-table-column prop="machine_name" label="机型名称" width="150"></el-table-column>
      <el-table-column prop="machine_num" label="涉及台数" width="150"></el-table-column>
      <el-table-column label="责任部门" width="150">
        <template slot-scope="{row}">
          {{row.duty_dep_id | deptNameFilter}}
        </template>
      </el-table-column>
      <el-table-column label="责任科室" width="150">
        <template slot-scope="{row}">
          {{row.duty_office_id | deptNameFilter}}
        </template>
      </el-table-column>
      <el-table-column prop="duty_person" label="责任人" width="150"></el-table-column>
      <el-table-column prop="question_origin" label="问题来源" width="150"></el-table-column>
      <el-table-column prop="question_description" label="问题描述" width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="question_schedule" label="整改进度" width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="attachmentName" label="附件" width="200"></el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getQuestionList"
    />

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :inline="true" :rules="rules" label-width="80px">
        <el-row>
          <el-form-item label="问题主题" prop="question_title">
            <el-input v-model="form.question_title" size="small" placeholder="请输入问题主题" clearable></el-input>
          </el-form-item>
          <el-form-item label="机器类型" prop="machine_category">
            <el-input v-model="form.machine_category" size="small" placeholder="请输入机器类型" clearable></el-input>
          </el-form-item>
          <el-form-item label="机器名称" prop="machine_name">
            <el-input v-model="form.machine_name" size="small" placeholder="请输入机器名称" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="涉及台数" prop="machine_num">
            <el-input v-model="form.machine_num" size="small" placeholder="请输入涉及台数" clearable></el-input>
          </el-form-item>
          <el-form-item label="问题大类" prop="question_broad">
            <el-select v-model="form.question_broad" size="small" placeholder="请选择问题大类" clearable>
              <el-option v-for="item in broadList" :value="item.question_name" :label="item.question_name" :key="item.question_name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题细类" prop="question_slender">
            <el-input v-model="form.question_slender" size="small" placeholder="请输入问题细类" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="责任部门" prop="duty_dep_id">
            <el-select v-model="form.duty_dep_id" size="small" placeholder="请选择责任部门" disabled>
              <el-option v-for="item in deptList" :value="item.id" :label="item.deptName" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="责任科室" prop="duty_dep_id">
            <el-select v-model="form.duty_office_id" size="small" placeholder="请选择责任科室" clearable>
              <el-option v-for="item in officeList" :value="item.id" :label="item.deptName" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="责任人" prop="duty_person">
            <el-input v-model="form.duty_person" size="small" placeholder="请输入责任人" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="故障数量" prop="number">
            <el-input v-model="form.number" size="small" placeholder="请输入故障数量" clearable></el-input>
          </el-form-item>
          <el-form-item label="重要程度" prop="question_level">
            <el-select v-model="form.question_level" clearable size="small">
              <el-option v-for="dict in question_levelOptions" :key="dict.question_level" :label="dict.question_level"
                         :value="dict.question_level"/>
            </el-select>
          </el-form-item>
          <el-form-item label="发送时间" prop="occur_time">
            <el-date-picker v-model="form.occur_time" size="small" placeholder="请选择时间" clearable></el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="问题来源" prop="question_level">
            <el-select v-model="form.question_origin" size="small" placeholder="请选择" clearable>
              <el-option v-for="item in originList" :label="item.question_origin" :value="item.question_origin" :key="item.question_origin"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关闭与否" prop="title_status">
            <el-select v-model="form.title_status" clearable size="small">
              <el-option v-for="dict in title_statusOptions" :key="dict.value" :label="dict.label" :value="dict.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="黑点" prop="black_point">
            <el-input v-model="form.black_point" size="small" placeholder="请输入黑点" clearable>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="问题描述" prop="question_description">
            <el-input type="textarea" style="width: 800px" :autosize="{ minRows: 5}" v-model="form.question_description" size="small" placeholder="请输入问题描述" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="最新进度" prop="question_schedule">
            <el-input type="textarea" style="width: 800px" :autosize="{ minRows: 5}" v-model="form.question_schedule" size="small" placeholder="请输入最新进度" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="发送邮箱" prop="userEmail">
            <el-select style="width:800px;" v-model="form.userEmail" size="small" placeholder="请选择用户邮箱" multiple filterable  clearable>
              <el-option v-for="item in userList" v-if="item.email" :value="item.email" :label="item.email" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="抄送邮箱" prop="emailList">
            <el-input style="width: 800px" v-model="form.emailList" size="small" placeholder="请输入邮箱号,多个邮箱号请用英文逗号隔开"
                      clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="添加附件" prop="attachment">
            <el-upload class="upload-demo" ref="upload" :file-list="fileList" :http-request="requestUpload"
                       :on-preview="handlePreview" :on-remove="handleRemove" :auto-upload="false" action="">
              <template #trigger>
                <el-button size="small" type="primary">选取文件</el-button>
              </template>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
              <el-input v-model="form.attachment" type="hidden"></el-input>
              <el-input v-model="form.attachmentName" type="hidden"></el-input>
            </el-upload>

          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="resetForm('form')">取 消</el-button>
      </div>
    </el-dialog>

    <!--查看详情框-->
    <el-dialog title="查看详情" :visible.sync="seeOpen" append-to-body>
      <el-form ref="form" :model="form">
        <table style="width: 100%;border-collapse: collapse">
          <tr>
            <td v-model="form.question_title">
              <span style="font-size: 15px;font-weight: bold;">问题主题：</span>
              {{form.question_title}}</td>
            <td v-model="form.machine_category">
              <span style="font-size: 15px;font-weight: bold;">机器类型：</span>
              {{form.machine_category}}</td>
            <td v-model="form.machine_name" >
              <span style="font-size: 15px;font-weight: bold;">机器名称：</span>
              {{form.machine_name}}</td>
          </tr>
          <tr>
            <td v-model="form.machine_num">
              <span style="font-size: 15px;font-weight: bold;">涉及台数：</span>
              {{form.machine_num}}
            </td>
            <td v-model="form.question_broad">
              <span style="font-size: 15px;font-weight: bold;">问题大类：</span>
              {{form.question_broad}}
            </td>
            <td v-model="form.question_slender">
              <span style="font-size: 15px;font-weight: bold;">问题细类：</span>
              {{form.question_slender}}
            </td>
          </tr>
          <tr>
            <td v-model="form.duty_dep_id">
              <span style="font-size: 15px;font-weight: bold;">
                责任部门：{{form.duty_dep_id}}
                <el-option v-for="item in deptList" :value="item.id" :label="item.deptName" :key="item.id"></el-option>
              </span>

                <!--el-select v-model="form.duty_dep_id" size="small" placeholder="请选择责任部门" disabled>
                  <el-option v-for="item in deptList" :value="item.id" :label="item.deptName" :key="item.id"></el-option>
                </el-select>

              <el-form-item label="责任科室" prop="duty_office_id">
                <el-select v-model="form.duty_office_id" size="small" placeholder="请选择责任科室" disabled>
                  <el-option v-for="item in officeList" :value="item.id" :label="item.deptName" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="责任人" prop="duty_person">
                <el-input v-model="form.duty_person" size="small" placeholder="请输入责任人" disabled></el-input>
              </el-form-item-->


            </td>
            <td v-model="form.duty_office_id">
              <span style="font-size: 15px;font-weight: bold;">责任科室：</span>
              {{form.duty_office_id}}
            </td>
            <td v-model="form.duty_person">
              <span style="font-size: 15px;font-weight: bold;">责任人：</span>
              {{form.duty_person}}
            </td>
          </tr>
          <tr>
            <td v-model="form.number">
              <span style="font-size: 15px;font-weight: bold;">故障数量：</span>
              {{form.number}}
            </td>
            <td v-model="form.question_level">
              <span style="font-size: 15px;font-weight: bold;">重要程度：</span>
              {{form.question_level}}
            </td>
            <td v-model="form.occur_time">
              <span style="font-size: 15px;font-weight: bold;">发生时间：</span>
              {{form.occur_time}}
            </td>
          </tr>
          <tr>
            <td v-model="form.question_origin">
              <span style="font-size: 15px;font-weight: bold;">问题来源：</span>
              {{form.question_origin}}
            </td>
            <td v-model="form.title_status">
              <span style="font-size: 15px;font-weight: bold;">关闭与否：</span>
              {{form.title_status}}
            </td>
            <td v-model="form.black_point">
              <span style="font-size: 15px;font-weight: bold;">黑点：</span>
              {{form.black_point}}
            </td>
          </tr>
          <tr>
            <td v-model="form.question_description" colspan="3">
              <span style="font-size: 15px;font-weight: bold;">问题描述：</span>
              {{form.question_description}}
            </td>
          </tr>
          <tr>
            <td v-model="form.question_schedule" colspan="3">
              <span style="font-size: 15px;font-weight: bold;">最新进度：</span>
              {{form.question_schedule}}
            </td>
          </tr>
          <tr>
            <td v-model="form.attachmentName" colspan="3">
              <span style="font-size: 15px;font-weight: bold;">附件名称：</span>
              {{form.attachmentName}}
            </td>
          </tr>
        </table>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="seeCancel('form')">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {broadList} from '@/api/quality/broad';
  import {levelList} from '@/api/quality/level';
  import {listDept} from '@/api/vadmin/permission/dept';
  import {questionAdd,questionList, questionUpdate, questionDelete,sendEmail} from '@/api/quality/question';
  import {originList} from '@/api/quality/origin';
  import {addSaveFile,getSaveFile} from "@/api/vadmin/system/savefile";
  import {getUserProfile,listUser} from "@/api/vadmin/permission/user";
  import {getDept} from "@/api/vadmin/permission/dept";
  import {validEmails, isInteger} from "@/utils/validate";


  let AllDeptName = [];
  // let AllPersonName = [];
  export default {
    name: "index",
    filters: {
      deptNameFilter(deptId) {
        const Id = parseInt(deptId);
        const message = AllDeptName.find(item => item.id === Id);
        return message ? message.deptName :null
      }
    },
    data() {
      const checkEmail = (rule, value, callback) => {
        if (value === '' || value === undefined || value === null){
          callback();
        } else{
          if (!validEmails(value)) {
            return callback(new Error('邮箱格式不正确'))
          } else {
            callback();
          }
        }
      };
      const checkInteger = (rule, value , callbacke) => {
        if (!isInteger(value)){
          return callbacke(new Error('请输入正正数'))
        } else{
          callbacke();
        }
      };
      return{
        //遮罩层
        loading: true,
        //显示搜索条件
        showSearch:true,
        // 总条数
        total: 0,
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 查询参数
        queryParams: {
          question_title: undefined,
          machine_category: undefined,
          question_description: undefined,
          duty_dep_id: undefined,
          duty_office_id: undefined,
          duty_person: undefined,
          question_broad: undefined,
          question_slender: undefined,
          title_status: undefined,
          occur_time: undefined,
          pageNum: 1,
          pageSize: 10,
        },
        officeParams:{
          parentId: undefined,
        },
        // 问题大类提交
        broadParams:{
          pageNum: 'all'
        },
        // 问题大类list
        broadList: [],
        deptParams:{
          pageNum: 'all',
          parentId: 1,
        },
        // 获取所有部门
        deptAll:{
          pageNum: 'all'
        },
        // 获取所有人员
        personAll:{
          pageNum: 'all'
        },
        // 部门List
        deptList: [],
        // 科室List
        officeList: [],
        // 科室ListUpdate
        officeListUpdate: [],
        //关闭与否树选项
        title_statusOptions: [
          {value: '否', label: '否'},
          {value: '是', label: '是'}
        ],
        // 售后问题List
        questionList: [],
        open: false,
        seeOpen: false,
        //全部用户信息列表
        userList: [],
        // 修改提交参数
        form: {
          id: undefined,
          question_title: undefined,
          machine_category: undefined,
          machine_name: undefined,
          machine_num: undefined,
          question_broad: undefined,
          question_slender: undefined,
          duty_dep_id: undefined,
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
          emailList: '',
          // 用户邮箱
          userEmail: [],
        },
        // 弹框标题
        title: undefined,
        //问题来源
        originParams:{
          pageNum: 'all'
        },
        originList: [],
        //重要程度提交
        levelParams: {
          pageNum: 'all'
        },
        //重要程度树选项
        question_levelOptions: [],
        //文件列表
        fileList: [],
        // 表单校验
        rules: {
          question_title: [{required: true, message: '请输入活动主题', trigger: 'change'}],
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
      this.getDeptList();
      this.getQuestionList();
      this.getDeptAll();
      this.getOriginList();
      this.emailJudge();
    },
    methods: {
      // 获取重要程度
      getLevelList() {
        levelList(this.levelParams).then(response => {
          this.question_levelOptions = response.data
        })
      },
      /*获取问题大类listAll*/
      getBroadList(){
        broadList(this.broadParams).then(response => {
          this.broadList = response.data
        })
      },
      /*加载部门list*/
      getDeptList(){
        listDept(this.deptParams).then(response => {
          this.deptList = response.data
        })
      },
      //获取部门信息列表
      getDeptInfo(id) {
        getDept(id).then(response => {
          this.form.duty_dep_id = response.data.id;
          this.deptList.push(response.data);
        })
      },
      /*加载科室list*/
      getOfficeList(officeId){
        this.deptParams.parentId = officeId;
        listDept(this.deptParams).then(response =>{
          this.officeList = response.data
        })
      },
      getOfficeListUpdate(officeId){
        this.officeListUpdate = [];
        this.officeParams.parentId = officeId;
        listDept(this.officeParams).then(response => {
          this.officeListUpdate = response.data.results
        })
      },
      /*加载全部部门*/
      getDeptAll(){
        listDept(this.deptAll).then(response => {
          AllDeptName = response.data
        })
      },
      //加载全部人员信息
      getUserList(){
        listUser(this.levelParams).then(response => {
          this.userList = response.data;
        })
      },
      /*邮件发送*/
      emailJudge(){
        if (this.$route.query.emailList !== undefined && this.$route.query.emailList !== null){
          if (this.$route.query.emailList.length > 0){
            sendEmail(this.$route.query.questionId, this.$route.query.emailList, window.location.href).then(response => {
              console.log(response.msg);
            });
          }
        }
      },
      /*搜索提交*/
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getQuestionList();
      },
      /*搜索重置*/
      resetQuery(formName) {
        this.$refs[formName].resetFields();
      },
      /*问题搜索*/
      getQuestionList(){
        this.loading = true;
        questionList(this.queryParams).then(response => {
          this.questionList = response.data.results;
          this.total = response.data.count;
          this.loading=false;
        })
      },
      /*问题来源*/
      getOriginList(){
        originList(this.originParams).then(response => {
          this.originList = response.data
        })
      },
      // 获取用户个人信息
      getUserInfo() {
        getUserProfile().then(response => {
          this.form.userEmail = [];
          this.form.userEmail.push(response.data.email);
          // 判断用户部门的parentId是否为根节点
          if (response.data.dept.parentId === '' || response.data.dept.parentId === null) {
            this.form.duty_dep_id = response.data.dept.id;
            this.deptList.push(response.data.dept);
            this.getOfficeList(response.data.dept.id)
          } else if (response.data.dept.parentId === 1) {
            this.form.duty_dep_id = response.data.dept.id;
            this.deptList.push(response.data.dept);
          } else {
            // 获取部门信息
            this.getDeptInfo(response.data.dept.parentId);
            // 获取部门信息列表
            this.getOfficeList(response.data.dept.parentId);
          }
        })
      },
      /*删除*/
      deleteQuestion(row){
        const user_question_title = row.question_title || this.question_title;
        this.$confirm('是否确认删除名称为"' + user_question_title + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return questionDelete(row.id);
        }).then(() => {
          this.getQuestionList();
          this.msgSuccess("删除成功");
        })
      },
      //增加
      addQuestion(){
        this.open = true;
        this.title = '新增';
        this.getBroadList();
        this.getLevelList();
        this.getOriginList();
        this.getLevelList();
        this.getUserInfo();
        this.getUserList();
      },
      /*修改*/
      updateQuestion(row){
        this.open = true;
        this.title = '修改';
        this.form = Object.assign({}, row);
        this.officeListUpdate = [];
        this.getOfficeListUpdate(this.form.duty_dep_id);
        if(this.form.attachment !== '' && this.form.attachment !== null){
          this.selectSaveFileId(this.form.attachment);
        }
      },
      /*修改时加载附件内容*/
      selectSaveFileId(fileId){
        getSaveFile(fileId).then(response => {
          this.fileList = [];
          this.fileList.push(response.data)
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return exportMessage(queryParams);
        }).then(response => {
          this.download(response.data.file_url, response.data.name);
        })
      },
      /*多选框选中数据*/
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id);
        this.single = selection.length!==1;
        this.multiple = !selection.length
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
          this.form.attachment = response.data.file_url;
          if(response.msg === 'success'){
            this.msgSuccess('上传成功!')
          } else {
            this.msgError('上传失败!')
          }
        })
      },
      //文件上传提交
      submitUpload() {
        this.$refs.upload.submit();
      },
      //表单提交
      submitForm(){
        if (this.form.id != undefined) {
          questionUpdate(this.form).then(response => {
            this.open=false;
            this.$refs["form"].resetFields();
            if (response.msg === 'success'){
              this.msgSuccess('修改成功');
              this.getQuestionList();
            }else{
              this.msgError('修改失败');
            }
          })
      } else {
          questionAdd(this.form).then(response => {
            this.open=false;
            this.$refs["form"].resetFields();
            if (response.msg === 'success'){
              this.msgSuccess('新增成功');
              this.getQuestionList();
            }else{
              this.msgError('新增失败');
            }
          })
        };
      },
      //点击取消重置表单内容
      resetForm(form){
        this.$refs[form].resetFields();
        this.open = false
      },
      // 查看问题详情
      lookQuestion(row){
        this.seeOpen = true;
        this.form = Object.assign({}, row);
        this.getOfficeList(this.form.duty_dep_id);
      },
      //  查看问题取消
      seeCancel(form){
        this.$refs[form].resetFields();
        this.seeOpen = false
      }
      }
  }
</script>

<style scoped>
  table{border-collapse: collapse;table-layout: fixed;}
  td {font-size: 15px;border:0;column-width: 100px;padding-bottom: 6px;padding-top: 6px}
</style>
