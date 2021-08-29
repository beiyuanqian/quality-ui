<template>
  <div class="app-container">
    <el-card shadow="always">
      <h2>责任科室答复</h2>
      <el-form :model="form" ref="queryForm" :inline="true" :rules="rules" :label-position="labelPosition"
               label-width="120px">
        <el-row>
          <el-form-item label="分析科室" prop="officeId">
            <el-select v-model="form.officeId" placeholder="请选择分析科室" size="small" clearable>
              <el-option v-for="item in officeIdOptions" :value="item.id" :label="item.deptName"
                         :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处理人" prop="userId">
            <el-select v-model="form.userId" clearable size="small" placeholder="请选择处理人">
              <el-option v-for="dict in userIdList" :key="dict.id" :label="dict.name" :value="dict.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="维护状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择维护状态" size="small" clearable>
              <el-option v-for="item in statusList" :value="item.value" :label="item.label"
                         :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="questionFollow">
            <el-input v-model="form.questionFollow" placeholder="请输入处理人" clearable size="small" type="hidden"/>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="每日答复" prop="content">
            <el-input v-model="form.content" type="textarea" style="width: 825px" :autosize="{ minRows: 2}"
                      placeholder="请输入每日答复"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="添加附件" prop="file">
            <el-upload class="upload-demo" :limit="1" ref="upload" :file-list="fileList" :http-request="requestUpload"
                       :on-preview="handlePreview" :on-remove="handleRemove" :before-upload="beforeUpload"
                       :auto-upload="false" action="">
              <template #trigger>
                <el-button size="small" type="primary" :disabled="disableJudge(form.fileId)">选取文件</el-button>
              </template>
              <el-button style="margin-left: 10px;" size="small" type="success" :disabled="disableJudge(form.fileId)"
                         @click="submitUpload">上传到服务器
              </el-button>
              <el-button style="margin-left: 10px;" size="small" type="danger" :disabled="!disableJudge(form.fileId)"
                         @click="deleteAttachment(form.fileId,form.fileName)">删除附件
              </el-button>
              <div slot="tip" class="el-upload__tip">
                文件只能是zip,rar,7z,png,jpeg,bmp,jpg,docx,xlsx,doc,xls,pptx,pdf,msg格式，且不超过10M
              </div>
            </el-upload>
          </el-form-item>
        </el-row>
        <el-form-item>
          <div style="margin: 0 500px;"></div>
          <el-button type="primary" @click="onSubmit('queryForm')">提交</el-button>
          <el-button @click="resetForm('queryForm')">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.fileId" type="hidden"></el-input>
          <el-input v-model="form.fileName" type="hidden"></el-input>
        </el-form-item>
      </el-form>
      <h2>每日进度查看</h2>
      <el-table v-loading="loading" :data="keepList" style="width: 100%;text-align: center" border
                @selection-change="handleFollowChange" :default-sort="{prop: 'create_datetime', order: 'ascending'}">
        <el-table-column prop="create_datetime" label="日期" align="center"></el-table-column>
        <el-table-column prop="officeId" label="科室" align="center">
          <template slot-scope="{row}">
            {{row.officeId | officeNameFilter}}
          </template>
        </el-table-column>
        <el-table-column prop="userId" label="用户名" width="200" align="center">
          <template slot-scope="{row}">
            {{row.userId | followPersonNameFilter}}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="名称" align="center"></el-table-column>
        <el-table-column prop="content" label="答复内容" align="center"></el-table-column>
        <el-table-column prop="fileName" label="附件" align="center"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="240" class-name="small-padding fixed-width"
                         v-if="hasPermi(['quality:question:{id}:put','quality:question:{id}:post',])">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-view" v-hasPermi="['quality:question:get']"
                       @click="agreeQualityFollow(scope.row)" v-if="scope.row.status==='申请关闭'">同意
            </el-button>
            <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['quality:question:{id}:put']"
                       @click="rejectQualityFollow(scope.row)" v-if="scope.row.status==='申请关闭'">驳回
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <h2>任务单详情</h2>
      <el-descriptions class="margin-top" direction="vertical" :column="2" border>
        <el-descriptions-item label="状态">{{description.status | statusNameFilter}}</el-descriptions-item>
        <el-descriptions-item label="发生时间">{{description.occurTime}}</el-descriptions-item>
        <el-descriptions-item label="下单人">{{description.submitter | submitterNameFilter}}</el-descriptions-item>
        <el-descriptions-item label="是否涉及其它产品">{{description.relate}}</el-descriptions-item>
        <el-descriptions-item label="附件">{{description.fileName}}</el-descriptions-item>
        <el-descriptions-item label="科室">{{description.officeId | officeNameFilter}}</el-descriptions-item>
        <el-descriptions-item label="科室跟进人">{{description.followPerson | followPersonNameFilter }}</el-descriptions-item>
        <el-descriptions-item label="问题来源">{{description.questionOrigin}}</el-descriptions-item>
        <el-descriptions-item label="问题主题">{{description.quesTitle}}</el-descriptions-item>
        <el-descriptions-item label="问题描述">{{description.quesDescription}}</el-descriptions-item>
        <el-descriptions-item label="原因分析">{{description.causeAnalysis}}</el-descriptions-item>
        <el-descriptions-item label="临时方案">{{description.tempSolution}}</el-descriptions-item>
        <el-descriptions-item label="长期方案">{{description.longSolution}}</el-descriptions-item>
        <el-descriptions-item label="预防措施">{{description.alternative}}</el-descriptions-item>
        <el-descriptions-item label="详细计划(时间、节点)">{{description.detailPlan}}</el-descriptions-item>
        <el-descriptions-item label="最新进度">{{description.content}}</el-descriptions-item>
      </el-descriptions>

    </el-card>
  </div>
