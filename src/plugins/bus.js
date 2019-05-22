// 事件绑定器
import Vue from 'vue'

export const bus = new Vue;

// 事件名全写在这边，统一管理
export const updateLayoutUserDetailEvent = 'updateLayoutUserDetailEvent';

export const updateBasketStateEvent = 'updateBasketStateEvent';

export const updateTopBasketEvent = 'updateTopBasketEvent';

// 模板听力题小题序号
export const rankListenQuestion = 'rankListenQuestion';