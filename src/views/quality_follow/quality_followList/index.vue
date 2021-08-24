<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true" label-width="125px">
      <el-row>
        <el-form-item label="责任科室" prop="officeId">
          <el-select v-model="queryParams.officeId" placeholder="请选择科室" size="small" clearable>
            <el-option v-for="item in officeIdList" :value="item.id" :label="item.deptName" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="责任人" prop="resPerson">
          <el-input v-model="queryParams.resPerson" placeholder="请输入责任人" clearable size="small"></el-input>
        </el-form-item>
        <el-form-item label="问题来源" prop="questionOrigin">
          <el-select v-model="queryParams.questionOrigin" placeholder="请选择" clearable size="small">
            <el-option v-for="item in questionOriginOptions" :value="item.value" :label="item.label"
                       :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" clearable size="small">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="发生时间" prop="occurTime">
          <el-date-picker v-model="queryParams.occurTime" size="small" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                          :picker-options="pickerOptions" clearable placeholder="选择日期"
                          style="width: 188px"></el-date-picker>
        </el-form-item>
        <el-form-item label="下单人" prop="submitter">
          <el-input v-model="queryParams.submitter" placeholder="请输入下单人" clearable size="small"></el-input>
        </el-form-item>
        <el-form-item label="是否涉及其它产品" prop="relate">
          <el-select v-model="queryParams.relate" clearable size="small">
            <el-option v-for="item in relateOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-row>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery('queryForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addPath_add">新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getQualityFollowList"></right-toolbar>
    </el-row>

    <!--售后问题Table-->
    <el-table v-loading="loading" :data="qualityFollowList" @selection-change="handleSelectionChange"
              style="width: 100%" :default-sort = "{prop: 'create_datetime', order: 'descending'}">
      <el-table-column type="selection" width="45" align="center"></el-table-column>
      <el-table-column label="序号" width="70px" align="center" fixed>
        <template slot-scope="scope">{{scope.$index+1}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed width="240" class-name="small-padding fixed-width"
                       v-if="hasPermi(['quality:question:{id}:put','quality:question:{id}:post','quality:question:{id}:delete','quality:question:get'])">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" v-hasPermi="['quality:question:get']"
                     @click="lookQualityFollow(scope.row)">详情
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['quality:question:{id}:put']"
                     @click="updateQualityFollow(scope.row)">更新
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" v-hasPermi="['quality:question:{id}:delete']"
                     @click="deleteQualityFollow(scope.row)">删除
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['quality:question:{id}:post']"
                     @click="addPath_keep(scope.row)">维护进度
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="question_title" label="问题状态" width="150" align="center"></el-table-column>
      <el-table-column prop="question_title" label="维护状态" width="150" align="center"></el-table-column>
      <el-table-column prop="question_title" label="任务单号" width="150" align="center"></el-table-column>
      <el-table-column prop="quesTitle" label="问题主题" width="150" align="center"></el-table-column>
      <el-table-column prop="submitter" label="下单人" width="100" align="center"></el-table-column>
      <el-table-column prop="create_datetime" label="下单时间" width="180" align="center"></el-table-column>
      <el-table-column prop="resPerson" label="责任人" width="150" align="center"></el-table-column>
      <el-table-column prop="followPerson" label="跟进人" width="150" align="center"></el-table-column>
      <el-table-column prop="question_title" label="最新进度" width="150" align="center"></el-table-column>
      <el-table-column prop="questionOrigin" label="问题来源" width="150" align="center"></el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getQualityFollowList"/>

    <!--查看详情框-->
    <el-dialog :visible.sync="seeOpen">
      <el-card shadow="always">
        <h2>任务单详情</h2>
        <el-descriptions class="margin-top" direction="vertical" :column="2" border>
          <el-descriptions-item label="状态">{{form.question_title}}</el-descriptions-item>
          <el-descriptions-item label="任务单号">{{form.machine_category}}</el-descriptions-item>
          <el-descriptions-item label="发生时间">{{form.machine_name}}</el-descriptions-item>
          <el-descriptions-item label="下单人">{{form.machine_num}}</el-descriptions-item>
          <el-descriptions-item label="是否涉及其它产品">{{form.question_broad}}</el-descriptions-item>
          <el-descriptions-item label="附件">{{form.question_slender}}</el-descriptions-item>
          <el-descriptions-item label="科室">{{form.duty_dep_id }}</el-descriptions-item>
          <el-descriptions-item label="科室跟进人">{{form.duty_office_id }}</el-descriptions-item>
          <el-descriptions-item label="问题来源">{{form.duty_person}}</el-descriptions-item>
          <el-descriptions-item label="问题主题">{{form.number}}</el-descriptions-item>
          <el-descriptions-item label="问题描述">{{form.number}}</el-descriptions-item>
          <el-descriptions-item label="原因分析">{{form.question_level}}</el-descriptions-item>
          <el-descriptions-item label="临时方案">{{form.occur_time}}</el-descriptions-item>
          <el-descriptions-item label="长期方案">{{form.question_origin}}</el-descriptions-item>
          <el-descriptions-item label="预防措施">{{form.title_status}}</el-descriptions-item>
          <el-descriptions-item label="详细计划(时间、节点)">{{form.black_point}}</el-descriptions-item>
          <el-descriptions-item label="最新进度">{{form.question_schedule}}</el-descriptions-item>
        </el-descriptions>

        <h2>每日进度查看</h2>
        <el-table v-loading="loading" :data="qualityFollowList" style="width: 100%;text-align: center" border>
          <el-table-column prop="machine_category" label="日期" align="center"></el-table-column>
          <el-table-column prop="machine_category" label="用户名" width="100" align="center"></el-table-column>
          <el-table-column prop="machine_category" label="名称" align="center"></el-table-column>
          <el-table-column prop="machine_category" label="答复内容" align="center"></el-table-column>
          <el-table-column prop="machine_category" label="附件" align="center"></el-table-column>
        </el-table>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button @click="seeCancel('form')">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {qualityFollowDelete, qualityFollowList, qualityFollowUpdate,} from '@/api/quality_follow/quality_follow';
  import {addSaveFile, downloadFile, getSaveFile, delSaveFile} from "@/api/vadmin/system/savefile";
  import {isInteger} from "@/utils/validate";
  import {listUser} from "@/api/vadmin/permission/user";


  export default {
    name: "index",
    data() {
      return {
        //遮罩层
        loading: false,
        //显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        open: false,
        seeOpen: false,
        //日期禁用
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        //科室列表
        officeIdList:[],
        //状态列表
        statusOptions:[
          {value:0,label:"未关闭"},
          {value: 1,label: "关闭"}
        ],
        // 售后问题List
        qualityFollowList: [],
        //附件
        fileForm: {
          filePath: undefined,
          fileName: undefined
        },
        //文件列表
        fileList: [],
        //关闭与否树选项
        relateOptions: [
          {value: '所有', label: '所有'},
          {value: '否', label: '否'},
          {value: '是', label: '是'}
        ],
        //问题来源树选项
        questionOriginOptions: [
          {value: '所有', label: '所有'},
          {value: '厂内', label: '厂内'},
          {value: '厂外', label: '厂外'}
        ],
        // 查询参数
        queryParams: {
          officeId: undefined,
          resPerson: undefined,
          questionOrigin: undefined,
          status: undefined,
          occurTime: undefined,
          submitter: undefined,
          relate: undefined,
          pageNum: 1,
          pageSize: 10,
        },
        // 修改提交参数
        form: {
          id: undefined,
        },
        // 表单校验
        rules: {},

      }
    },
    created() {
      this.getQualityFollowList()
    },
    methods: {
      /*多选框选中数据*/
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id);
        this.single = selection.length !== 1;
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
      /*搜索提交*/
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getQualityFollowList();
      },
      /*搜索重置*/
      resetQuery(formName) {
        this.$refs[formName].resetFields();
      },
      /*问题搜索*/
      getQualityFollowList() {
        this.loading = true;
        console.log(this.queryParams);
        qualityFollowList(this.queryParams).then(response => {
          console.log(response.data)
          this.qualityFollowList = response.data.results;
          this.total = response.data.count;
          this.loading = false;
        }).catch(err => {
        })
      },
      //新增
      addPath_add() {
        this.$router.push({path: '/quality_follow/quality_followAdd'});
      },
      /*修改*/
      updateQualityFollow(row) {
        this.$router.push({path: '/quality_follow/quality_followAdd'});

      },
      addPath_keep(row) {
        this.$router.push({path: '/quality_follow/quality_followKeep'})
      },
      /*删除*/
      deleteQualityFollow(row) {
        this.$confirm('是否确认删除名称为"' + row.quesTitle + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          console.log(row.id)
          return qualityFollowDelete(row.id);
        }).then(() => {
          this.getQualityFollowList();
          this.msgSuccess("删除成功");
        })
      },
      // 修改提交
      submitForm(form) {

      },
      // 取消
      cancel(form) {
        this.open = false;
        this.$refs[form].resetFields();
      },
      // 查看问题详情
      lookQualityFollow(row) {
        this.seeOpen = true;

      },
      //  查看问题取消
      seeCancel(form) {
        this.seeOpen = false;
        this.$refs[form].resetFields();
      }
    }
  }
</script>

<style scoped>

</style>
