import React, { ReactElement, useEffect, useRef, useState } from "react";
import './Index.less';
// import { Button, Toast } from "antd-mobile";
import { useNavigate, useLocation } from "react-router-dom";
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
import { updateCommonState } from "../store/commonSlice";
import { ApplicationState } from "../store";
import {Button, Descriptions, Form, Input, TimePicker} from "antd";
import * as dayjs from "dayjs";

interface StateInterface {
  /** 是否显示boss窗口 */
  showBoss: boolean;
  company:string;
  name: string;
  module: string;
  action: string;
}

/** 控制台 */
const Index = () => {
  let nextPageUrl = "";
  
  const [state, setState] = useState<StateInterface>({
    showBoss: true,
    company:"",
    name:"",
    module: "",
    action: ""
  });

  const navigate = useNavigate();

  const location = useLocation();

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

    setState({
      ...state,
      company: location.state.userInfo.brandName,
      name: location.state.userInfo.name,
    })

    // 获取版本信息
    const versions = window.electronAPI?.getVersions();
    if (versions) {
      // debugger
    }

    // 监听主进程发送的消息
    const handleUpdate = (event, data) => {
      console.log('Test Received update from main process:', data);
      updateState({
        module: data.module,
        action: data.action,
        ...(data.module === "全局" && {
          company: data.data.brandName,
          name: data.data.name,
        })
      })
    };

    window.electronAPI?.sendMessageToRender(handleUpdate);
    dispatch(updateCommonState({
      qrcodeUrl: location.href
    }))
    return () => {
      // window.electronAPI?.removeListener('sendMessageToRender', handleUpdate);
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
      </Form>
      <Descriptions column={ 2 }>
        <Descriptions.Item label="公司">{ state.company }</Descriptions.Item>
        <Descriptions.Item label="操作人员">{ state.name }</Descriptions.Item>
      </Descriptions>
      <Descriptions column={ 2 }>
        <Descriptions.Item label="当前模块">{ state.module }</Descriptions.Item>
        <Descriptions.Item label="当前动作">{ state.action }</Descriptions.Item>
      </Descriptions>
      <Button className="toggle-boss-window" size="large" onClick={() => {
        sendMessage()
      }} type="primary" block={true}>{ state.showBoss ? "隐藏" : "显示" }BOSS窗口</Button>
    </div>
  );
};


export default Index;
