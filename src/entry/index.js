import React from 'react';
import { render } from 'react-dom';
import IndexContainer from '../container/Index';
import * as IndexState from '../reducer/index';
import BindReact from '../library/BindReact';
import '../../less/main.less';

const reducers = Object.assign({}, IndexState);

const rootElement = document.getElementById('root');

render(
    <BindReact Module={IndexContainer} reducers={reducers} />,
    rootElement
)