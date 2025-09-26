import React, { ReactElement, useEffect, useRef, useState } from "react";
import './Index.less';
// import { Button, Toast } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import * as Api from "../utils/api";
import {
  isIos,
  trim,
  getUrlParam,
  decodeBase64,
  appendUrlParams,
} from "../utils/commonUtil";

import { SIGN_SUCCESS_PAGE } from "../utils/constant";
import Modal from "./common/Modal/Modal";
import Dialog from "./common/Dialog/Dialog";
import { useDispatch, useSelector } from 'react-redux';
import { app_version, QRCODE_ManageRootUrl } from "../utils/constant";
import Validator, { MOBILE } from "../utils/validator";
import { updateCommonState } from "../store/commonSlice";
import { ApplicationState } from "../store";
import { Button, Form, Input, TimePicker } from "antd";
import dayjs from "dayjs";

interface StateInterface {
  /** 是否显示boss窗口 */
  showBoss: boolean;
  company:string;
  name: string;
}

/** 1、信息认证 */
const Index = () => {
  let nextPageUrl = "";
  
  const [state, setState] = useState<StateInterface>({
    showBoss: true,
    company:"",
    name:""
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const commonModule = useSelector((state: ApplicationState) => state.commonModule);

  const refObject = useRef({
    base64: getUrlParam("base64"),
    groupCode: getUrlParam("qrcode"),
    qrcode: getUrlParam("qrcode"),
    storageKey: ""
  })

  const [index_form] = Form.useForm();
  const mobileField = Form.useWatch("mobile", index_form);

  useEffect(() => {
    // 获取版本信息
    const versions = window.electronAPI?.getVersions();
    if (versions) {
      // debugger
    }

    // 监听主进程发送的消息
    const handleUpdate = (event, data) => {
      console.log('Test Received update from main process:', data);
      // debugger
      setState({
        ...state,
        company: data.brandName,
        name: data.name,
      })
    };

    window.electronAPI?.sendMessageToRender(handleUpdate);
    dispatch(updateCommonState({
      qrcodeUrl: location.href
    }))
    return () => {
      window.electronAPI?.removeListener('sendMessageToRender', handleUpdate);
    };
  }, [])



  const updateState = (params: any) => {
    setState(prev => ({
       ...prev, 
       ...params
    }))
  }

  const inputOnBlur = () => {
    window.scroll(0, 0); // 让页面归位
  };

  const onServicePage = () => {
    updateState({
      ...state,
      isServiceModal: false
    });
    navigate(`/serviceDetail?nextPageUrl=${nextPageUrl}`);
  };

  /** 校验当前用户信息 */
  const checkUser = (formValues: any) => {
    console.info("校验当前用户信息 checkUser")
    const _form = formValues;
    
    // updateState({
    //   isLoading: true
    // })
  };

  const onIndexFormFinish = (values: any) => {
    debugger
    checkUser(values)
  }

  const onIndexFormFailed = (error:any) => {
    debugger
    console.error("error")
  }

  const sendMessage = () => {
    // 发送消息到主进程
    window.electronAPI?.sendMessageToMain('message-from-renderer', { showBoss: !state.showBoss });
    setState({
      ...state,
      showBoss:!state.showBoss
    })
  };
  
  return (
    <div className="index-container">
      <Form
        className="index-form"
        onFinish={ onIndexFormFinish }
        onFinishFailed={ onIndexFormFailed }
        name="form"
        form={ index_form }
        layout="vertical"
      >
        <Form.Item
          name="company"
          label="公司"
          initialValue= ""
          rules={[
            { 
              required: true, message: "公司不能为空" 
            }
          ]}
        >
          <span>{ state.company }</span>
        </Form.Item>
        <Form.Item
          name="name"
          label="操作人员姓名"
          initialValue= ""
          rules={[
            { 
              required: true, message: "姓名不能为空" 
            }
          ]}
        >
          <span>{ state.name }</span>
        </Form.Item>
        <Form.Item
          name="runningRange"
          label="运行时段"
          initialValue={[dayjs("09:00","HH:mm"),dayjs("18:00","HH:mm")]}
          rules={[
            { 
              required: true, message: "时段不能为空" 
            }
          ]}
        >
          <TimePicker.RangePicker format= "HH:mm" />
        </Form.Item>
        {/*<Button size="large" onClick={ () => {*/}
        {/*  setState({*/}
        {/*    ...state,*/}
        {/*    company:"test1",*/}
        {/*    name:"test11"*/}
        {/*  })*/}
        {/*} } type="primary" block = { true }>提交</Button>*/}
        
        <Button size="large" onClick={() => {
          sendMessage()
        }} type="primary" block={true}>{ state.showBoss ? "隐藏" : "显示" }BOSS窗口</Button>
      </Form>
    </div>
  );
};


export default Index;
