import React from 'react';
import 'test/enzyme-init';
import { shallow } from 'enzyme';

import ComponentList from 'ui/component-repository/components/list/ComponentList';

describe('ComponentList', () => {
  let component;
  beforeEach(() => {
    component = shallow(<ComponentList />);
  });

  it('renders without crashing', () => {
    expect(component.exists()).toEqual(true);
  });
});
