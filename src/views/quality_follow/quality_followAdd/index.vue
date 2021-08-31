<template>
  <div class="app-container">
    <el-form :model="form" ref="queryForm" :inline="true" :rules="rules" :label-position="labelPosition"
             label-width="160px">
      <el-row>
        <el-form-item label="问题来源" prop="questionOrigin">
          <el-select v-model="form.questionOrigin" clearable size="small">
            <el-option v-for="dict in questionOriginOptions" :key="dict.value" :label="dict.label"
                       :value="dict.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="责任科室" prop="officeId">
          <el-select v-model="form.officeId" size="small" placeholder="请选择" @change="getResPersonInfo(form.officeId)"
                     clearable>
            <el-option v-for="item in officeIdOptions" :value="item.id" :label="item.deptName"
                       :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="责任人" prop="resPerson">
          <el-input v-model="form.resPerson" clearable size="small" placeholder="请输入责任人" disabled/>
        </el-form-item>
        <el-form-item label="跟进人" prop="followPerson">
          <el-select v-model="form.followPerson" clearable size="small" placeholder="请输入跟进人">
            <el-option v-for="dict in followPersonList" :key="dict.id" :label="dict.name" :value="dict.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="下单人" prop="userName">
          <el-input v-model="form.submitter_name" clearable size="small" placeholder="请输入下单人" disabled/>
        </el-form-item>
        <el-form-item label="发生时间" prop="occurTime">
          <el-date-picker v-model="form.occurTime" clearable type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                          style="width: 188px" size="small" :picker-options="pickerOptions"
                          placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="是否涉及其它产品" prop="relate">
          <el-select v-model="form.relate" clearable size="small">
            <el-option v-for="dict in relateOptions" :key="dict.value" :label="dict.label" :value="dict.value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.submitter" clearable size="small" placeholder="请输入下单人" type="hidden"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.status" clearable size="small" placeholder="请输入问题状态" type="hidden"/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="问题主题" prop="quesTitle">
          <el-input v-model="form.quesTitle" type="textarea" style="width: 905px" :autosize="{minRows: 2}"
                    clearable size="small" placeholder="请输入问题主题"/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="问题描述" prop="quesDescription">
          <el-input v-model="form.quesDescription" type="textarea" style="width: 905px" :autosize="{minRows: 2}"
                    placeholder="请输入问题描述"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="原因分析" prop="causeAnalysis">
          <el-input v-model="form.causeAnalysis" type="textarea" style="width: 905px" :autosize="{minRows: 2}"
                    placeholder="请输入原因分析"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="临时方案" prop="tempSolution">
          <el-input v-model="form.tempSolution" type="textarea" style="width: 905px" :autosize="{minRows: 2}"
                    placeholder="请输入临时方案"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="长期方案" prop="longSolution">
          <el-input v-model="form.longSolution" type="textarea" style="width: 905px" :autosize="{minRows: 2}"
                    placeholder="请输入长期方案"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="预防措施" prop="alternative">
          <el-input v-model="form.alternative" type="textarea" style="width: 905px" :autosize="{minRows: 2}"
                    placeholder="请输入预防措施"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="详细计划(时间、节点)" prop="detailPlan">
          <el-input v-model="form.detailPlan" type="textarea" style="width: 905px" :autosize="{minRows: 2}"
                    placeholder="请输入详细计划(时间、节点)"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="最新进度" prop="content">
          <el-input v-model="form.content" type="textarea" style="width: 905px" :autosize="{ minRows: 2}"
                    placeholder="请输入最新进度" :disabled="disabled"></el-input>
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
        <el-button @click="resetForm('queryForm')" :disabled="disabled">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.fileId" type="hidden"></el-input>
        <el-input v-model="form.fileName" type="hidden"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {DailyProgressAdd,} from "@/api/quality_follow/daily_progress";
  import {qualityFollowAdd, qualityFollowGet, qualityFollowUpdate} from "@/api/quality_follow/quality_follow";
  import {addSaveFile, getSaveFile, delSaveFile} from "@/api/vadmin/system/savefile";
  import {getUserProfile, listUser} from "@/api/vadmin/permission/user";
  import {getDept, listDept} from "@/api/vadmin/permission/dept";


  export default {
    name: "Index",
    data() {
      return {
        // 遮罩层
        loading: true,
        //对齐方式
        labelPosition: 'right',
        //最新进度
        disabled: false,
        //附件列表
        fileList: [],
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
        //责任人列表
        resPersonOptions: [],
        //跟进人选项
        followPersonParams: {
          pageNum: 'all',
          deptId: 5
        },
        //跟进人列表
        followPersonList: [],
        //问题来源树选项
        questionOriginOptions: [
          {value: '厂内', label: '厂内'},
          {value: '厂外', label: '厂外'}
        ],
        //关闭与否树选项
        relateOptions: [
          {value: '否', label: '否'},
          {value: '是', label: '是'}
        ],
        // 表单参数
        form: {
          questionOrigin: "厂内",
          officeId: undefined,
          resPerson: undefined,
          followPerson: undefined,
          submitter_name: undefined,
          submitter: undefined,
          occurTime: undefined,
          relate: "否",
          quesTitle: undefined,
          quesDescription: undefined,
          causeAnalysis: undefined,
          tempSolution: undefined,
          longSolution: undefined,
          alternative: undefined,
          detailPlan: undefined,
          content: undefined,
          status: 0,
          fileId: undefined,
          fileName: undefined,
        },
        //最新进度参数
        params: {
          officeId: undefined,
          userId: undefined,
          status: "新建任务单",
          content: undefined,
          questionFollow: undefined,
        },
        // 表单校验
        rules: {
          questionOrigin: [{required: true, message: '请输入问题来源', trigger: 'change'}],
          officeId: [{required: true, message: '请输入责任科室', trigger: 'change'}],
          resPerson: [{required: true, message: '请输入责任人', trigger: 'change'}],
          followPerson: [{required: true, message: '请选择跟进人', trigger: 'change'}],
          submitter_name: [{required: true, message: '请选择下单人', trigger: 'change'}],
          occurTime: [{required: true, message: '请选择发生时间', trigger: 'change'}],
          relate: [{required: true, message: '请选择是否涉及其它产品', trigger: 'change'}],
          quesTitle: [{required: true, message: '请输入问题主题', trigger: 'change'}],
          quesDescription: [{required: true, message: '请输入问题描述', trigger: 'change'}],
          causeAnalysis: [{required: true, message: '请输入原因分析', trigger: 'change'}],
          tempSolution: [{required: true, message: '请输入临时方案', trigger: 'change'}],
          longSolution: [{required: true, message: '请输入长期方案', trigger: 'change'}],
          alternative: [{required: true, message: '请输入预防措施', trigger: 'change'}],
          detailPlan: [{required: true, message: '请输入详细计划(时间、节点)', trigger: 'change'}],
          content: [{required: true, message: '请输入问题进度', trigger: 'change'}],
        },
      }
    },
    created() {
      this.getJudgement();
    },
    methods: {
      //加载全部人员信息
      getFollowPersonList() {
        listUser(this.followPersonParams).then(response => {
          this.followPersonList = response.data;
        })
      },
      // 获取下单人信息
      getSubmitterInfo() {
        getUserProfile().then(response => {
          this.form.submitter_name = response.data.name;
          this.form.submitter = response.data.id
        })
      },
      //获取部门信息列表
      getDeptInfo() {
        listDept(this.officeIdParams).then(response => {
          this.officeIdOptions = response.data
        })
      },
      //获取责任人信息
      getResPersonInfo(officeId) {
        getDept(officeId).then(response => {
          this.form.resPerson = response.data.leader
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
      //判断是更新还是新增
      getJudgement() {
        if (this.$route.query.id) {
          this.loading = true;
          qualityFollowGet(parseInt(this.$route.query.id)).then(response => {
            console.log(response.data);
            this.disabled = true;
            this.form = response.data;
            this.form.content = response.data.daily_follow.slice(-1)[0].content;
            this.fileList = [];
            if (this.form.fileId !== null) {
              this.selectSaveFileId(this.form.fileId);
            }
            this.getDeptInfo();
            this.getSubmitterInfo();
            this.getFollowPersonList();
            this.loading = false;
          }).catch(err => {
          })
        } else {
          this.getDeptInfo();
          this.getSubmitterInfo();
          this.getFollowPersonList();
        }
      },
      /* 修改时加载附件内容*/
      selectSaveFileId(fileId) {
        getSaveFile(fileId).then(response => {
          this.fileList.push(response.data)
        })
      },
      //提交表单
      onSubmit(queryForm) {
        this.$refs[queryForm].validate((valid) => {
          // 问题新增提交
          if (valid) {
            const loading = this.$loading({
              lock: true,
              spinner: 'el-icon-loading',
              text: '信息上传中',
              background: 'rgba(0,0,0,0.7)'
            });
            //
            if (this.$route.query.id) {
              qualityFollowUpdate(this.form).then(response => {
                loading.close();
                this.msgSuccess("修改成功");
                this.$refs[queryForm].resetFields();
                this.$refs.upload.clearFiles();
                this.$router.push({name: 'Quality_followlist', params: {id: response.data.id}})
              })
            } else {
              qualityFollowAdd(this.form).then(response => {
                this.params.questionFollow = response.data.id;
                this.params.userId = this.form.submitter;
                this.params.officeId = this.form.officeId;
                this.params.content = this.form.content;
                const questionId = response.data.id;
                DailyProgressAdd(this.params).then(response => {
                  loading.close();
                  this.msgSuccess("新增成功");
                  this.$refs[queryForm].resetFields();
                  this.$refs.upload.clearFiles();
                  this.$router.push({name: 'Quality_followlist', params: {id: questionId}})
                })
              });
            }
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

