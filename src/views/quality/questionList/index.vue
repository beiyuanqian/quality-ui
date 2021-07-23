<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-row>
        <el-col :span="4">
          <el-form-item label="问题主题" prop="question_title">
            <el-input v-model="queryParams.question_title" placeholder="请输入问题主题" clearable size="small"/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="机型类别" prop="machine_category">
            <el-input v-model="queryParams.machine_category"  placeholder="请输入机型类别" clearable size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="问题描述" prop="question_description">
            <el-input v-model="queryParams.question_description" placeholder="请输入问题描述" clearable size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="责任部门" prop="duty_dep_id">
            <el-select v-model="queryParams.duty_dep_id"  placeholder="请选择部门" size="small" @change="getOfficeList(queryParams.duty_dep_id)">
              <el-option v-for="item in deptList" :value="item.id" :label="item.deptName" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="责任科室" prop="duty_office_id">
            <el-select v-model="queryParams.duty_office_id" placeholder="请选择科室" size="small">
              <el-option v-for="item in officeList" :value="item.id" :label="item.deptName" :key="item.id" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <el-form-item label="责任人员" prop="duty_person">
            <el-input v-model="queryParams.duty_person" placeholder="请输入责任人" clearable size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="问题大类" prop="question_broad">
            <el-select v-model="queryParams.question_broad" placeholder="请选择" clearable size="small">
              <el-option v-for="item in broadList" :value="item.question_name" :label="item.question_name" :key="item.question_name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="问题细类" prop="question_slender">
            <el-input v-model="queryParams.question_slender" placeholder="请选择" clearable size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="是否关闭" prop="title_status">
            <el-radio-group v-model="queryParams.title_status">
              <el-radio label="是">是</el-radio>
              <el-radio label="否">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="5">
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="addQuestion"
          v-hasPermi="['permission:role:post']"
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
          v-hasPermi="['permission:role:{id}:put']"
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
          v-hasPermi="['permission:role:{id}:delete']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['permission:role:export:get']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getQuestionList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="questionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        v-if="hasPermi(['permission:dept:{id}:put','permission:dept:post','permission:dept:{id}:delete'])"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-hasPermi="['permission:dept:{id}:put']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            v-hasPermi="['permission:dept:post']"
          >复制
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            v-hasPermi="['permission:dept:{id}:delete']"
          >删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="question_title" label="问题主题"></el-table-column>
      <el-table-column prop="occur_time" label="发生时间"></el-table-column>
      <el-table-column prop="title_status" label="状态"></el-table-column>
      <el-table-column prop="machine_category" label="机别类型"></el-table-column>
      <el-table-column prop="machine_name" label="机型名称"></el-table-column>
      <el-table-column prop="machine_num" label="涉及台数"></el-table-column>
      <el-table-column label="责任部门">
        <template slot-scope="{row}">
          {{row.duty_dep_id | deptNameFilter}}
        </template>
      </el-table-column>
      <el-table-column label="责任科室">
        <template slot-scope="{row}">
          {{row.duty_office_id | deptNameFilter}}
        </template>
      </el-table-column>
      <el-table-column label="责任人">
        <template slot-scope="{row}">
          {{row.duty_person | personNameFilter}}
        </template>
      </el-table-column>
      <el-table-column prop="question_origin" label="问题来源"></el-table-column>
      <el-table-column prop="question_description" label="问题描述" width="200"></el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getQuestionList"
    />

    <!-- 添加或修改部门对话框 -->
   <!-- <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="上级部门" prop="parentId">
              <treeselect v-model="form.parentId" :options="deptOptions" :normalizer="normalizer" placeholder="选择上级部门"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="form.deptName" placeholder="请输入部门名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>

<script>
  import {broadList} from '@/api/quality/broad';
  import {listDept} from '@/api/vadmin/permission/dept';
  import {questionList} from '@/api/quality/question';
  import {listUser} from '@/api/vadmin/permission/user';

  let AllDeptName = [];
  let AllPersonName = [];
  export default {
    name: "index",
    filters: {
      personNameFilter(personId) {
        const Id = parseInt(personId);
        const message = AllPersonName.find(item => item.id === Id);
        return message ? message.roleName : null
      },
      deptNameFilter(deptId) {
        const Id = parseInt(deptId);
        const message = AllDeptName.find(item => item.id === Id);
        return message ? message.deptName :null
      }
    },
    data() {
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
        // 售后问题List
        questionList: [],


      }
    },
    created() {
      this.getBroadList();
      this.getDeptList();
      this.getQuestionList();
      this.getPersonAll();
      this.getDeptAll();
    },
    methods: {
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
      /*加载科室list*/
      getOfficeList(officeId){
        this.deptParams.parentId = officeId;
        listDept(this.deptParams).then(response =>{
          this.officeList = response.data
        })
      },
      /*加载全部部门*/
      getDeptAll(){
        listDept(this.deptAll).then(response => {
          AllDeptName = response.data
        })
      },
      /*加载所有人员*/
      getPersonAll(){
        listUser(this.personAll).then(response => {
          AllPersonName = response.data
        })
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
          this.loading=false;
        })
      },
      /*新增*/
      addQuestion(row){

      },
      /*删除*/
      deleteQuestion(row){

      },
      /*修改*/
      updateQuestion(row){

      },
      /*导出*/
      handleExport(){

      },
      /*多选框选中数据*/
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id);
        this.single = selection.length!==1;
        this.multiple = !selection.length
      },
    }
  }
</script>

<style scoped>

</style>
