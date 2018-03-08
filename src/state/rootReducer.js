import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { routerReducer as router } from 'frontend-common-components';

import pluginArray from 'entando-plugins';

import loginForm from 'state/login-form/reducer';
import activityStream from 'state/activity-stream/reducer';
import locale from 'state/locale/reducer';
import widgets from 'state/widgets/reducer';
import pages from 'state/pages/reducer';
import groups from 'state/groups/reducer';
import pagination from 'state/pagination/reducer';
import fragments from 'state/fragments/reducer';
import pageModels from 'state/page-models/reducer';
import errors from 'state/errors/reducer';
import dataTypes from 'state/data-types/reducer';
import dataModelList from 'state/data-model-list/reducer';

const reducerDef = {
  router,
  form,
  loginForm,
  locale,
  activityStream,
  pages,
  groups,
  pagination,
  widgets,
  fragments,
  pageModels,
  errors,
  dataModelList,
  dataTypes,
};

if (pluginArray.length) {
  // builds a plugins reducer
  const pluginsReducerObj = {};
  pluginArray.forEach((plugin) => {
    if (plugin.reducer) {
      pluginsReducerObj[plugin.id] = plugin.reducer;
    }
  });
  reducerDef.plugins = combineReducers(pluginsReducerObj);
}

// app root reducer
const reducer = combineReducers(reducerDef);

export default reducer;
