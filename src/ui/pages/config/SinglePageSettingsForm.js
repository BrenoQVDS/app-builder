import { get } from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Field, FieldArray, FormSection, reduxForm } from 'redux-form';
import { Button, Col, Form, FormGroup, Nav, NavItem, Row, TabContainer, TabContent, TabPane } from 'patternfly-react';
import { maxLength, required } from '@entando/utils';
import RenderTextInput from 'ui/common/form/RenderTextInput';
import FormLabel from 'ui/common/form/FormLabel';
import SwitchRenderer from 'ui/common/form/SwitchRenderer';
import RenderSelectInput from 'ui/common/form/RenderSelectInput';
import MultiSelectRenderer from 'ui/pages/common/MultiSelectRenderer';

export const FORM_ID = 'single-page-settings';
export const maxLength70 = maxLength(70);

const toSelectInputOptions = arrayOfStrings => (
  arrayOfStrings.map(str => ({ code: str, name: str }))
);

export class SinglePageSettingsFormBody extends Component {
  constructor(props) {
    super(props);
    this.state = { visibleTitleTranslationCode: null };
  }

  componentWillMount() {
    this.props.onWillMount();
  }

  selectVisibleTitleTranslation(code) {
    this.setState({
      visibleTitleTranslationCode: code,
    });
  }