</template>

<script>
  import {DailyProgressAdd, DailyProgressList,DailyProgressGet} from "@/api/quality_follow/daily_progress";
  import {qualityFollowGet,qualityFollowUpdate} from '@/api/quality_follow/quality_follow';
  import {listDept} from "@/api/vadmin/permission/dept";
  import {addSaveFile, delSaveFile} from "@/api/vadmin/system/savefile";
  import {getUserProfile, listUser} from "@/api/vadmin/permission/user";

  let AllSubmitterName = [];
  let AllPercentName=[];
  let AllFollowPersonName = [];
  let AllOfficeName = [];
  let AllStatusName = [];
  export default {
    name: "Index",
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
      // 问题状态过滤器
      statusNameFilter(status) {
        // console.log(status);
        const Id = parseInt(status);
        const message = AllStatusName.find(item => item.value === Id);
        return message ? message.label : null
      },
    },
    data() {
      return {
        // 遮罩层
        loading: false,
        //每日进度列表
        keepList: [],
        //附件列表
        fileList: [],
        //对齐方式
        labelPosition: 'right',
        //处理人列表
        userIdParams: {
          pageNum: 'all',
          // deptId: 5
        },
        //跟进人列表
        userIdList: [],
        //科室树选项
        officeIdParams: {
          pageNum: 'all',
          parentId: 5,
        },
        //科室列表
        officeIdOptions: [],
        //维护状态选择
        statusList: [
          {value: "每日答复", label: "每日答复"},
          {value: "申请关闭", label: "申请关闭"},
        ],
        // 描述参数
        description: {},
        //跟进参数
        FollowPrams: {
          questionFollow: undefined,
          pageNum: 1,
        },
        //每日进度关闭后修改问题的状态
        params:{},
        // 表单参数
        form: {
          officeId: undefined,
          userId: undefined,
          status: undefined,
          content: undefined,
          questionFollow: undefined,
          fileId: undefined,
          fileName: undefined,
        },
        // 表单校验
        rules: {
          officeId: [{required: true, message: '请输入分析科室', trigger: 'change'}],
          userId: [{required: true, message: '请输入处理人', trigger: 'change'}],
          status: [{required: true, message: '请输入维护状态', trigger: 'change'}],
          content: [{required: true, message: '请输入每日答复', trigger: 'change'}],
        },
      }
    },
    created() {
      this.getDeptInfo();
    },
    methods: {
      // // 获取当前人员信息
      // getPercentInfo() {
      //   getUserProfile().then(response => {
      //     // AllPercentName=response.data;
      //     console.log(response.data);
      //     this.form.userId = response.data.id
      //   })
      // },
      //获取部门信息列表
      getDeptInfo() {
        listDept(this.officeIdParams).then(response => {
          AllOfficeName = response.data;
          this.officeIdOptions = response.data;
          this.getUserIdList();
        })
      },
      //加载全部人员信息
      getUserIdList() {
        listUser(this.userIdParams).then(response => {
          AllSubmitterName = response.data;
          AllFollowPersonName = response.data;
          this.userIdList = response.data;
          this.getStatusList();
        })
      },
      //加载问题状态信息
      getStatusList() {
        AllStatusName = [{value: 0, label: "未关闭"}, {value: 1, label: "已关闭"},];
        this.getDailyProgressList();
        this.getDescriptionList();
      },
      /*多选框选中数据*/
      handleFollowChange(selection) {
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
        // console.log(file, fileList);
      },
      handlePreview(file) {
        // console.log(file);
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
      deleteAttachment(fileId, fileName) {
        this.$confirm('是否确认删除名称为"' + fileName + '"的文件?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          //删除文件内容
          return delSaveFile(fileId);
        }).then(() => {
          this.fileList = [];
          this.form.fileId = null;
          this.form.fileName = null;
          this.msgSuccess("删除成功");
        })
      },
      // 附件按钮禁用
      disableJudge(id) {
        return id > 0;
      },
      /*同意关闭每日进度*/
      agreeQualityFollow() {
        this.$confirm('是否同意关闭名称为"' + "quesTitle" + '"的每日进度?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.form.questionFollow = parseInt(this.$route.query.id);
          this.form.status = "批准关闭";
          this.form.content = "OK";
          //获取权限管理员信息
          getUserProfile().then(response => {
            this.form.officeId=response.data.deptId;
            this.form.userId = response.data.id;
            //同意时添加一条同意进度
            DailyProgressAdd(this.form).then(response => {
              console.log(response.data);
              this.getDailyProgressList();
              this.getDescriptionList();
              this.msgSuccess("批准关闭");
            });
          });
        })
      },
      //驳回关闭
      rejectQualityFollow(){

      },
      /*每日答复列表*/
      getDailyProgressList() {
        this.loading = true;
        qualityFollowGet(parseInt(this.$route.query.id)).then(response=>{
          // console.log(response.data.daily_follow)
          this.keepList =response.data.daily_follow;
          this.total = response.data.count;
          this.loading = false;
        }).catch(err => {
        })
      },
      //详情列表
      getDescriptionList() {
        this.description.id=parseInt(this.$route.query.id);
        qualityFollowGet(this.description.id).then(response=>{
          this.description =response.data;
          this.description.content=response.data.daily_follow.slice(-1)[0].content;
        })
      },
      //提交表单
      onSubmit(queryForm) {
        this.form.questionFollow = parseInt(this.$route.query.id);
        this.$refs[queryForm].validate((valid) => {
          // 问题新增提交
          if (valid) {
            const loading = this.$loading({
              lock: true,
              spinner: 'el-icon-loading',
              text: '信息上传中',
              background: 'rgba(0,0,0,0.7)'
            });
            DailyProgressAdd(this.form).then(response => {
              this.getDailyProgressList();
              this.getDescriptionList();
              loading.close();
              this.msgSuccess("新增成功");
              this.$refs[queryForm].resetFields();
            });

            // //跳转至显示页面
            // this.questionPath(response.data.id);
          } else {
            console.log('error submit!!');
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

