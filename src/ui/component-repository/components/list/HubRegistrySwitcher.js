import React, { useEffect, Fragment } from 'react';
import { Row, Col, DropdownKebab, MenuItem, Icon } from 'patternfly-react';
import { useSelector, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { fetchRegistries, setActiveRegistry, setFetchedBundleGroups, setFetchedBundlesFromRegistry } from 'state/component-repository/hub/actions';
import { getRegistries, getSelectedRegistry } from 'state/component-repository/hub/selectors';
import { ECR_LOCAL_REGISTRY_NAME } from 'state/component-repository/hub/reducer';
import { setVisibleModal, setInfo } from 'state/modal/actions';
import { ADD_NEW_REGISTRY_MODAL_ID } from 'ui/component-repository/components/list/AddNewRegistryModal';
import { DELETE_REGISTRY_MODAL_ID } from 'ui/component-repository/components/list/DeleteRegistryModal';
import { EDIT_REGISTRY_MODAL_ID } from 'ui/component-repository/components/list/EditRegistryModal';

const DEFAULT_ECR_REGISTRY = {
  name: ECR_LOCAL_REGISTRY_NAME,
  url: '',
};

const HubRegistrySwitcher = () => {
  const activeRegistry = useSelector(getSelectedRegistry);
  const registries = useSelector(getRegistries);
  const dispatch = useDispatch();

  const handleRegistryChange = (registry) => {
    if (registry.name !== activeRegistry.name) {
      dispatch(setFetchedBundleGroups([]));
      dispatch(setFetchedBundlesFromRegistry([]));
      dispatch(setActiveRegistry(registry));
    }
  };

  const handleNewRegistryClick = () => {
    dispatch(setVisibleModal(ADD_NEW_REGISTRY_MODAL_ID));
    dispatch(setInfo({ type: 'Registry' }));
  };

  const handleEditRegistry = (registry) => {
    dispatch(setVisibleModal(EDIT_REGISTRY_MODAL_ID));
    dispatch(setInfo({ editData: registry }));
  };

  const handleDeleteRegistry = (registry) => {
    if (activeRegistry.id === registry.id) return;
    dispatch(setVisibleModal(DELETE_REGISTRY_MODAL_ID));
    dispatch(setInfo({ type: 'Registry', code: registry.name, id: registry.id }));
  };

  useEffect(() => { dispatch(fetchRegistries()); }, [dispatch]);

  useEffect(() => {
    handleRegistryChange(DEFAULT_ECR_REGISTRY);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Row className="HubRegistrySwitcher">
      <Col md={12}>
        <div className="HubRegistrySwitcher__body">
          <div className="HubRegistrySwitcher__data">
            <div className="HubRegistrySwitcher__title">
              {activeRegistry.name}
            </div>
            <div className="HubRegistrySwitcher__description">
              {activeRegistry.url}
            </div>
          </div>
          <div className="HubRegistrySwitcher__switcher">
            <div className="HubRegistrySwitcher__switcher-label">
              <FormattedMessage id="hub.selectRegistry" />
            </div>
            <div className="HubRegistrySwitcher__switcher-dropdown">
              <DropdownKebab pullRight id="hub-registry-switcher">
                {
                  registries.map(reg => (
                    <MenuItem
                      id={reg.name}
                      key={reg.name}
                      className="HubRegistrySwitcher__kebab-menu-item"
                      disabled={reg.name === activeRegistry.name}
                    >
                      <div
                        role="button"
                        tabIndex={-1}
                        onClick={() => handleRegistryChange(reg)}
                        onKeyDown={() => handleDeleteRegistry(reg)}
                        className="HubRegistrySwitcher__action-label"
                      >
                        <span
                          style={{ visibility: reg.apiKeyPresent ? 'visible' : 'hidden' }}
                          className="HubRegistrySwitcher__key-icon pficon pficon-key fa-lg"
                        />
                        {reg.name}
                      </div>
                      {
                        reg.name !== ECR_LOCAL_REGISTRY_NAME && (
                          <Fragment>
                            <div
                              role="button"
                              tabIndex={-1}
                              className="HubRegistrySwitcher__edit"
                              onClick={() => handleEditRegistry(reg)}
                              onKeyDown={() => handleEditRegistry(reg)}
                            >
                              <Icon size="lg" name="edit" />
                            </div>
                            <div
                              role="button"
                              tabIndex={-1}
                              className="HubRegistrySwitcher__trash"
                              onClick={() => handleDeleteRegistry(reg)}
                              onKeyDown={() => handleDeleteRegistry(reg)}
                            >
                              <Icon size="lg" name="trash" />
                            </div>
                          </Fragment>
                        )
                      }
                    </MenuItem>
                  ))
                }
                <MenuItem
                  id="addNewRegistry"
                  className="HubRegistrySwitcher__kebab-menu-item--new"
                  onClick={handleNewRegistryClick}
                >
                  <div className="HubRegistrySwitcher__action-label--new">
                    <FormattedMessage id="hub.newRegistry" />
                  </div>
                </MenuItem>
              </DropdownKebab>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default HubRegistrySwitcher;
