import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { injectIntl, intlShape } from 'react-intl';
import { VerticalNav, Button, Icon } from 'patternfly-react';
import { routeConverter, hasAccess } from '@entando/utils';

import { clearAppTourProgress, setAppTourLastStep, setWizardEnabled } from 'state/app-tour/actions';

import { adminConsoleUrl } from 'helpers/urlUtils';
import UserMenuContainer from 'ui/internal-page/UserMenuContainer';
import LanguageSelectContainer from 'ui/internal-page/LanguageSelectContainer';

import {
  ROUTE_PAGE_TREE, ROUTE_FRAGMENT_LIST,
  ROUTE_PAGE_CONFIG, ROUTE_LABELS_AND_LANGUAGES, ROUTE_PAGE_TEMPLATE_LIST,
  ROUTE_RELOAD_CONFIG, ROUTE_DATABASE_LIST, ROUTE_FILE_BROWSER,
  ROUTE_PAGE_SETTINGS, ROUTE_ECR_COMPONENT_LIST,
  ROUTE_DASHBOARD, ROUTE_USER_LIST, ROUTE_ROLE_LIST,
  ROUTE_GROUP_LIST, ROUTE_PROFILE_TYPE_LIST, ROUTE_USER_RESTRICTIONS, ROUTE_WIDGET_LIST,
  ROUTE_EMAIL_CONFIG,
} from 'app-init/router';

import HomePageLinkContainer from 'ui/internal-page/HomePageLinkContainer';
import {
  SUPERUSER_PERMISSION, MANAGE_PAGES_PERMISSION,
  EDIT_USER_PROFILES_PERMISSION, CRUD_USERS_PERMISSION,
  VIEW_USERS_AND_PROFILES_PERMISSION, CRUD_CONTENTS_PERMISSION,
  VALIDATE_CONTENTS_PERMISSION, MANAGE_RESOURCES_PERMISSION,
  MANAGE_CATEGORIES_PERMISSION, ENTER_ECR_PERMISSION,
} from 'state/permissions/const';

import { withPermissionValues } from 'ui/auth/withPermissions';
import InfoMenu from 'ui/internal-page/InfoMenu';
import getRuntimeEnv from 'helpers/getRuntimeEnv';
import { HOMEPAGE_CODE } from 'state/pages/const';
import useLocalStorage from 'helpers/useLocalStorage';

const {
  Masthead, Item, SecondaryItem, Brand,
} = VerticalNav;

const publicUrl = process.env.PUBLIC_URL;

