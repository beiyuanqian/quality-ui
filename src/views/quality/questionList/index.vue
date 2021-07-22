<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
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
          <el-form-item label="是否关闭">
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










    <!--  <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="部门状态" clearable size="small">
          <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel"
                     :value="dict.dictValue"/>
        </el-select>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" >搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" >重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click=""
        >新增
        </el-button>
      </el-col>
      <right-toolbar  @queryTable=""></right-toolbar>
    </el-row>

    <!--<el-table
      v-loading="loading"
      :data="deptList"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="deptName" label="部门名称"></el-table-column>
      <el-table-column prop="orderNum" label="排序" width="200"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="statusFormat" width="200"></el-table-column>
      <el-table-column label="更新时间" align="center" prop="update_datetime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.update_datetime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="create_datetime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.create_datetime) }}</span>
        </template>
      </el-table-column>
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
            @click="handleUpdate(scope.row)"
            v-hasPermi="['permission:dept:{id}:put']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['permission:dept:post']"
          >新增
          </el-button>
          <el-button
            v-if="scope.row.parentId != 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['permission:dept:{id}:delete']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>-->

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

  export default {
    name: "index",
    data() {
      return{
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
          occur_time: undefined
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
        // 部门List
        deptList: [],
        // 科室List
        officeList: [],

      }
    },
    created() {
      this.getBroadList();
      this.getDeptList()
    },
    methods: {
      // 获取问题大类listAll
      getBroadList(){
        broadList(this.broadParams).then(response => {
          this.broadList = response.data
        })
      },
      //加载部门list
      getDeptList(){
        listDept(this.deptParams).then(response => {
          this.deptList = response.data
        })
      },
      //加载科室list
      getOfficeList(officeId){
        this.deptParams.parentId = officeId;
        listDept(this.deptParams).then(response =>{
          this.officeList = response.data
        })
      }
    }
  }
</script>

<style scoped>

</style>
