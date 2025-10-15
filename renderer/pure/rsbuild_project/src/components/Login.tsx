import React, { ReactElement, useEffect, useRef, useState } from "react";
import './Login.less';
// import { Button, Toast } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import * as Api from "../utils/api";
import {
  getUrlParam,
} from "../utils/commonUtil";

import { SIGN_SUCCESS_PAGE } from "../utils/constant";
import Modal from "./common/Modal/Modal";
import Dialog from "./common/Dialog/Dialog";
import { useDispatch, useSelector } from 'react-redux';
import { updateCommonState } from "../store/commonSlice";
import { ApplicationState } from "../store";
import {Button, Descriptions, Form, Input, TimePicker} from "antd";
import * as dayjs from "dayjs";
import Validator, {MOBILE} from "../utils/validator";

interface StateInterface {
  loading: boolean;
}

/** 登录 */
const Login = () => {
  let nextPageUrl = "";

  const [state, setState] = useState<StateInterface>({
    loading: false
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const commonModule = useSelector((state: ApplicationState) => state.commonModule);

  const [login_form] = Form.useForm();
  const nameField = Form.useWatch("userName", login_form);

  useEffect(() => {
    // 监听主进程发送的消息
    const handleUpdate = (event, data) => {
      console.log('Test Received update from main process:', data);

      if(data.data) {
        setState({
          ...state,
          loading: false
        })
        navigate("/index", { state: { userInfo: data.data } })
      }

    };

    window.electronAPI?.sendMessageToRender(handleUpdate);

    return () => {
      debugger
      // window.electronAPI?.removeListener('sendMessageToRender', handleUpdate);
    };
  }, [])


  const onLoginFormFinish = (values: any) => {
    window.electronAPI?.sendMessageToMain('get-token', {
      userName: values.userName,
      userPassword: values.userPassword
    });
    setState({
      ...state,
      loading: true
    })
  }

  const onLoginFormFailed = (error:any) => {
    debugger
    console.error("error")
  }

  return (
    <div className="login-container">
      <Form
        className="loing-form"
        onFinish={ onLoginFormFinish }
        onFinishFailed={ onLoginFormFailed }
        name="form"
        form={ login_form }
        layout="vertical"
      >
        <Form.Item
          name="userName"
          label="用户名"
          initialValue= "18916827968"
          rules={[
            {
              required: true, message: "用户名不能为空"
            },
            {
              pattern: MOBILE,
              message: "请输入手机格式"
            }
          ]}
          validateFirst = { true }
        >
          <Input maxLength = { 11 } placeholder = "请输入用户名" />
        </Form.Item>
        <Form.Item
          name="userPassword"
          label="密码"
          initialValue= "111111"
          rules={[
            {
              required: true, message: "密码不能为空"
            }
          ]}
        >
          <Input.Password placeholder = "请输入密码" />
        </Form.Item>
      </Form>
      <Button className="submit" size="large" onClick={() => {
        login_form.submit()
      }} type="primary" block={true} loading={ state.loading }>登录</Button>
    </div>
  );
};


export default Login;
