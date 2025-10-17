import React, { ReactElement, useEffect, useRef, useState } from "react";
import './AdminLogin.less';
// import { Button, Toast } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import * as Api from "../utils/api";
import {
  getUrlParam, setCookie,
} from "../utils/commonUtil";

import { SIGN_SUCCESS_PAGE } from "../utils/constant";
import Dialog from "./common/Dialog/Dialog";
import { useDispatch, useSelector } from 'react-redux';
import { updateCommonState } from "../store/commonSlice";
import { ApplicationState } from "../store";
import {Button, Descriptions, Form, Input, TimePicker, Modal} from "antd";
import * as dayjs from "dayjs";
import Validator, {MOBILE} from "../utils/validator";


interface StateInterface {
  loading: boolean;
}

/** 后台登录 */
const AdminLogin = () => {
  let nextPageUrl = "";

  const [state, setState] = useState<StateInterface>({
    loading: false
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const commonModule = useSelector((state: ApplicationState) => state.commonModule);

  const [admin_login_form] = Form.useForm();
  const nameField = Form.useWatch("userName", admin_login_form);

  useEffect(() => {

    return () => {

    };
  }, [])


  const onAdminLoginFormFinish = async (values: any) => {
    setState({
      ...state,
      loading: true
    })
    try {
      const res = await fetch("/api/Auth/login", {
        method:"post",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({
          username: values.userName,
          password: values.userPassword,
          isadminSide: "1"
        })
      })
      if(res.ok) {
        const body = await res.json()
        setState({
          ...state,
          loading: false
        })
        dispatch(updateCommonState({
          loginUserInfo: body.data
        }))
        setCookie("token", `Bearer ${body.data.token}`)
        navigate("/admin-index")
      } else {
        const body = await res.json()
        Modal.error({
          title: '登录失败',
          content: body.message,
        })
        setState({
          ...state,
          loading: false
        })
      }
    } catch (error) {
      setState({
        ...state,
        loading: false
      })
      console.log(error);
    }
  }

  const onAdminLoginFormFailed = (error:any) => {
    debugger
    console.error("error")
  }

  return (
    <div className="admin-login-container">
      <Form
        className="admin-login-form"
        onFinish={ onAdminLoginFormFinish }
        onFinishFailed={ onAdminLoginFormFailed }
        name="admin-logn-form"
        form={ admin_login_form }
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
        admin_login_form.submit()
      }} type="primary" block={true} loading={ state.loading }>后台登录</Button>
    </div>
  );
};


export default AdminLogin;
