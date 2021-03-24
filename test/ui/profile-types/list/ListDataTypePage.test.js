import React from 'react';
import 'test/enzyme-init';

import { ListProfileTypePageBody } from 'ui/profile-types/list/ListProfileTypePage';
import { shallowWithIntl } from 'test/legacyTestUtils';

describe('ListProfileTypePage', () => {
  let component;
  beforeEach(() => {
    component = shallowWithIntl(<ListProfileTypePageBody />);
  });

  it('renders without crashing', () => {
    expect(component.exists()).toBe(true);
  });

  it('verify if InternalPage component has class ListProfileTypePage', () => {
    expect(component.find('InternalPage').hasClass('ListProfileTypePage')).toBe(true);
  });

  it('verify if has a breadcrumb', () => {
    expect(component.find('Breadcrumb').exists());
  });

  it('verify if has a page title', () => {
    expect(component.find('PageTitle').exists());
  });

  it('verify if has the add button', () => {
    expect(component.find('Button.ListProfileTypePage__add').exists());
  });
});
