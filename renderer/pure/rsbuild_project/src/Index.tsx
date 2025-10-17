import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./Index.less";


import { Provider } from 'react-redux';
import store from './store';

import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import Index from './components/Index';
import Login from "./components/Login";
import AdminLogin from "./components/AdminLogin";
import AdminIndex from "./components/AdminIndex";
import {ConfigProvider} from "antd";

// 在入口文件全局扩展插件
dayjs.extend(customParseFormat);

const router = createBrowserRouter([
  {path: "/admin-index",element: <AdminIndex />,},
  {path: "/login",element: <Login />,},
  {path: "/index",element: <Index />,},
  {path: "/",element: <AdminLogin />,}
], { basename: "/" });


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.Fragment>
    <Provider store={ store }>
      <ConfigProvider locale={zhCN}>
        <RouterProvider router={router}/>
      </ConfigProvider>
    </Provider>
  </React.Fragment>,
);