const renderCmsMenuItems = (intl, userPermissions) => {
  const hasMenuContentsAccess = hasAccess([
    CRUD_CONTENTS_PERMISSION,
    VALIDATE_CONTENTS_PERMISSION,
  ], userPermissions);
  const hasMenuAssetsAccess = hasAccess([
    CRUD_CONTENTS_PERMISSION,
    VALIDATE_CONTENTS_PERMISSION,
    MANAGE_RESOURCES_PERMISSION,
  ], userPermissions);
  const hasVersioningAccess = hasMenuAssetsAccess;
  const hasMenuContentTypeAccess = hasAccess(SUPERUSER_PERMISSION, userPermissions);
  const hasMenuContentTemplatesAccess = hasAccess([
    SUPERUSER_PERMISSION, VALIDATE_CONTENTS_PERMISSION,
  ], userPermissions);
  const hasCategoriesAccess = hasAccess([
    SUPERUSER_PERMISSION, MANAGE_CATEGORIES_PERMISSION,
  ], userPermissions);
  const hasMenuContentSettingsAccess = hasAccess(SUPERUSER_PERMISSION, userPermissions);
  return (
    <Item
      id="apps-cms"
      key="cms"
      onClick={() => {}}
      iconClass="fa fa-file-text-o"
      title={intl.formatMessage({ id: 'menu.cms' })}
    >
      {
      hasMenuContentsAccess && (
      <SecondaryItem
        id="menu-contents"
        title={intl.formatMessage({ id: 'cms.menu.contents', defaultMessage: 'Management' })}
        href={adminConsoleUrl('do/jacms/Content/list.action')}
      />
      )
      }
      {
        hasMenuAssetsAccess && (
        <SecondaryItem
          id="menu-assets"
          title={intl.formatMessage({ id: 'cms.assets.title', defaultMessage: 'Assets' })}
          href={adminConsoleUrl('do/jacms/Resource/list.action?resourceTypeCode=Image')}
        />
        )
      }
      {
        hasMenuContentTemplatesAccess && (
        <SecondaryItem
          id="menu-content-template"
          title={intl.formatMessage({ id: 'cms.menu.contenttemplates', defaultMessage: 'Templates' })}
          href={adminConsoleUrl('do/jacms/ContentModel/list.action')}
        />
        )
      }
      {
        hasCategoriesAccess && (
        <SecondaryItem
          id="menu-category"
          title={intl.formatMessage({ id: 'menu.categories', defaultMessage: 'Categories' })}
          href={adminConsoleUrl('do/Category/viewTree.action')}
        />
        )
      }
      {
        hasVersioningAccess && (
        <SecondaryItem
          id="menu-versioning"
          title={intl.formatMessage({ id: 'menu.versioning', defaultMessage: 'Versioning' })}
          href={adminConsoleUrl('do/jpversioning/Content/Versioning/list.action')}
        />
        )
      }
      {
        hasMenuContentTypeAccess && (
        <SecondaryItem
          id="menu-content-type"
          title={intl.formatMessage({ id: 'cms.menu.contenttypes', defaultMessage: 'Types' })}
          href={adminConsoleUrl('do/Entity/initViewEntityTypes.action?entityManagerName=jacmsContentManager')}
        />
        )
      }
      {
        hasMenuContentSettingsAccess && (
        <SecondaryItem
          id="menu-content-settings"
          title={intl.formatMessage({ id: 'cms.menu.contentsettings', defaultMessage: 'Settings' })}
          href={adminConsoleUrl('do/jacms/Content/Admin/openIndexProspect.action')}
        />
        )
      }
    </Item>
  );
};

const { COMPONENT_REPOSITORY_UI_ENABLED } = getRuntimeEnv();

const renderComponentRepositoryMenuItem = (history, intl) => (
  COMPONENT_REPOSITORY_UI_ENABLED ? (<Item
    id="component-repository"
    onClick={() => history.push(ROUTE_ECR_COMPONENT_LIST)}
    iconClass="fa fa-cart-plus"
    title={intl.formatMessage({ id: 'componentRepository.menuButton.title' })}
  />) : '');

