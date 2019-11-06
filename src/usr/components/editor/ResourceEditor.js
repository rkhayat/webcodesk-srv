/*
 *    Copyright 2019 Alex (Oleksandr) Pustovalov
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Close from '@material-ui/icons/Close';
import {
  ResourceTab,
  ResourceTabCloseButton,
  ResourceTabs
} from './ResourceEditor.parts';
import ResourceIcon from '../commons/ResourceIcon';
import ComponentView from './ComponentView';
import LivePreview from './LivePreview';
import PageComposer from './PageComposer';
import TemplateComposer from './TemplateComposer';
import FlowComposer from './FlowComposer';
import FunctionsFileView from './FunctionsFileView';
import ReadmePreview from './ReadmePreview';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  contentPane: {
    position: 'absolute',
    top: '32px',
    bottom: 0,
    right: 0,
    left: 0,
  },
  emptyPane: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: '#eceff1',
  },
  welcomeTextBox: {
    alignText: 'center',
  },
  welcomeText: {
    color: '#455a64',
    fontWeight: 'normal'
  },
  resourceTabLabel: { display: 'flex', alignItems: 'center' },
  resourceTabCloseBtn: { marginLeft: '7px' },
  resourceTabTextError: { color: '#D50000' },
  resourceTabTextStrike: {
    textDecoration: 'line-through'
  },
});

class ResourceEditor extends React.Component {
  static propTypes = {
    activeEditorTabIndex: PropTypes.number,
    resourceEditorTabs: PropTypes.array,
    isDraggingItem: PropTypes.bool,
    draggedItem: PropTypes.object,
    updateResourceHistory: PropTypes.object,
    onChangeEditorTab: PropTypes.func,
    onCloseEditorTab: PropTypes.func,
    onUpdateEditorTab: PropTypes.func,
    onErrorClick: PropTypes.func,
    onSearchRequest: PropTypes.func,
    onUndoUpdateEditorTab: PropTypes.func,
    onOpenUrl: PropTypes.func,
    onExportApp: PropTypes.func,
    onSaveSourceCode: PropTypes.func,
    onOpenResource: PropTypes.func,
    onPushToClipboard: PropTypes.func,
    onSaveAsTemplate: PropTypes.func,
  };

  static defaultProps = {
    activeEditorTabIndex: -1,
    resourceEditorTabs: [],
    isDraggingItem: false,
    draggedItem: null,
    updateResourceHistory: {},
    onChangeEditorTab: () => {
      console.info('ResourceEditor.onChangeEditorTab is not set');
    },
    onCloseEditorTab: () => {
      console.info('ResourceEditor.onCloseEditorTab is not set');
    },
    onUpdateEditorTab: () => {
      console.info('ResourceEditor.onUpdateEditorTab is not set');
    },
    onErrorClick: () => {
      console.info('ResourceEditor.onErrorClick is not set');
    },
    onSearchRequest: () => {
      console.info('ResourceEditor.onSearchRequest is not set');
    },
    onUndoUpdateEditorTab: () => {
      console.info('ResourceEditor.onUndoUpdateEditorTab is not set');
    },
    onOpenUrl: () => {
      console.info('ResourceEditor.onOpenUrl is not set');
    },
    onExportApp: () => {
      console.info('ResourceEditor.onExportApp is not set');
    },
    onSaveSourceCode: () => {
      console.info('ResourceEditor.onSaveSourceCode is not set');
    },
    onOpenResource: () => {
      console.info('ResourceEditor.onOpenResource is not set');
    },
    onPushToClipboard: () => {
      console.info('ResourceEditor.onPushToClipboard is not set');
    },
    onSaveAsTemplate: () => {
      console.info('ResourceEditor.onSaveAsTemplate is not set');
    },
  };

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const {
      activeEditorTabIndex,
      resourceEditorTabs,
      isDraggingItem,
      draggedItem,
      updateResourceHistory,
    } = this.props;
    return activeEditorTabIndex !== nextProps.activeEditorTabIndex
      || resourceEditorTabs !== nextProps.resourceEditorTabs
      || isDraggingItem !== nextProps.isDraggingItem
      || draggedItem !== nextProps.draggedItem
      || updateResourceHistory !== nextProps.updateResourceHistory;
  }

  handleChangeTab = (event, tabIndex) => {
    this.props.onChangeEditorTab(tabIndex);
  };

  handleCloseTab = (tabIndex) => (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.props.onCloseEditorTab(tabIndex);
  };

  handleUpdateTab = (tabIndex) => (newData) => {
    const { resourceEditorTabs, onUpdateEditorTab } = this.props;
    const resourceTab = resourceEditorTabs[tabIndex];
    onUpdateEditorTab({ resource: resourceTab.resourceObject, data: newData });
  };

  handleErrorClick = (messages) => {
    this.props.onErrorClick(messages);
  };

  handleSearchRequest = (text) => {
    this.props.onSearchRequest(text);
  };

  handleUndo = (tabIndex) => () => {
    const { resourceEditorTabs } = this.props;
    const resourceTab = resourceEditorTabs[tabIndex];
    this.props.onUndoUpdateEditorTab(resourceTab.resourceObject);
  };

  handleOpenUrl = (url) => {
    this.props.onOpenUrl(url);
  };

  handleExportApp = (helpers) => {
    this.props.onExportApp(helpers);
  };

  handleSaveSourceCode = (tabIndex) => (newScript) => {
    const { resourceEditorTabs } = this.props;
    const resourceTab = resourceEditorTabs[tabIndex];
    const newEditorTab = { resource: resourceTab.resourceObject, script: newScript };
    this.props.onSaveSourceCode(newEditorTab);
  };

  handleOpenResource = (resourceKey) => {
    this.props.onOpenResource(resourceKey);
  };

  handlePushToClipboard = (newItem) => {
    this.props.onPushToClipboard(newItem);
  };

  handleSaveAsTemplate = (item) => {
    this.props.onSaveAsTemplate({templateModel: item});
  };

  render () {
    const {
      classes,
      activeEditorTabIndex,
      resourceEditorTabs,
      isDraggingItem,
      draggedItem,
      updateResourceHistory,
    } = this.props;
    const tabsAmount = resourceEditorTabs ? resourceEditorTabs.length : 0;
    if (tabsAmount === 0) {
      return (
        <div className={classes.root}>
          <div className={classes.emptyPane}>
            <div className={classes.welcomeTextBox}>
              <h3 className={classes.welcomeText}>
                Double click on item in the left panel to open
              </h3>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={classes.root}>
        <ResourceTabs
          key={tabsAmount > 3 ? 'withScrollButtons' : 'withoutScrollButtons'}
          value={activeEditorTabIndex}
          onChange={this.handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          fullWidth={false}
          scrollable={tabsAmount > 3}
          scrollButtons={tabsAmount > 3 ? 'auto' : 'off'}
        >
          {resourceEditorTabs.map((resource, index) => {
            const { livePreviewObject, readmePreviewObject, resourceObject } = resource;
            if (resourceObject) {
              let type = resourceObject.type;
              let title = resourceObject.title;
              let key = resourceObject.key;
              let textClassName = '';
              if (resourceObject.hasErrors) {
                textClassName = classes.resourceTabTextError;
              }
              if (resourceObject.isDisabled) {
                textClassName = ' ' + classes.resourceTabTextStrike;
              }
              return (
                <ResourceTab
                  component="div"
                  key={key}
                  icon={<ResourceIcon resourceType={type} isMuted={true}/>}
                  label={
                    <div className={classes.resourceTabLabel}>
                      <div className={textClassName}>{title}</div>
                      <div className={classes.resourceTabCloseBtn}>
                        <ResourceTabCloseButton onClick={this.handleCloseTab(index)}>
                          <Close color="disabled" fontSize="inherit"/>
                        </ResourceTabCloseButton>
                      </div>
                    </div>
                  }
                />
              );
            } else if (livePreviewObject) {
              let type = livePreviewObject.type;
              let title = livePreviewObject.title;
              let key = livePreviewObject.key;
              return (
                <ResourceTab
                  component="div"
                  key={key}
                  icon={<ResourceIcon resourceType={type} isMuted={true}/>}
                  label={
                    <div className={classes.resourceTabLabel}>
                      <div>{title}</div>
                      <div className={classes.resourceTabCloseBtn}>
                        <ResourceTabCloseButton onClick={this.handleCloseTab(index)}>
                          <Close color="disabled" fontSize="inherit"/>
                        </ResourceTabCloseButton>
                      </div>
                    </div>
                  }
                />
              );
            } else if (readmePreviewObject) {
              let type = readmePreviewObject.type;
              let title = readmePreviewObject.title;
              let key = readmePreviewObject.key;
              return (
                <ResourceTab
                  component="div"
                  key={key}
                  icon={<ResourceIcon resourceType={type} isMuted={true}/>}
                  label={
                    <div className={classes.resourceTabLabel}>
                      <div>{title}</div>
                      <div className={classes.resourceTabCloseBtn}>
                        <ResourceTabCloseButton onClick={this.handleCloseTab(index)}>
                          <Close color="disabled" fontSize="inherit"/>
                        </ResourceTabCloseButton>
                      </div>
                    </div>
                  }
                />
              );
            }
            return null;
          })}
        </ResourceTabs>
        {
          resourceEditorTabs.map((resource, index) => {
            const {
              livePreviewObject,
              readmePreviewObject,
              resourceObject,
              projectSettingsObject,
              clipboardItems,
            } = resource;
            if (resourceObject) {
              if (resourceObject.isComponent) {
                return (
                  <div
                    key={resourceObject.key}
                    className={classes.contentPane}
                    style={{ display: index === activeEditorTabIndex ? 'block' : 'none' }}
                  >
                    <ComponentView
                      isVisible={index === activeEditorTabIndex}
                      data={resourceObject}
                      serverPort={projectSettingsObject.port}
                      onSaveChanges={this.handleSaveSourceCode(index)}
                      onSaveAsTemplate={this.handleSaveAsTemplate}
                    />
                  </div>
                );
              } else if (resourceObject.isPage) {
                return (
                  <div
                    key={resourceObject.key}
                    className={classes.contentPane}
                    style={{ display: index === activeEditorTabIndex ? 'block' : 'none' }}
                  >
                    <PageComposer
                      isVisible={index === activeEditorTabIndex}
                      isDraggingItem={isDraggingItem}
                      draggedItem={draggedItem}
                      data={resourceObject}
                      updateHistory={updateResourceHistory[resourceObject.key]}
                      clipboardItems={clipboardItems}
                      onUpdate={this.handleUpdateTab(index)}
                      onSearchRequest={this.handleSearchRequest}
                      onErrorClick={this.handleErrorClick}
                      onUndo={this.handleUndo(index)}
                      serverPort={projectSettingsObject.port}
                      onOpenComponent={this.handleOpenResource}
                      onPushToClipboard={this.handlePushToClipboard}
                      onSaveAsTemplate={this.handleSaveAsTemplate}
                    />
                  </div>
                );
              } else if (resourceObject.isTemplate) {
                return (
                  <div
                    key={resourceObject.key}
                    className={classes.contentPane}
                    style={{ display: index === activeEditorTabIndex ? 'block' : 'none' }}
                  >
                    <TemplateComposer
                      isVisible={index === activeEditorTabIndex}
                      isDraggingItem={isDraggingItem}
                      draggedItem={draggedItem}
                      data={resourceObject}
                      updateHistory={updateResourceHistory[resourceObject.key]}
                      clipboardItems={clipboardItems}
                      onUpdate={this.handleUpdateTab(index)}
                      onSearchRequest={this.handleSearchRequest}
                      onErrorClick={this.handleErrorClick}
                      onUndo={this.handleUndo(index)}
                      serverPort={projectSettingsObject.port}
                      onOpenComponent={this.handleOpenResource}
                      onPushToClipboard={this.handlePushToClipboard}
                    />
                  </div>
                );
              } else if (resourceObject.isFlow) {
                return (
                  <div
                    key={resourceObject.key}
                    className={classes.contentPane}
                    style={{ display: index === activeEditorTabIndex ? 'block' : 'none' }}
                  >
                    <FlowComposer
                      draggedItem={draggedItem}
                      isDraggingItem={isDraggingItem}
                      updateHistory={updateResourceHistory[resourceObject.key]}
                      isVisible={index === activeEditorTabIndex}
                      data={resourceObject}
                      onUpdate={this.handleUpdateTab(index)}
                      onErrorClick={this.handleErrorClick}
                      onSearchRequest={this.handleSearchRequest}
                      onUndo={this.handleUndo(index)}
                      onOpen={this.handleOpenResource}
                    />
                  </div>
                );
              } else if (resourceObject.isFunctions) {
                return (
                  <div
                    key={resourceObject.key}
                    className={classes.contentPane}
                    style={{ display: index === activeEditorTabIndex ? 'block' : 'none' }}
                  >
                    <FunctionsFileView
                      isVisible={index === activeEditorTabIndex}
                      data={resourceObject}
                      onSearch={this.handleSearchRequest}
                      onSaveChanges={this.handleSaveSourceCode(index)}
                    />
                  </div>
                );
              }
              return (
                <div key={resourceObject.key} className={classes.contentPane}>
                  <div style={{ padding: '1em' }}>
                    <pre>
                      {JSON.stringify(resourceObject.model, null, 4)}
                    </pre>
                  </div>
                </div>
              );
            } else if (livePreviewObject) {
              return (
                <div
                  key={livePreviewObject.key}
                  className={classes.contentPane}
                  style={{ display: index === activeEditorTabIndex ? 'block' : 'none' }}
                >
                  <LivePreview
                    isVisible={index === activeEditorTabIndex}
                    pages={livePreviewObject.pages}
                    serverPort={projectSettingsObject.port}
                    onOpenUrl={this.handleOpenUrl}
                    onSearchRequest={this.handleSearchRequest}
                    onExportApp={this.handleExportApp}
                  />
                </div>
              );
            } else if (readmePreviewObject) {
              return (
                <div
                  key={readmePreviewObject.key}
                  className={classes.contentPane}
                  style={{ display: index === activeEditorTabIndex ? 'block' : 'none' }}
                >
                  <ReadmePreview readmeText={readmePreviewObject.markdownContent} />
                </div>
              );
            }
            return null;
          })
        }
      </div>
    );
  }
}

export default withStyles(styles)(ResourceEditor);
