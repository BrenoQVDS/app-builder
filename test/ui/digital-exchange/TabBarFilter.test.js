import React from 'react';
import 'test/enzyme-init';
import { shallow } from 'enzyme';

import TabBarFilter from 'ui/digital-exchange/common/TabBarFilter';
import { mapStateToProps, mapDispatchToProps } from 'ui/digital-exchange/CategoryTabBarFilterContainer';
import { ALL_CATEGORIES_CATEGORY } from 'state/digital-exchange/categories/const';
import { LIST_DE_CATEGORIES_OK } from 'test/mocks/digital-exchange/categories';
import { fetchDECategories } from 'state/digital-exchange/categories/actions';
import { navigateDECategory } from 'state/digital-exchange/actions';
import { mockRenderWithIntlAndStore } from 'test/testUtils';


const TEST_STATE = {
  digitalExchanges: {
    list: [],
  },
  digitalExchangeCategories: {
    list: LIST_DE_CATEGORIES_OK,
    selected: ALL_CATEGORIES_CATEGORY,
  },
  digitalExchangeComponents: {
    list: [],
    selected: {},
    componentListViewMode: '',
    filters: {},
  },
};

jest.mock('state/digital-exchange/actions', () => ({
  navigateDECategory: jest.fn(),
}));

jest.mock('state/digital-exchange/categories/actions', () => ({
  fetchDECategories: jest.fn(),
}));

jest.mock('state/loading/selectors', () => ({
  getLoading: jest.fn(),
}));

jest.unmock('react-redux');

const dispatchMock = jest.fn();


describe('TabBarFilter', () => {
  let component;
  let noop;

  beforeEach(() => {
    noop = jest.fn();
    component = shallow(mockRenderWithIntlAndStore(<TabBarFilter
      onSelect={noop}
      onWillMount={noop}
      filterTabs={[{
        label: 'category',
        value: 'category',
      }]}
      selectedFilterTab="all"
      attributes={{
        componentClass: 'CategoryTabs',
        componentId: 'de-category-tabs',
      }}
    />));
  });

  it('renders without crashing', () => {
    expect(component.exists()).toEqual(true);
  });

  it('maps digitalExchangeCategories property state', () => {
    const filterTabs = [
      ALL_CATEGORIES_CATEGORY,
      ...TEST_STATE.digitalExchangeCategories.list,
    ].map(filterTab => ({
      value: filterTab,
    }));
    expect(mapStateToProps(TEST_STATE, {
      intl: {
        formatMessage: () => {},
        injectIntl: ui => ui,
      },
    })).toEqual({
      filterTabs,
      selectedFilterTab: ALL_CATEGORIES_CATEGORY,
      attributes: {
        componentClass: 'CategoryTabs',
        componentId: 'de-category-tabs',
      },
    });
  });

  describe('mapDispatchToProps', () => {
    let props;
    beforeEach(() => {
      props = mapDispatchToProps(dispatchMock);
    });

    it('should map the correct function properties', () => {
      expect(props.onWillMount).toBeDefined();
      expect(props.onSelect).toBeDefined();
    });

    it('should dispatch an action if onWillMount is called', () => {
      props.onWillMount({});
      expect(dispatchMock).toHaveBeenCalled();
      expect(fetchDECategories).toHaveBeenCalled();
    });

    it('should dispatch an action if tab is selected', () => {
      const category = 'category';
      props.onSelect(category);
      expect(dispatchMock).toHaveBeenCalled();
      expect(navigateDECategory).toHaveBeenCalledWith(category);
    });
  });
});
