import config from "@/config/index";
import deepClone from "clone";
const audioElement = new Audio();
let ifBindEndEvent = false;
let ifBindLoadEvent = false;
let audioTimer;
const state = {
	routeComponentAlive: true,
	//全局显示loading
	showGlobLading: false,
	// 红色confirm模态框
	redConfirmModalVisible: false,
	redConfirmModalContent: '',
	redConfirmModalCb: () => { },
	// 导出用的进度条模态框
	loadingModalVisible: false,
	loadingModalPercent: 0,
	loadingModalTitle: '',
	currentAudio: '',
	// 音频剩余时间
	audioTime: 0,
	// 存放音频的初始时间
	audioLoadTimeMap: {
	},
	userDetail: {},
	/*城市列表，用于模板和试卷的城市选择模块。来自服务器
	结构{
	CityID：
	CityName：
	ProvinceID：
	ProvinceName：}
	*/
	CityList: [],
	/*考查能力， 用于题型属性
	LV结构
	ID：
	Name：
	Level：
	ParentID*/
	Ability: {
		Lv1: null,
		Lv2: null,
		Lv3: null
	},

	/* 题型列表 结构
	AreaType:
	AreaTypeDesc: */
	AreaTypeList: null,

	/* 试卷类型集合
	PaperTypeID:
	PaperTypeName:
	Remark: */
	PaperTypeList: null,

	/* 年级集合
	GradeID:
	GradeName:
	Remark: */
	GradeList: null,

	/* 试卷列表
	PaperID:
	PaperName: */
	PaperNameList: null,

	/* 教材列表
	CurrentNode:
	SubNodeList:
	            MaterialD:
	            MaterialName: */
	MaterialTree: null,

	/* TotalCount 
	BasketCountItems:  
					 UserID   
					 AreaType 
					 Count  */
	BasketCountList: null
};

const mutations = {
	changeAudioLoadTimeMap(state, { url, time, allTime }) {
		const newMap = { ...state.audioLoadTimeMap };
		const obj = {};
		if (time) {
			obj.time = time;
		}
		if (allTime) {
			obj.allTime = allTime;
		}
		newMap[url] = { ...newMap[url], ...obj };
		state.audioLoadTimeMap = newMap;
	},
	changeRouteComponentAlive(state, value) {
		state.routeComponentAlive = value;
	},
	changeAudioTime(state, value) {
		state.audioTime = value;
	},
	changeGloabLoadingVisible(state, value) {
		state.showGlobLading = value;
	},
	changeRedConfirmModalVisible(state, value) {
		state.redConfirmModalVisible = value;
	},
	changeRedConfirmModalCb(state, value) {
		state.redConfirmModalCb = value;
	},
	changeRedConfirmModalContent(state, value) {
		state.redConfirmModalContent = value;
	},
	changeLoadingModalTitle(state, value) {
		state.loadingModalTitle = value;
	},
	changeLoadingModalVisible(state, value) {
		state.loadingModalVisible = value;
	},
	changeLoadingModalPercent(state, value) {
		state.loadingModalPercent = value;
	},
	changeUserDetail(state, value) {
		state.userDetail = value;
	},
	changeCityList(state, value) {
		state.CityList = value;
	},
	changeCurrentAudio(state, url) {
		state.currentAudio = url;
	},
	changeAbility(state, value) {
		state.Ability.Lv1 = value.AbilityLv1;
		state.Ability.Lv2 = value.AbilityLv2;
		state.Ability.Lv3 = value.AbilityLv3;
	},
	changeAreaType(state, value) {
		state.AreaTypeList = value;
	},
	changePaperType(state, value) {
		state.PaperTypeList = value;
	},
	changeGrade(state, value) {
		state.GradeList = value;
	},
	changePaperName(state, value) {
		state.PaperNameList = value;
	},
	changeMaterialTree(state, value) {
		state.MaterialTree = value;
	},
	changeBasketCountList(state, value) {
		state.BasketCountList = value;
	},
};

// getters
const getters = {
	ifPlaying: state => url => {
		return state.currentAudio == url;
	}
};
const actions = {
	stopAudio(context) {
		if (context.state.audioLoadTimeMap[context.state.currentAudio]) {
			context.commit('changeAudioLoadTimeMap', { url: context.state.currentAudio, time: context.state.audioLoadTimeMap[context.state.currentAudio].allTime });
		}
		audioElement.src = '';
		audioElement.pause();
		context.commit('changeCurrentAudio', '');
		clearInterval(audioTimer);
	},
	togglePlay(context, url) {
		if (!ifBindEndEvent) {
			audioElement.addEventListener('ended', () => {
				// context.commit('changeAudioTime', audioElement.duration);
				if (context.state.audioLoadTimeMap[context.state.currentAudio]) {
					context.commit('changeAudioLoadTimeMap', { url: context.state.currentAudio, time: context.state.audioLoadTimeMap[context.state.currentAudio].allTime });
				}
				audioElement.src = '';
				context.commit('changeCurrentAudio', '');
				clearInterval(audioTimer);
			});
			ifBindEndEvent = true;
		}
		// 暂停播放
		if (context.state.currentAudio == url) {
			audioElement.pause();
			// context.commit('changeAudioTime', audioElement.duration);
			if (context.state.audioLoadTimeMap[url]) {
				context.commit('changeAudioLoadTimeMap', { url, time: context.state.audioLoadTimeMap[url].allTime });
			}
			audioElement.src = '';
			context.commit('changeCurrentAudio', '');
			clearInterval(audioTimer);
			return;
		}
		// 点击了另一个音频,原先音频时间恢复
		if (context.state.currentAudio && context.state.audioLoadTimeMap[context.state.currentAudio]) {
			context.commit('changeAudioLoadTimeMap', { url: context.state.currentAudio, time: context.state.audioLoadTimeMap[context.state.currentAudio].allTime });
		}
		clearInterval(audioTimer);
		audioElement.src = url;
		context.commit('changeCurrentAudio', url);
		audioElement.play();
		if (context.state.audioLoadTimeMap[url]) {
			audioTimer = setInterval(() => {
				// context.commit('changeAudioTime', context.state.audioTime - 0.5);
				context.commit('changeAudioLoadTimeMap', { url, time: context.state.audioLoadTimeMap[url].time - 0.5 });
			}, 500);
		}
	},
	reloadRoute(context) {
		context.commit('changeRouteComponentAlive', false);
		setTimeout(() => {
			context.commit('changeRouteComponentAlive', true);
		}, 200);
	},
	loadAudio(context, url) {
		return new Promise((resolve, reject) => {
			if (!url || url === window.API_URL) {
				resolve(false);
				return;
			}
			audioElement.addEventListener("error", (e) => {
				reject(new Error('音频出错'));
			}, {
					once: true
				});
			audioElement.addEventListener("loadedmetadata", (e) => {
				context.commit('changeAudioLoadTimeMap', { url, time: audioElement.duration, allTime: audioElement.duration });
				resolve(audioElement.duration);
			}, {
					once: true
				});
			audioElement.src = url;
			audioElement.load();
		})
	}
};
export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
};
