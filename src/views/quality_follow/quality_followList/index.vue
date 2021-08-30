<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true" label-width="125px">
      <el-row>
        <el-form-item label="责任科室" prop="officeId">
          <el-select v-model="queryParams.officeId" placeholder="请选择科室" size="small" clearable>
            <el-option v-for="item in officeIdOptions" :value="item.id" :label="item.deptName"
                       :key="item.id"></el-option>
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
        <el-form-item label="问题状态" prop="status">
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
          <el-select v-model="queryParams.submitter" clearable size="small" placeholder="请输入跟进人">
            <el-option v-for="dict in submitterList" :key="dict.id" :label="dict.name" :value="dict.id"/>
          </el-select>
          <!--          <el-input v-model="queryParams.submitter" placeholder="请输入下单人" clearable size="small"></el-input>-->
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
              style="width: 100%" :default-sort="{prop: 'create_datetime', order: 'descending'}">
      <el-table-column type="selection" width="30" align="center"></el-table-column>
      <el-table-column label="序号" width="50px" align="center" fixed>
        <template slot-scope="scope">{{scope.$index+1}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed width="240" class-name="small-padding fixed-width"
                       v-if="hasPermi(['qualityfollow:dailyprogress:get','qualityfollow:questionfollow:{id}:put',
                       'qualityfollow:questionfollow:{id}:delete','qualityfollow:questionfollow:get'])">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" v-hasPermi="['qualityfollow:questionfollow:get']"
                     @click="lookQualityFollow(scope.row)">详情
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['qualityfollow:questionfollow:{id}:put']"
                     @click="updateQualityFollow(scope.row)">更新
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" v-hasPermi="['qualityfollow:questionfollow:{id}:delete']"
                     @click="deleteQualityFollow(scope.row)">删除
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['qualityfollow:dailyprogress:get']"
                     @click="addPath_keep(scope.row)">维护进度
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="问题状态" width="150" align="center">
        <template slot-scope="scope">
          <span v-html="questionStatus(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="维护状态" width="150" align="center">
        <template slot-scope="scope">
          <span v-html="dailyStatus(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="quesTitle" label="问题主题" width="150" align="center"></el-table-column>
      <el-table-column prop="quesDescription" label="问题描述" width="150" align="center"></el-table-column>
      <el-table-column prop="occurTime" label="发生时间" width="150" align="center"></el-table-column>
      <el-table-column prop="submitter" label="下单人" width="100" align="center">
        <template slot-scope="{row}">
          {{row.submitter | submitterNameFilter}}
        </template>
      </el-table-column>
      <el-table-column prop="create_datetime" label="下单时间" width="180" align="center"></el-table-column>
      <el-table-column prop="officeId" label="责任科室" width="150" align="center">
        <template slot-scope="{row}">
          {{row.officeId | officeNameFilter}}
        </template>
      </el-table-column>
      <el-table-column prop="resPerson" label="责任人" width="150" align="center"></el-table-column>
      <el-table-column prop="followPerson" label="跟进人" width="150" align="center">
        <template slot-scope="{row}">
          {{row.followPerson | followPersonNameFilter}}
        </template>
      </el-table-column>
      <el-table-column prop="content" label="最新进度" width="150" align="center">
        <template slot-scope="scope">
          {{dailyContent(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column prop="questionOrigin" label="问题来源" width="150" align="center"></el-table-column>
      <el-table-column prop="fileName" label="附件" width="150" align="center">
        <template slot-scope="{row}">
          <el-button type="text" @click="downloadTrigger(row)">
            {{row.fileName}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getQualityFollowList"/>

    <!--查看详情框-->
    <el-dialog :visible.sync="seeOpen">
      <el-card shadow="always">
        <h2>任务单详情</h2>
        <el-descriptions class="margin-top" direction="vertical" :column="2" border>
          <el-descriptions-item label="状态"><span v-html="quesDetailStatus(form)"></span></el-descriptions-item>
          <el-descriptions-item label="发生时间">{{form.occurTime}}</el-descriptions-item>
          <el-descriptions-item label="下单人">{{form.submitter | submitterNameFilter}}</el-descriptions-item>
          <el-descriptions-item label="是否涉及其它产品">{{form.relate}}</el-descriptions-item>
          <el-descriptions-item label="附件">{{form.fileName}}</el-descriptions-item>
          <el-descriptions-item label="科室">{{form.officeId | officeNameFilter }}</el-descriptions-item>
          <el-descriptions-item label="科室跟进人">{{form.followPerson | followPersonNameFilter }}</el-descriptions-item>
          <el-descriptions-item label="问题来源">{{form.questionOrigin}}</el-descriptions-item>
          <el-descriptions-item label="问题主题">{{form.quesTitle}}</el-descriptions-item>
          <el-descriptions-item label="问题描述">{{form.quesDescription}}</el-descriptions-item>
          <el-descriptions-item label="原因分析">{{form.causeAnalysis}}</el-descriptions-item>
          <el-descriptions-item label="临时方案">{{form.tempSolution}}</el-descriptions-item>
          <el-descriptions-item label="长期方案">{{form.longSolution}}</el-descriptions-item>
          <el-descriptions-item label="预防措施">{{form.alternative}}</el-descriptions-item>
          <el-descriptions-item label="详细计划(时间、节点)">{{form.detailPlan}}</el-descriptions-item>
          <el-descriptions-item label="最新进度">{{form.content}}</el-descriptions-item>
        </el-descriptions>
        <h2>每日进度查看</h2>
        <el-table v-loading="loading" :data="keepList" style="width: 100%;text-align: center" border
                  :default-sort="{prop: 'create_datetime', order: 'ascending'}">
          <el-table-column prop="create_datetime" label="日期" align="center"></el-table-column>
          <el-table-column prop="userId" label="用户名" width="120" align="center">
            <template slot-scope="{row}">
              {{row.userId | followPersonNameFilter}}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="名称" align="center"></el-table-column>
          <el-table-column prop="content" label="答复内容" align="center"></el-table-column>
          <el-table-column prop="fileName" label="附件" align="center"></el-table-column>
        </el-table>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="seeCancel()">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {DailyProgressDelete, DailyProgressList} from "@/api/quality_follow/daily_progress";
  import {qualityFollowDelete, qualityFollowList, sendFollowEmail} from '@/api/quality_follow/quality_follow';
  import {addSaveFile, delSaveFile, downloadFile, getSaveFile} from "@/api/vadmin/system/savefile";
  import {listUser} from "@/api/vadmin/permission/user";
  import {listDept} from "@/api/vadmin/permission/dept";

  let AllSubmitterName = [];
  let AllFollowPersonName = [];
  let AllOfficeName = [];
  export default {
    name: "index",
    filters: {
      // 下单人名称过滤器
      submitterNameFilter(submitter) {
        const Id = parseInt(submitter);
        const message = AllSubmitterName.find(item => item.id === Id);
        return message ? message.name : null
      },
      // 跟进人名称过滤器
      followPersonNameFilter(followPerson) {
        const Id = parseInt(followPerson);
        const message = AllFollowPersonName.find(item => item.id === Id);
        return message ? message.name : null
      },
      // 部门名称过滤器
      officeNameFilter(officeID) {
        const Id = parseInt(officeID);
        const message = AllOfficeName.find(item => item.id === Id);
        return message ? message.deptName : null
      },
    },
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
        keepList: [],
        //日期禁用
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        //部门树选项
        officeIdParams: {
          pageNum: 'all',
          parentId: 5,
        },
        //科室列表
        officeIdOptions: [],
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
          {value: '否', label: '否'},
          {value: '是', label: '是'}
        ],
        //问题来源树选项
        questionOriginOptions: [
          {value: '厂内', label: '厂内'},
          {value: '厂外', label: '厂外'}
        ],
        // 问题状态
        statusOptions: [
          {value: 0, label: '未关闭'},
          {value: 1, label: '已关闭'},
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
        // 描述参数
        form: {},
        //跟进参数
        FollowPrams: {
          questionFollow: undefined,
          pageNum: 1,
        },
        //下单人选项
        submitterParams: {
          pageNum: 'all',
        },
        //下单人列表
        submitterList: [],
        //跟进人列表
        followPersonList: [],
      }
    },
    created() {
      this.getDeptInfo();
      this.sendEmail();
    },
    methods: {
      //获取部门信息列表
      getDeptInfo() {
        listDept(this.officeIdParams).then(response => {
          AllOfficeName = response.data;
          this.officeIdOptions = response.data;
          this.getSubmitterList();
        })
      },
      //加载全部人员信息
      getSubmitterList() {
        listUser(this.submitterParams).then(response => {
          AllSubmitterName = response.data;
          AllFollowPersonName = response.data;
          this.submitterList = response.data;
          this.followPersonList = response.data;
          this.getQualityFollowList();
        })
      },
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
          this.form.fileId = response.data.id;
          this.form.fileName = response.data.name;
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
      deleteAttachment(fileId, fileName) {
        this.$confirm('是否确认删除名称为"' + fileName + '"的文件?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          //删除文件内容
          return delSaveFile(attachment);
        }).then(() => {
          this.fileList = [];
          this.form.fileId = null;
          this.form.fileName = null;
          this.msgSuccess("删除成功");
        })
      },
      /*附件下载*/
      downloadTrigger(row) {
        const fileName = row.fileName;
        getSaveFile(row.fileId).then(response => {
          this.fileForm.fileName = fileName;
          this.fileForm.filePath = response.data.file_url;
          downloadFile(this.fileForm).then(response => {
            const downloadElement = document.createElement("a");
            let blob = new Blob([response], {type: 'application/octet-stream'});
            let href = window.URL.createObjectURL(blob);
            downloadElement.href = href;
            downloadElement.download = fileName; //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
          })
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
        qualityFollowList(this.queryParams).then(response => {
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
        this.$router.push({path: '/quality_follow/quality_followAdd', query: {id: row.id}})
      },
      //质量跟进
      addPath_keep(row) {
        this.$router.push({path: '/quality_follow/quality_followKeep', query: {id: row.id}})
      },
      /*删除*/
      deleteQualityFollow(row) {
        this.$confirm('是否确认删除名称为"' + row.quesTitle + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return qualityFollowDelete(row.id);
        }).then(function () {
          return DailyProgressDelete(row.id);
        }).then(function () {
          if (row.fileId > 0) {
            return delSaveFile(row.fileId);
          }
        }).then(() => {
          this.getQualityFollowList();
          this.msgSuccess("删除成功");
        })
      },
      /*详情查看答复列表*/
      getDailyProgressList(row) {
        this.loading = true;
        this.FollowPrams.questionFollow = row.id;
        DailyProgressList(this.FollowPrams).then(response => {
          this.keepList = response.data.results;
          this.total = response.data.count;
          this.loading = false;
        }).catch(err => {
        })
      },
      // 查看问题详情
      lookQualityFollow(row) {
        this.seeOpen = true;
        this.form = Object.assign({}, row);
        this.form.content = row.daily_follow.slice(-1)[0].content;
        this.getDailyProgressList(row);
      },
      //  查看问题取消
      seeCancel() {
        this.seeOpen = false;
      },
      // 判断维护状态
      dailyStatus(row) {
        let updateDate;
        let nowDate;
        if (row.status === 0) {
          // 获取最新维护时间
          updateDate = this.dailyDateTime(row);
          nowDate = this.getNowTime();
          if (updateDate === nowDate) {
            return '<span>已维护每日进度</span>';
          } else {
            return '<span style="color: red">未维护每日进度</span>';
          }
        } else {
          return '<span>已关闭</span>';
        }
      },
      // 获取每日更新时间
      dailyDateTime(row) {
        let updateTime = row.daily_follow.slice(-1)[0].create_datetime;
        return updateTime.split(" ")[0];
      },
      // 获取最新的更新内容
      dailyContent(row) {
        let updateContent = undefined;
        for (let i = 0; i < row.daily_follow.length; i++) {
          updateContent = row.daily_follow[i].content;
        }
        return updateContent;
      },
      // 获取当前时间
      getNowTime() {
        const nowDate = new Date();
        let year = nowDate.getFullYear();//年
        let month = nowDate.getMonth() + 1;//注意！月份是从0月开始获取的，所以要+1;
        let day = nowDate.getDate();//日
        return year + '-' + (month >= 10 ? month : '0' + month) + '-' + (day >= 10 ? day : '0' + day);
      },
      // 判断问题状态
      questionStatus(row){
        const dailyStatus = row.daily_follow.slice(-1)[0].status;
        if (row.status === 0){
          if (dailyStatus === '申请关闭'){
            return '<span style="color: red">申请关闭</span>'
          }else if(dailyStatus === '驳回申请'){
            return '<span style="color: red">驳回申请</span>'
          }else{
            return '<span>未关闭</span>'
          }
        }else if (row.status === 1){
          return '<span>已关闭</span>'
        }
      },
      // 邮件发送
      sendEmail(){
        if(this.$route.params.id !== undefined){
          const params = {
            id: parseInt(this.$route.params.id),
            url: window.location.href
          };
          sendFollowEmail(params).then(response => {
            console.log(response.msg)
          })
        }
      },
    //  详情页面进行问题状态判断
      quesDetailStatus(form){
        if(form.status === 0){
          if (form.content === '申请关闭'){
            return '<span style="color: red">申请关闭</span>'
          }else if (form.content === '驳回申请'){
            return '<span style="color: red">驳回申请</span>'
          }else {
            return '<span>未关闭</span>'
          }
        }else if(form.status === 1){
          return '<span>已关闭</span>'
        }
      },

    }
  }
</script>

<style scoped>

</style>
