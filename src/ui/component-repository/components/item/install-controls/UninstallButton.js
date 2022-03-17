import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'patternfly-react';
import { FormattedMessage } from 'react-intl';

import { componentType } from 'models/component-repository/components';

const UninstallButton = ({ component, onClickUninstall, installUninstallLoading }) => (
  <Button
    bsStyle="success"
    disabled={installUninstallLoading}
    onClick={() => onClickUninstall(component.code)}
  >
    <FormattedMessage id="componentRepository.components.uninstall" />
    {component.installedJob && (
      <span> {component.installedJob.componentVersion}</span>
    )}
  </Button>
);

UninstallButton.propTypes = {
  component: componentType.isRequired,
  onClickUninstall: PropTypes.func.isRequired,
  installUninstallLoading: PropTypes.bool.isRequired,
};

export default UninstallButton;
