import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import _ from 'lodash';

import Quote from '@/components/Quote.vue';
const localVue = createLocalVue();
localVue.use(Vuex);

describe('Quote.vue', () => {
  let store;
  let quote = {
    id: 1,
    text: ['Watson: excellent!', 'Sherlock: elementary.'],
    author: 'Sherlock',
    interlocutor: 'Watson',
    date: '2018-01-01',
    likes: 0,
    likedBy: [],
  };

  beforeEach(() => {
    store = new Vuex.Store({
      state: {
        user: {
          uid: '1',
        },
      },
    });
  });

  it('renders quote', () => {
    const wrapper = shallowMount(Quote, {
      propsData: {
        quote: _.cloneDeep(quote),
      },
      store,
      localVue,
      stubs: ['router-link'],
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('highlight like button if user has liked', () => {
    const wrapper = shallowMount(Quote, {
      propsData: {
        quote: _.defaults({ likes: 1, likedBy: ['1'] }, quote),
      },
      store,
      localVue,
      stubs: ['router-link'],
    });

    expect(wrapper).toMatchSnapshot();
  });
});
