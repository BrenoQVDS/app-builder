import { get } from 'lodash';
import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button } from 'patternfly-react';

import { getMicrofrontend, renderMicrofrontend } from 'helpers/microfrontends';
import { getResourcePath } from 'helpers/resourcePath';
import useScripts from 'helpers/useScripts';
import useStylesheets from 'helpers/useStylesheets';

const WidgetConfigMicrofrontend = ({ onSubmit, widget, widgetConfig }) => {
  const resources = get(widget, 'configUi.resources', []).map(getResourcePath);
  const customElement = get(widget, 'configUi.customElement');

  const scripts = resources.filter(res => res.endsWith('.js'));
  const styleSheets = resources.filter(res => res.endsWith('.css'));

  const [everyScriptLoaded, someScriptError] = useScripts(scripts);
  const [everyStylesheetLoaded, someStylesheetError] = useStylesheets(styleSheets);

  // eslint-disable-next-line no-unused-vars
  const [enableSubmit, setEnableSubmit] = useState(true);

  useEffect(() => {
    const widgetConfigListenerName = 'widget-config';
    const listener = (e) => {
      const { save } = e.detail;
      setEnableSubmit(save);
    };

    window.addEventListener(widgetConfigListenerName, listener);

    return () => window.removeEventListener(widgetConfigListenerName, listener);
  }, []);

  const handleSubmit = () => {
    const configWebComponent = getMicrofrontend(customElement);
    const updatedWidgetConfig = configWebComponent ? configWebComponent.config : null;
    onSubmit(updatedWidgetConfig);
  };

  useEffect(() => {
    const microfrontend = getMicrofrontend(customElement);
    if (everyScriptLoaded && microfrontend && widgetConfig) {
      microfrontend.config = widgetConfig;
    }
  }, [customElement, everyScriptLoaded, widgetConfig]);

  const microfrontendMarkup = renderMicrofrontend(customElement);

  return (scripts.length && everyScriptLoaded && everyStylesheetLoaded
    && !someScriptError && !someStylesheetError) ?
    (
      <Fragment>
        {microfrontendMarkup}
        <Button
          className="pull-right save"
          type="submit"
          bsStyle="primary"
          onClick={handleSubmit}
        ><FormattedMessage id="app.save" />
        </Button>
      </Fragment>
    ) : <FormattedMessage id="widget.page.config.error" />;
};

WidgetConfigMicrofrontend.propTypes = {
  widget: PropTypes.shape({}).isRequired,
  widgetConfig: PropTypes.shape({}),
  onSubmit: PropTypes.func.isRequired,
};

WidgetConfigMicrofrontend.defaultProps = {
  widgetConfig: null,
};

export default WidgetConfigMicrofrontend;
