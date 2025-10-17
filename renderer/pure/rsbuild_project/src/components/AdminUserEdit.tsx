import React, {Fragment, ReactElement, useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import * as Api from "../utils/api";
import {
  getCookie,
  getUrlParam, setCookie,
} from "../utils/commonUtil";

import { SIGN_SUCCESS_PAGE } from "../utils/constant";
import Dialog from "./common/Dialog/Dialog";
import { useDispatch, useSelector } from 'react-redux';
import { updateCommonState } from "../store/commonSlice";
import { ApplicationState } from "../store";
import {Button, Descriptions, Form, Input, TimePicker, Modal, Radio, message} from "antd";
import * as dayjs from "dayjs";
import Validator, {MOBILE} from "../utils/validator";
import {UserInfo} from "node:os";
import { UserListType } from "../store/adminIndexSlice";
import {isNumber} from "../utils/regexValid";
import {required} from "zod/v4/mini";

interface PropsOwn {
  onClose: () => void;
  user: UserListType;
  mode: string;
}

interface StateInterface {
  loading: boolean;
}

/** 用户修改 */
const AdminUserEdit = (props: PropsOwn) => {
  const [state, setState] = useState<StateInterface>({
    loading: false
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const commonModule = useSelector((state: ApplicationState) => state.commonModule);

  const [admin_user_edit_form] = Form.useForm();

  useEffect(() => {

    return () => {

    };
  }, [])


  const handleAdminUserEdit = async (values: any) => {
    setState({
      ...state,
      loading: true
    })
    try {
      const res = await fetch(props.mode === "edit" ?"/api/User/UpdateUser" : "/api/User/InsertUser", {
        method:"post",
        headers: {
          'Content-Type': "application/json",
          "Authorization": getCookie("token")
        },
        body: JSON.stringify({
          ...values
        })
      })
      if(res.ok) {
        message.success(props.mode === "edit" ? "修改成功" : "新增成功")
        setState({
          ...state,
          loading: false
        })
        props.onClose();
      } else {
        const body = await res.json()
        Modal.error({
          title: props.mode === "edit" ? '修改失败': "新增失败",
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

  const onClose = () => {
    try {
      admin_user_edit_form.validateFields().then((values:any) => {
        handleAdminUserEdit(values)
      }).catch((error:any) => {
        debugger
        console.log(error)
      })
    } catch (error) {
      console.log(error)
    }
  }

  if(props.mode === "add") {
    admin_user_edit_form.setFieldsValue({
      name:"",
      userName:"",
      wzUserID:"",
      isadminSide: undefined
    })
  }

  return (
    <Modal
      title= {<div style={{display:"flex", justifyContent:"center"}}> { props.mode === "edit" ? "修改用户信息" : "新增用户"}</div>}
      width= "80%"
      centered={ true }
      className="admin-user-edit-container"
      closable={false}
      maskClosable={false}
      open={ true }
      onCancel={ props.onClose }
      onOk={ onClose }
      okButtonProps={{
        loading: state.loading
      }}
    >
      <Form
        className="admin-user-edit-form"
        name="admin-user-edit-form"
        form={ admin_user_edit_form }
        layout="vertical"
        initialValues={{
          operatorName: commonModule.loginUserInfo?.name ?? ""
        }}
      >
        <div style = {{display:"none"}}>
          { props.mode === "edit" && <Form.Item name={"id"} initialValue={props.user.id}/> }
          <Form.Item name={"robotsNumber"} initialValue={props.mode === "edit" ? props.user.robotsNumber : 1}/>
          <Form.Item name={"operatorName"}/>
        </div>
        <Form.Item
          name="userName"
          label="用户名称"
          initialValue= { props.mode === "edit" ? props.user.userName : ""}
          rules={[
            {
              required: true, message: "用户名称不能为空"
            },
            {
              pattern: MOBILE,
              message: "请输入手机格式"
            }
          ]}
          validateFirst = { true }
        >
          <Input maxLength = { 11 } placeholder = "请输入用户名称" />
        </Form.Item>
        <Form.Item
          name="name"
          label="用户账号"
          initialValue={ props.mode === "edit" ? props.user.name : "" }
          rules={[
            {
              required: true, message: "用户账号"
            }
          ]}
        >
          <Input placeholder = "请输入用户账号" />
        </Form.Item>
        {
          props.mode === "add" && <>
            <Form.Item
              name="userpassword"
              label="登录密码"
              initialValue=""
              rules={[
                {
                  required: true, message: "登录密码不能为空"
                }
              ]}
            >
              <Input.Password placeholder = "请输入登录密码" />
            </Form.Item>
          </>
        }
        <Form.Item
          name="wzUserID"
          label="微知ID"
          initialValue={ props.mode === "edit" ? props.user.wzUserID : ""}
          rules={[
            {
              required: true, message: "微知ID不能为空"
            }
          ]}
          normalize= {(value: string, prevValue: string, prevValues: any) => {
            return isNumber(value)  ? value : prevValue
          }}
        >
          <Input placeholder = "请输入微知ID" />
        </Form.Item>
        <Form.Item
          name="isadminSide"
          label="是否能登录管理端"
          initialValue={ props.mode === "edit" ? props.user.isadminSide : 0 }
          rules ={[
            {
              required: true,
              message: "请选择"
            }
          ]}
        >
          <Radio.Group>
            <Radio value={ 0 }>否</Radio>
            <Radio value={ 1 }>是</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="status"
          label="状态"
          initialValue={ props.mode === "add" ? 1 : props.user.status }
          rules ={[
            {
              required: true,
              message: "请选择"
            }
          ]}
        >
          <Radio.Group disabled={ props.mode === "add" ? true : false }>
            <Radio value={ 0 }>停用</Radio>
            <Radio value={ 1 }>启用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};


export default AdminUserEdit;
