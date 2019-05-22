import Vue from 'vue';
import Vuex from 'vuex';
import global from './module/global';
import editPaper from './module/editPaper';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
	strict: debug,
	modules: {
		global,
		editPaper,
	}
});