  render() {
    const {
      handleSubmit, invalid, submitting, onReset,
      activeNonDefaultLanguages, defaultLanguage,
      groups, charsets, contentTypes, selectedJoinGroupCodes,
      intl,
    } = this.props;

    const formatText = id => intl.formatMessage({ id });

    const charsetOptions = toSelectInputOptions(charsets);
    const contentTypeOptions = toSelectInputOptions(contentTypes);

    const titleTranslationSelect = (
      <select onChange={e => this.selectVisibleTitleTranslation(e.currentTarget.value)}>
        {
          activeNonDefaultLanguages.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.code.toUpperCase()}</option>
          ))
        }
      </select>
    );

    const visibleTitleTranslationCode = this.state.visibleTitleTranslationCode
     || get(activeNonDefaultLanguages, '[0].code', '');

    const activeNonDefaultLanguagesInputs = (
      <React.Fragment>
        {
          activeNonDefaultLanguages.map(lang => lang.code).map(languageCode => (
            <span
              key={`input-${languageCode}`}
              className={visibleTitleTranslationCode === languageCode ? '' : 'SinglePageSettingsForm__field--hidden'}
            >
              <Field
                labelSize={0}
                component={RenderTextInput}
                name={languageCode}
                validate={maxLength70}
              />
            </span>
          ))
        }
      </React.Fragment>
    );

    const defaultLanguageLabel = `${defaultLanguage.toUpperCase()} (default)`;

    const groupsWithEmptyOption = [
      { code: '', name: formatText('app.chooseAnOption') },
      ...groups,
    ];

    return (
      <Form onSubmit={handleSubmit} horizontal className="SinglePageSettingsForm">
        <TabContainer id="page-settings-tabs" defaultActiveKey={1}>
          <div>
            <Nav bsClass="nav nav-tabs">
              <NavItem eventKey={1}>
                <FormattedMessage id="singlePageSettings.generalSettings" />
              </NavItem>
            </Nav>
            <TabContent>
              <TabPane eventKey={1}>
                <div className="SinglePageSettingsForm__section">
                  <legend>
                    <FormattedMessage id="singlePageSettings.pageTitle" />
                    <span className="SinglePageSettingsForm__required-fields pull-right">
                      * <FormattedMessage id="app.fieldsRequired" />
                    </span>
                  </legend>
                  <FormSection name="titles">
                    <Field
                      label={<FormLabel labelText={defaultLanguageLabel} required />}
                      labelSize={2}
                      inputSize={8}
                      component={RenderTextInput}
                      name={defaultLanguage}
                      validate={[required, maxLength70]}
                      alignClass="text-left"
                    />
                    <div className="form-group">
                      <div className="col-xs-2">
                        {titleTranslationSelect}
                      </div>
                      <div className="col-xs-8">
                        {activeNonDefaultLanguagesInputs}
                      </div>
                    </div>
                  </FormSection>

                  <Row>
                    <Col xs={6}>
                      <legend>
                        <FormattedMessage id="pages.pageForm.pageGroups" />
                      </legend>
                      <Field
                        component={RenderSelectInput}
                        name="ownerGroup"
                        label={
                          <FormLabel
                            labelId="pages.pageForm.ownerGroup"
                            helpId="pages.pageForm.ownerGroupHelp"
                            required
                          />
                        }
                        labelSize={4}
                        alignClass=""
                        disabled
                        validate={required}
                        options={groupsWithEmptyOption}
                        optionValue="code"
                        optionDisplayName="name"
                      />
                      <FormGroup>
                        <label htmlFor="joinGroups" className="col-xs-4">
                          <FormLabel labelId="pages.pageForm.joinGroup" />
                        </label>
                        <Col xs={8}>
                          <FieldArray
                            component={MultiSelectRenderer}
                            name="joinGroups"
                            options={groups}
                            selectedValues={selectedJoinGroupCodes}
                            labelKey="name"
                            valueKey="code"
                            emptyOptionTextId="app.chooseAnOption"
                          />
                        </Col>
                      </FormGroup>
                    </Col>

                    <Col xs={6}>
                      <legend>
                        <FormattedMessage id="app.settings" />
                      </legend>
                      <FormGroup>
                        <label htmlFor="displayedInMenu" className="col-xs-6">
                          <FormLabel
                            labelId="pages.pageForm.displayedInMenu"
                            helpId="pages.pageForm.displayedInMenuHelp"
                          />
                        </label>
                        <Col xs={3}>
                          <Field
                            component={SwitchRenderer}
                            name="displayedInMenu"
                          />
                        </Col>
                      </FormGroup>
                      <Field
                        component={RenderSelectInput}
                        name="charset"
                        label={
                          <FormLabel
                            labelId="pages.pageForm.charset"
                            helpId="pages.pageForm.charsetHelp"
                          />
                        }
                        labelSize={4}
                        inputSize={5}
                        alignClass=""
                        options={charsetOptions}
                        optionValue="code"
                        optionDisplayName="name"
                      />

                      <Field
                        component={RenderSelectInput}
                        name="contentType"
                        label={
                          <FormLabel
                            labelId="pages.pageForm.mimeType"
                            helpId="pages.pageForm.mimeTypeHelp"
                          />
                        }
                        labelSize={4}
                        inputSize={5}
                        alignClass=""
                        validate={required}
                        options={contentTypeOptions}
                        optionValue="code"
                        optionDisplayName="name"
                      />
                    </Col>
                  </Row>

                </div>
              </TabPane>
            </TabContent>
          </div>
        </TabContainer>
        <div className="SinglePageSettingsForm__footer pull-right">
          <Button
            bsStyle="default"
            className="SinglePageSettingsForm__action-btn SinglePageSettingsForm__btn-cancel"
            onClick={onReset}
          >
            <FormattedMessage id="app.close" />
          </Button>
          <Button
            bsStyle="primary"
            disabled={invalid || submitting}
            className="SinglePageSettingsForm__action-btn"
            type="submit"
          >
            <FormattedMessage id="app.save" />
          </Button>
        </div>
      </Form>
    );
  }
}

SinglePageSettingsFormBody.propTypes = {
  intl: intlShape.isRequired,
  activeNonDefaultLanguages: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string,
    name: PropTypes.string,
    isActive: PropTypes.bool,
    isDefault: PropTypes.bool,
  })).isRequired,
  defaultLanguage: PropTypes.string.isRequired,
  charsets: PropTypes.arrayOf(PropTypes.string).isRequired,
  contentTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  groups: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string,
    name: PropTypes.string,
  })).isRequired,
  selectedJoinGroupCodes: PropTypes.arrayOf(PropTypes.string),
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool,
  submitting: PropTypes.bool,
  onReset: PropTypes.func.isRequired,
  onWillMount: PropTypes.func.isRequired,
};

SinglePageSettingsFormBody.defaultProps = {
  invalid: false,
  submitting: false,
  selectedJoinGroupCodes: [],
};

export default reduxForm({
  form: FORM_ID,
})(injectIntl(SinglePageSettingsFormBody));
