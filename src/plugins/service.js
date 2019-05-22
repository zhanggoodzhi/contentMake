import { KAOLA_API, API } from '@/plugins/axios';

import * as qs from 'qs';

/**用户类**********************************************************************************************************************/

// 登录
export const getToken = params => KAOLA_API.post(`/token`, qs.stringify(params));
// 获取当前账户信息
export const userdetail = params =>
	KAOLA_API.get(`api/account/userdetail?${qs.stringify(params)}`);
// 更新用户信息
export const updateUserInfoForPaperDesign = params =>
	KAOLA_API.post(`/api/account/updateUserInfoForPaperDesign`, params);
// 更新密码
export const updateUserPassWordInfo = params =>
	KAOLA_API.post(`api/account/updateUserPassWordInfo`, params);

/**模板类**********************************************************************************************************************/

//请求模板列表接口
export const GetTemplateList = params =>
	API.post(`api/PaperTemplate/GetTemplateList`, params);
//新加和更新模板接口（新加时TemplateID为空 更新时TemplateID为需要更新的TemplateID）
export const UpdateTemplate = params =>
	API.post(`api/PaperTemplate/UpdateTemplate`, params);
//模板名称修改
export const UpdateTemplateName = params =>
	API.post(`api/PaperTemplate/UpdateTemplateName`, params);
//模板状态修改
export const UpdateTemplateStatus = params =>
	API.post(`api/PaperTemplate/UpdateTemplateStatus`, params);
//获取模板信息接口
export const GetTemplate = params =>
	API.get(`api/PaperTemplate/GetTemplate/${params}`);
//删除模板接口
export const DeleteTemplate = params =>
	API.get(`api/PaperTemplate/DeleteTemplate/${params}`);
//拷贝模板
export const CopyTemplate = params =>
	API.get(`api/PaperTemplate/CopyTemplate/${params}`, params);
//获取模板适用地区
export const GetYearOfTemplate = params =>
	API.get(`api/PaperTemplate/GetYearOfTemplate/${params}`, params);
//获取模板适用年份
export const GetZoneOfTemplate = params =>
	API.get(`api/PaperTemplate/GetZoneOfTemplate/${params}`, params);
//获取适用模板
export const GetOptionalTemplate = params =>
	API.post(`api/PaperTemplate/GetOptionalTemplate`, params);
/**上传文件类**********************************************************************************************************************/
// type 1图片，2音频
export const uploadResource = (type, params) =>
	API.post(`/api/CommonProcess/uploadResource?resourceType=${type}}`, params);
//删除文件
export const deleteResource = params =>
	API.get(`/api/CommonProcess/deleteResource/${params}`);
// 复制文件
export const copyResource = params =>
	API.get(`/api/CommonProcess/copyResource/${params}`);

/**试题篮类**********************************************************************************************************************/
//获取试题列表
export const GetQuestionBasket = params =>
	API.post(`/api/Basket/GetQuestionBasket`, params);
//试题关联用户或者移除
export const UpdateUserPaperQuestion = params =>
	API.post(`/api/Basket/UpdateUserPaperQuestion`, params);
//获取试题栏选择条件
export const GetConditionViewModel = params => API.post(`/api/Basket/GetConditionViewModel`, params);
//获取试卷名称列表 新接口 与之前的GetPaperNameList
export const GetPaperNames = params => API.post(`/api/Basket/GetPaperNameList`, params);
//获取试题篮列表用于试卷编辑
export const GetQuestionBasketDisplay = params =>
	API.post(`/api/Basket/GetQuestionBasketDisplay`, params);
//获取试题篮的选择条件(头部信息)
export const GetHeadConditionViewModel = params => API.post(`/api/Basket/GetHeadConditionViewModel`, params);
//试题篮复制和选取
export const DuplicateQuestion = params => API.post(`/api/Basket/DuplicateQuestion`, params);
//获取头部试题篮数量
export const GetCountOfAreaType = () => API.post(`/api/Basket/GetCountOfAreaType`);
//试题篮依据题型删除
export const DeleteBasketByAreaType = params => API.get(`/api/Basket/DeleteBasketByAreaType/${params}`);


/**公共类**********************************************************************************************************************/
//城市搜索接口
export const GetCityList = () => API.post(`/api/Common/GetAllCityList`);
export const GetAllAbility = () => API.post(`/api/Common/GetAllAbility`);

//获取题型接口
export const GetAreaTypeList = params =>
	API.get(`/api/Common/GetAreaType/${params}`);
//获取试卷类型接口
export const GetPaperTypeList = () => API.get(`/api/Common/GetPaperTypeList`);
//获取年级接口
export const GetGradeList = () => API.get(`/api/Common/GetGradeList`);
//获取教材接口
export const GetMaterialTree = () => API.get(`/api/Common/GetMaterialTree`);
//获取试卷名称列表
export const GetPaperNameList = params =>
	API.get(`/api/Common/GetPaperNameList/${params}`);

/**试卷类**********************************************************************************************************************/
//获取试卷列表
export const getPaperList = params =>
	API.post(`/api/paper/getPaperList`, params);

//创建试卷
export const GeneratePaper = params => {
	return API.post(`/api/paper/GeneratePaper/${params}`);
};
//更新试卷
export const UpdatePaper = params => {
	return API.post(`/api/paper/UpdatePaper`, params);
};
//获取试卷信息接口
export const GetPaper = params => {
	return API.post(`/api/paper/GetPaper/${params}`);
};
//试卷发布
export const PublishPaper = params => {
	return API.get(`/api/paper/PublishPaper/${params}`);
};
//导出
export const ExportTaskForTest = params => {
	return API.post(`/api/paper/ExportTaskForTest`, params, {
		responseType: 'blob'
	});
};
//试卷名称修改
export const UpdatePaperName = params => {
	return API.post(`/api/paper/UpdatePaperName`, params);
};
//试卷状态修改
export const UpdatePaperStatus = params => {
	return API.post(`/api/paper/UpdatePaperStatus`, params);
};
//试卷复制
export const CopyPaper = params =>
	API.get(`api/paper/CopyPaper/${params}`, params);
//试卷删除
export const DeletePaper = params =>
	API.get(`api/paper/DeletePaper/${params}`, params);
//清空试题
export const CleanPaper = params => {
	return API.post(`/api/paper/CleanPaper`, params);
};
//获取导出任务包状态
export const GetExportTaskStatus = params => {
	return API.post(`/api/paper/GetExportTaskStatus`);
};
//获取发布试卷的状态
export const GetPublishPaperStatus = params => {
	return API.post(`/api/paper/GetPublishPaperStatus/${params}`);
};
//试卷属性设置
export const UpdatePaperAttribute = params => {
	return API.post(`/api/paper/UpdatePaperAttribute`, params);
};
//预览时候的保存接口 不做任何校验
export const UpdatePaperPreview = params => {
	return API.post(`/api/paper/UpdatePaperPreview`, params);
};
//设置全真模拟的时候，是否弹出提示框
export const SetPopupShow = params => {
	return API.get(`/api/paper/SetPopupShow/${params}`);
};
//题型筛选条件
export const GetAreaTypeCondition = params => {
	return API.post(`/api/Common/GetAreaTypeCondition`, params);
};
//查询题型列表接口
export const GetAreaTypeByGradeAndZone = params => {
	return API.post(`/api/Common/GetAreaTypeByGradeAndZone`, params);
};
//查询题型列表接口
export const GetSuggestWords = params => {
	return API.get(`/api/paper/GetSuggestWords/${params}`);
};


