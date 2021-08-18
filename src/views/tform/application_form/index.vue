<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true" :label-position="labelPosition">
      <el-row>
        <el-col>
          <el-form-item label="测试单类型" prop="question_title">
            <el-select v-model="queryParams.question_title" clearable size="medium">
              <el-option v-for="dict in question_titleOptions" :key="dict.value" :label="dict.label" :value="dict.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="测试项目" prop="question_title">
            <el-input v-model="queryParams.question_title" placeholder="请输入测试项目" clearable/>
          </el-form-item>
          <el-form-item label="测试方式" prop="test_way">
            <el-radio v-model="queryParams.test_way" label="1">常规测试</el-radio>
            <el-radio v-model="queryParams.test_way" label="2">迭代测试</el-radio>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="项 目  编 号" prop="question_title">
            <el-input v-model="queryParams.question_title" placeholder="请输入项目编号" clearable/>
          </el-form-item>
          <el-form-item label="发生时间" prop="occur_time">
            <el-date-picker v-model="queryParams.occur_time" clearable placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="需求规格说明书PLM编号" prop="question_title">
            <el-input v-model="queryParams.question_title" placeholder="请输入需求规格说明书PLM编号" clearable/>
          </el-form-item>

        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery('queryForm')">重置</el-button>
      </el-form-item>

        <!--el-col :span="9"><div style="border-radius: 4px;min-height: 36px;"></div></el-col>
        <el-col :span="8">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery('queryForm')">重置</el-button>
        </el-col>
        <el-col :span="7"><div style="border-radius: 4px;min-height: 36px;"></div></el-col-->
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="dialogVisible = true"
          v-hasPermi="['quality:question:post']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          :disable="multiple"
          size="mini"
          @click="deleteform"
          v-hasPermi="['quality:question:{id}:delete']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getformList"></right-toolbar>
    </el-row>

    <!--送测申请单列表-->
    <el-table  :data="formList" @selection-change="handleSelectionChange" border height="540" style="width: 100%">
      <el-table-column type="selection" width="45" align="center"></el-table-column>
      <el-table-column prop="" label="序号" width="50" align="center">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="测试单类型" prop="question_title" width="250"></el-table-column>
      <el-table-column label="测试项目" prop="question_title" width="250"></el-table-column>
      <el-table-column label="测试方式" prop="question_title" width="150"></el-table-column>
      <el-table-column label="需求规格说明书PLM编号" prop="question_title"></el-table-column>
      <el-table-column label="项目编号" prop="question_title"></el-table-column>
      <el-table-column label="发生时间" prop="occur_time"></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        width="250"
        class-name="small-padding fixed-width"
        v-if="hasPermi(['quality:question:{id}:put','quality:question:{id}:post','quality:question:{id}:delete','quality:question:get'])"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-hasPermi="['quality:question:{id}:put']"
            @click="updateform(scope.row)"
          >更新
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            v-hasPermi="['quality:question:get']"
            @click="lookform(scope.row)"
          >详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            v-hasPermi="['quality:question:{id}:delete']"
            @click="deleteform(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getformList"
    />

    <!--新增对话框，选择新增何种类型-->
    <el-dialog title="选择新增送测申请单的类型" :visible.sync="dialogVisible" width="30%" >
      <div>
        <el-button type="text" @click="addWeb">新增WEB项目测试申请单</el-button>
      </div>
      <div>
        <el-button type="text" @click="addintelligent_device">新增智能设备or控制器项目测试申请单</el-button>
      </div>
      <div>
        <el-button type="text" @click="addapplet">新增小程序项目测试申请单</el-button>
      </div>
      <div>
        <el-button type="text" @click="addapp">新增APP项目测试申请单</el-button>
      </div>
      <div>
        <el-button type="text" @click="addPC">新增PC软件项目测试申请单</el-button>
      </div>
      <div>
        <el-button type="text" @click="addgree">新增格力+智能单品项目测试申请单</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import {formList, formUpdate, formDelete, sendEmail} from '@/api/tform/tform';
    export default {
        name: "index",
      data() {
        return {
          //遮罩层
          loading: true,
          //对齐方式
          labelPosition: 'right',
          // 非单个禁用
          single: true,
          // 非多个禁用
          multiple: true,
          // 总条数
          total: 1,
          //显示搜索条件
          showSearch:true,
          dialogVisible: false,
          //测试单类型选项
          question_titleOptions: [
            {value: 0, label: "WEB项目测试申请单"},
            {value: 1, label: '智能设备or控制器项目测试申请单'},
            {value: 2, label: "小程序项目测试申请单"},
            {value: 3, label: 'APP项目测试申请单'},
            {value: 4, label: "PC软件项目测试申请单"},
            {value: 5, label: "格力+智能单品项目测试申请单"},
          ],
          //查询参数
          queryParams:{
            question_title:undefined,
            occur_time: undefined,
            pageNum: 1,
            pageSize: 10,
          },
          // 送测单List
          formList: [
            {question_title:'常规测试', occur_time: "2021-08-13",},
            {question_title:'常规测试', occur_time: "2021-08-13",},
            {question_title:'常规测试', occur_time: "2021-08-13",},
            {question_title:'常规测试', occur_time: "2021-08-13",},
            {question_title:'常规测试', occur_time: "2021-08-13",},
            {question_title:'常规测试', occur_time: "2021-08-13",},
            {question_title:'常规测试', occur_time: "2021-08-13",},
            {question_title:'常规测试', occur_time: "2021-08-13",},
            {question_title:'常规测试', occur_time: "2021-08-13",},
            {question_title:'常规测试', occur_time: "2021-08-13",},
            {question_title:'常规测试', occur_time: "2021-08-13",},
            {question_title:'常规测试', occur_time: "2021-08-13",},
          ],
        }
      },
      created() {
        this.getformList();
      },
      methods:{
        /*问题搜索*/
        getformList(){
          this.loading = true;
          formList(this.queryParams).then(response => {
            this.formList = response.data.results;
            this.total = response.data.count;
            this.loading=false;
          })
        },
        /*搜索提交*/
        handleQuery(){
          this.queryParams.pageNum = 1;
        },
        /*搜索重置*/
        resetQuery(formName){
          this.$refs[formName].resetFields();
        },
        /*多选框选中数据*/
        handleSelectionChange(selection) {
          this.ids = selection.map(item => item.id);
          this.single = selection.length!==1;
          this.multiple = !selection.length
        },
        //添加送测申请单
        addWeb(){
          this.$router.push({path: '/tform/Web'});
        },
        addintelligent_device(){
          this.$router.push({path: '/tform/intelligent_device'});
        },
        addapplet(){
          this.$router.push({path: '/tform/applet'});
        },
        addapp(){
          this.$router.push({path: '/tform/app'});
        },
        addPC(){
          this.$router.push({path: '/tform/PC'});
        },
        addgree(){
          this.$router.push({path: '/tform/gree+'});
        },
        getformList(){

        },
        /*修改送测申请单*/
        updateform(row){
          this.$router.push({path: '/tform/Web'});
          this.form = Object.assign({}, row);
        },
        //查看送测申请单详情
        lookform(row){
          this.$router.push({path: '/tform/Web'});
        },
        //删除送测申请单
        /*删除*/
        deleteform(row){
          this.$confirm('是否确认删除名称为"' + row.question_title + '"的数据项?', "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(function() {
            return formDelete(row.id);
          }).then(() => {
            this.getformList();
            this.msgSuccess("删除成功");
          })
        }
      },
    }
</script>

<style scoped>

</style>