const VerticalMenu = ({
  userPermissions, intl, history, onNextStep, onStartTutorial,
}) => {
  const [openPath, setOpenPath] = useState(null);

  const [collapsed, setCollapsed] = useLocalStorage('navCollapsed', false);

  const handleSecondaryCollapseBtnClick = () => {
    setOpenPath('/');
  };

  const handleExpandCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleItemClick = (item) => {
    if (item.subItems && item.subItems.length) {
      setOpenPath(`/${item.title}/`);
    }
  };

  return (
    <div className="safari-menu-fix">
      <VerticalNav
        blurDisabled
        dynamicBodyClasses
        forceHidden={false}
        hiddenIcons={false}
        hideMasthead={false}
        hoverDisabled
        onNavigate={({ href, onClick }) => {
          if (href) {
            window.location.href = href;
          } else {
            onClick();
          }
        }}
        pinnableMenus={false}
        hoverPath={openPath}
        onItemClick={handleItemClick}
        isMobile={false}
        navCollapsed={collapsed}
      >
        <Masthead>
          <Brand
            href={`${publicUrl}${ROUTE_DASHBOARD}`}
            iconImg={`${publicUrl}/images/entando-logo-white.svg`}
            img=""
            onClick={null}
          />
          <VerticalNav.IconBar collapse>
            <LanguageSelectContainer key="LanguageSelect" />
            <HomePageLinkContainer key="projectLink" />
            <InfoMenu key="InfoMenu" onStartTutorial={onStartTutorial} />
            <UserMenuContainer key="UserMenu" />
          </VerticalNav.IconBar>
        </Masthead>
        <Item
          id="menu-dashboard"
          onClick={() => history.push(ROUTE_DASHBOARD)}
          iconClass="fa fa-window-maximize"
          title={intl.formatMessage({ id: 'menu.dashboard', defaultMessage: 'Dashboard' })}
        />
        {
        hasAccess(MANAGE_PAGES_PERMISSION, userPermissions) && (
          <Item
            id="menu-page-creator"
            className="app-tour-step-3"
            onClick={() => onNextStep(4)}
            iconClass="fa fa-files-o"
            title={intl.formatMessage({ id: 'menu.pageDesigner', defaultMessage: 'Pages' })}
          >
            <SecondaryItem
              id="menu-page-tree"
              title={intl.formatMessage({ id: 'menu.pageTree', defaultMessage: 'Management' })}
              className="app-tour-step-4"
              onClick={() => {
                onNextStep(5);
                history.push(ROUTE_PAGE_TREE);
              }}
            />
            <SecondaryItem
              id="menu-page-config"
              title={intl.formatMessage({ id: 'menu.pageConfig', defaultMessage: 'Designer' })}
              onClick={() =>
                history.push(routeConverter(ROUTE_PAGE_CONFIG, { pageCode: HOMEPAGE_CODE }))
              }
            />
            {
              hasAccess(SUPERUSER_PERMISSION, userPermissions) && (
                <SecondaryItem
                  id="menu-ux-pattern-page-templates"
                  title={intl.formatMessage({ id: 'menu.pageTemplates', defaultMessage: 'Templates' })}
                  onClick={() => history.push(ROUTE_PAGE_TEMPLATE_LIST)}
                />
              )
            }
            {
              hasAccess(SUPERUSER_PERMISSION, userPermissions) && (
                <SecondaryItem
                  id="menu-page-settings"
                  title={intl.formatMessage({ id: 'menu.pageSettings', defaultMessage: 'Settings' })}
                  onClick={() => history.push(ROUTE_PAGE_SETTINGS)}
                />
              )
            }
          </Item>
        )
      }
        {
        hasAccess(SUPERUSER_PERMISSION, userPermissions) && (
          <Item
            id="menu-ux-pattern"
            onClick={() => {}}
            iconClass="fa fa-object-ungroup"
            title={intl.formatMessage({ id: 'menu.uxComponents', defaultMessage: 'Components' })}
          >
            <SecondaryItem
              id="menu-ux-pattern-widgets"
              title={intl.formatMessage({ id: 'menu.widget', defaultMessage: 'Widget' })}
              onClick={() => history.push(ROUTE_WIDGET_LIST)}
            />
            <SecondaryItem
              id="menu-ux-pattern-fragments"
              title={intl.formatMessage({ id: 'menu.fragments', defaultMessage: 'Fragments' })}
              onClick={() => history.push(ROUTE_FRAGMENT_LIST)}
            />
          </Item>
        )
      }
        {
          hasAccess([
            CRUD_CONTENTS_PERMISSION,
            MANAGE_RESOURCES_PERMISSION,
            MANAGE_CATEGORIES_PERMISSION,
            VALIDATE_CONTENTS_PERMISSION,
          ], userPermissions) &&
          renderCmsMenuItems(intl, userPermissions)
        }
        {

          hasAccess(
            [
              VIEW_USERS_AND_PROFILES_PERMISSION,
              CRUD_USERS_PERMISSION,
              EDIT_USER_PROFILES_PERMISSION,
            ]
            , userPermissions,
          )
        && (
        <Item
          id="menu-user-settings"
          onClick={() => {}}
          iconClass="fa fa-users"
          title={intl.formatMessage({ id: 'menu.userSettings', defaultMessage: 'Users' })}
        >
          <SecondaryItem
            id="menu-users"
            title={intl.formatMessage({ id: 'menu.users', defaultMessage: 'Management' })}
            onClick={() => history.push(ROUTE_USER_LIST)}
          />
          {hasAccess(SUPERUSER_PERMISSION, userPermissions) && (
          <SecondaryItem
            id="menu-roles"
            title={intl.formatMessage({ id: 'menu.roles', defaultMessage: 'Roles' })}
            onClick={() => history.push(ROUTE_ROLE_LIST)}
          />
            )}
          {hasAccess(SUPERUSER_PERMISSION, userPermissions) && (
          <SecondaryItem
            id="menu-groups"
            title={intl.formatMessage({ id: 'menu.groups', defaultMessage: 'Groups' })}
            onClick={() => history.push(ROUTE_GROUP_LIST)}
          />
            )}
          {hasAccess(SUPERUSER_PERMISSION, userPermissions) && (
          <SecondaryItem
            id="menu-profile"
            title={intl.formatMessage({ id: 'menu.profileTypes', defaultMessage: 'Profile Types' })}
            onClick={() => history.push(ROUTE_PROFILE_TYPE_LIST)}
          />
            )}
          {hasAccess(SUPERUSER_PERMISSION, userPermissions) && (
          <SecondaryItem
            id="menu-user-restrictions"
            title={intl.formatMessage({ id: 'menu.users.restrictions', defaultMessage: 'Restrictions' })}
            onClick={() => history.push(ROUTE_USER_RESTRICTIONS)}
          />
            )}
        </Item>
        )
        }

        {
          (hasAccess(SUPERUSER_PERMISSION, userPermissions)
          || hasAccess(ENTER_ECR_PERMISSION, userPermissions))
          && renderComponentRepositoryMenuItem(history, intl)
        }
        {
        hasAccess(SUPERUSER_PERMISSION, userPermissions) && (
          <Item
            className="VerticalAdminConsoleMenu__fixed-bottom"
            id="menu-configuration"
            title={intl.formatMessage({ id: 'menu.settings', defaultMessage: 'Administration' })}
            onClick={() => {}}
            iconClass="fa fa-cogs"
          >
            <SecondaryItem
              id="menu-databases"
              title={intl.formatMessage({ id: 'menu.database', defaultMessage: 'Database' })}
              onClick={() => history.push(ROUTE_DATABASE_LIST)}
            />
            <SecondaryItem
              id="menu-labels-file-browser"
              title={intl.formatMessage({ id: 'menu.fileBrowser', defaultMessage: 'File Browser' })}
              onClick={() => history.push(ROUTE_FILE_BROWSER)}
            />
            <SecondaryItem
              id="menu-labels-languages"
              title={intl.formatMessage({ id: 'menu.labelsAndLanguages', defaultMessage: 'Languages & Labels' })}
              onClick={() => history.push(ROUTE_LABELS_AND_LANGUAGES)}
            />
            <SecondaryItem
              id="menu-email"
              title={intl.formatMessage({ id: 'menu.emailConfig', defaultMessage: 'Email Configuration' })}
              onClick={() => history.push(ROUTE_EMAIL_CONFIG)}
            />
            <SecondaryItem
              id="menu-reload-configuration"
              title={intl.formatMessage({ id: 'menu.reloadConfiguration', defaultMessage: 'Reload configuration' })}
              onClick={() => history.push(ROUTE_RELOAD_CONFIG)}
            />
          </Item>
        )
      }
      </VerticalNav>
      {(openPath !== null && openPath !== '/') && (
        <Button className="VerticalMenu__secondary-collapse-btn" onClick={handleSecondaryCollapseBtnClick}>
          <Icon name="angle-double-left" />
        </Button>
      )}
      {(openPath === null || openPath === '/') && (
        <Button className="VerticalMenu__expand-collapse-btn" onClick={handleExpandCollapse}>
          <Icon name={`angle-double-${collapsed ? 'right' : 'left'}`} />
        </Button>
      )}
    </div>
  );
};

VerticalMenu.propTypes = {
  intl: intlShape.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  userPermissions: PropTypes.arrayOf(PropTypes.string),
  onNextStep: PropTypes.func.isRequired,
  onStartTutorial: PropTypes.func.isRequired,
};

VerticalMenu.defaultProps = {
  userPermissions: null,
};

const mapDispatchToProps = (dispatch, { history }) => ({
  onNextStep: nextStep => dispatch(setAppTourLastStep(nextStep)),
  onStartTutorial: () => {
    history.push(ROUTE_DASHBOARD);
    dispatch(clearAppTourProgress());
    dispatch(setWizardEnabled(true));
    dispatch(setAppTourLastStep(1));
  },
});

const VerticalMenuContainer =
connect(null, mapDispatchToProps)(VerticalMenu);

export default withPermissionValues(injectIntl(withRouter(VerticalMenuContainer)));
