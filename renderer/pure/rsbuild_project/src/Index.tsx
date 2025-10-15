import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./Index.less";


import { Provider } from 'react-redux';
import store from './store';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import Index from './components/Index';
import Login from "./components/Login";

// 在入口文件全局扩展插件
dayjs.extend(customParseFormat);

const router = createBrowserRouter([
  {path: "/login",element: <Login />,},
  {path: "/index",element: <Index />,}
], { basename: "/" });


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.Fragment>
    <Provider store={ store }>
      <RouterProvider router={router}/>
    </Provider>
  </React.Fragment>,
);
