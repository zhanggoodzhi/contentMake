import deepClone from 'clone';
const state = {
	//请求试题篮参数
	paperFocusInput: null,
	searchBasketParams: {
		ContentCount: 0,
		AreaType: 1,
		TemplateID: '',
		Pageparam: {
			PageSize: 10,
			PageIndex: 1
		}
	},
	//获取试题篮结果
	resultQuestionBasket: {
		hasNoData: false,
		loadingData: false,
		questionTotalCount: 0,
		questionBasketList: null
	},
	toDeleteMediaArr: [],
	paperData: null,
	// 校验的错误存放的数组
	error: [],
	areaIndex: -1,
	questionIndex: -1
};
const CloneState = deepClone(state);
const mutations = {
	resetEditPaperState(state) {
		for (var i in CloneState) {
			state[i] = CloneState[i]; 
		}
	},
	changePaperFocusInput(state, value) {
		state.paperFocusInput = value;
	},
	resetDeleteMediaArr() {
		state.toDeleteMediaArr = [];
	},
	pushDeleteMedia(state, id) {
		state.toDeleteMediaArr.push(id);
	},
	changeError(state, value) {
		state.error = value;
	},
	changePaperData(state, value) {
		state.paperData = value;
	},
	changeAreaIndex(state, value) {
		state.areaIndex = value;
	},
	changeQuestionIndex(state, value) {
		state.questionIndex = value;
	},
	changeSearchBasketParams(state, value) {
		state.searchBasketParams = value;
	},
	changeResultQuestionBasket(state, value) {
		state.resultQuestionBasket = value;
	}
};
const getters = {};
const actions = {};
export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
};
