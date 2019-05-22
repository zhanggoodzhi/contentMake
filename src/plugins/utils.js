import moment from 'moment';
import deepClone from 'clone';
export const getUserData = () => {
	const str = localStorage.getItem('contentProduceSystemUserData');
	if (!str) {
		return null;
	}
	return JSON.parse(str);
};
export const ifadmin = () => {
	const data = getUserData();
	if (data && data.userRole == 3) {
		return true;
	}
	return false;
};

export const formatComplexDate = date => {
	return moment(date).format('YYYY/MM/DD HH:mm');
};

export const formatDate = date => {
	return moment(date).format('YYYY/MM/DD');
};

export const secondToMin = result => {
	let m = Math.floor(result / 60);
	let s = Math.floor(result % 60);
	if (m < 10) {
		m = '0' + m;
	}
	if (s < 10) {
		s = '0' + s;
	}
	return (result = m + ':' + s);
};
// 改area层的参数（obj为key:value形式）
export const changeAreaProp = (self, obj) => {
	self.$nextTick(() => {
		const index = self.option.pageIndex;
		const newData = deepClone(self.option);
		Object.keys(obj).forEach(v => {
			newData.templateData.TemplateAreaViewModels[index][v] = deepClone(obj[v]);
		});
		self.changeOption(newData);
	});
};
// 改question层的参数（obj为key:value形式）
export const changeQuestionProp = (self, obj) => {
	
	self.$nextTick(() => {
		const pageIndex = self.option.pageIndex;
		const questionIndex = self.option.questionIndex;
		const newData = deepClone(self.option);
		Object.keys(obj).forEach(v => {
			newData.templateData.TemplateAreaViewModels[
				pageIndex
			].TemplateQuestionViewModels[questionIndex][v] = obj[v];
		});
		self.changeOption(newData);
	});
};
// 改content层的参数（obj为key:value形式）
export const changeContentProp = (self, contentIndex, obj) => {
	self.$nextTick(() => {
		const pageIndex = self.option.pageIndex;
		const questionIndex = self.option.questionIndex;
		const newData = deepClone(self.option);
		Object.keys(obj).forEach(v => {
			newData.templateData.TemplateAreaViewModels[
				pageIndex
			].TemplateQuestionViewModels[questionIndex].TemplateContentViewModels[
				contentIndex
			][v] = obj[v];
		});
		self.changeOption(newData);
	});
};
//将后台返回的路径改成可用的路径
export const getFormatUrl = url => {
	if (url) {
		return window.API_URL + url;
	}
	return false;
};