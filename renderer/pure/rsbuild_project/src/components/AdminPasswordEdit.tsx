import React, {Fragment, ReactElement, useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import * as Api from "../utils/api";
import {
  getCookie,
  getUrlParam, setCookie,
} from "../utils/commonUtil";

import { useDispatch, useSelector } from 'react-redux';
import { updateCommonState } from "../store/commonSlice";
import { ApplicationState } from "../store";
import {Button, Descriptions, Form, Input, TimePicker, Modal, Radio, message} from "antd";
import * as dayjs from "dayjs";
import Validator, {MOBILE} from "../utils/validator";
import { UserListType } from "../store/adminIndexSlice";
import {isNumber} from "../utils/regexValid";

interface PropsOwn {
  onClose: () => void;
  user: UserListType;
}

interface StateInterface {
  loading: boolean;
}

/** 密码修改 */
const AdminPasswordEdit = (props: PropsOwn) => {
  const [state, setState] = useState<StateInterface>({
    loading: false
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const commonModule = useSelector((state: ApplicationState) => state.commonModule);

  const [admin_password_edit_form] = Form.useForm();
  const userpassword = Form.useWatch("Userpassword", admin_password_edit_form);

  useEffect(() => {

    return () => {

    };
  }, [])


  const handleAdminPasswordEdit = async (values: any) => {
    setState({
      ...state,
      loading: true
    })
    const params = {...values}
    delete params.Bypassuserpassword

    try {
      const res = await fetch(`/api/User/UpdateUserpassword?id=${params.id}&Userpassword=${params.Userpassword}`, {
        headers: {
          'Content-Type': "application/json",
          "Authorization": getCookie("token")
        }
      })
      if(res.ok) {
        message.success("修改成功")
        setState({
          ...state,
          loading: false
        })
        props.onClose();
      } else {
        const body = await res.json()
        Modal.error({
          title: '修改失败',
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
      admin_password_edit_form.validateFields().then((values:any) => {
        handleAdminPasswordEdit(values)
      }).catch((error:any) => {
        debugger
        console.log(error)
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal
      title={ <div style={{display:"flex", justifyContent:"center"}}>修改密码</div> }
      width= "80%"
      centered={ true }
      className="admin-password-edit-container"
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
        className="admin-password-edit-form"
        name="admin-password-edit-form"
        form={ admin_password_edit_form }
        layout="vertical"
      >
        <div style = {{display:"none"}}>
          <Form.Item name={"id"} initialValue={props.user.id}/>
          {/*<Form.Item name={"robotsNumber"} initialValue={props.user.robotsNumber}/>*/}
          {/*<Form.Item name={"operatorName"} initialValue={commonModule.loginUserInfo?.name}/>*/}
        </div>
        <Form.Item
          name="Userpassword"
          label="登录密码"
          initialValue=""
          rules={[
            {
              required: true, message: "登录密码不能为空"
            }
          ]}
          normalize= {(value: string, prevValue: string, prevValues: any) => {
            return value.trim()
          }}
        >
          <Input.Password placeholder = "请输入登录密码" />
        </Form.Item>
        <Form.Item
          name="Bypassuserpassword"
          label="再次输入登录密码"
          initialValue=""
          rules={[
            {
              required: true, message: "请再次输入登录密码"
            },
            {
              validator: (rule, value, callback) => {
                if(value.trim() === userpassword){
                  callback()
                } else {
                  callback(new Error("两次输入的密码不同"))
                }
              }
            }
          ]}
          normalize= {(value: string, prevValue: string, prevValues: any) => {
            return value.trim()
          }}
        >
          <Input.Password placeholder = "请再次输入登录密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
};


export default AdminPasswordEdit;
