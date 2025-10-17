import React, { ReactElement, useEffect, useRef, useState } from "react";
import './AdminIndex.less';
// import { Button, Toast } from "antd-mobile";
import { useNavigate, useLocation } from "react-router-dom";
import * as Api from "../utils/api";
import {
  isIos,
  trim,
  getUrlParam,
  decodeBase64,
  appendUrlParams, getCookie,
} from "../utils/commonUtil";

import { SIGN_SUCCESS_PAGE } from "../utils/constant";
import Modal from "./common/Modal/Modal";
import Dialog from "./common/Dialog/Dialog";
import { useDispatch, useSelector } from 'react-redux';
import { updateCommonState } from "../store/commonSlice";
import { ApplicationState } from "../store";
import {Button, Col, Descriptions, Divider, Form, Input, Row, Select, Table, TimePicker} from "antd";
import * as dayjs from "dayjs";
import * as fetch from "node-fetch";
import {
  AdminIndexSliceType,
  initialSearchParams,
  SearchParams,
  updateAdminIndexState,
  UserList
} from "../store/adminIndexSlice";
import {ColumnProps} from "antd/es/table";

interface StateInterface {
  showAddUserModal: boolean;
}

/** 管理后台 */
const AdminIndex = () => {
  let nextPageUrl = "";
  
  const [state, setState] = useState<StateInterface>({
    showAddUserModal:false
  });

  const navigate = useNavigate();

  const location = useLocation();

  const dispatch = useDispatch();

  const adminIndexModule: AdminIndexSliceType = useSelector((state: ApplicationState) => state.adminIndexModule);

  const refObject = useRef<{
    searchParams: SearchParams;
  }>({
    searchParams: {...initialSearchParams},
  })

  const [admin_index_form] = Form.useForm();
  const mobileField = Form.useWatch("mobile", admin_index_form);

  useEffect(() => {
    fetchData(refObject.current.searchParams)
  }, [])

  const fetchData = async (params) => {
    const values = admin_index_form.getFieldsValue();
    const res = await fetch("/api/User/QueryListUser",{
      method:"post",
      headers: {
        'Content-Type': "application/json",
        "Authorization": getCookie("token")
      },
      body: JSON.stringify({
        ...params
      })
    })
    if(res.ok){
      const body = await res.json();
      dispatch(updateAdminIndexState({
        userList: body.data,
        pagination: {
          ...adminIndexModule.pagination,
          pageIndex: body.pageIndex,
          pageSize: body.pageSize,
          total: body.totalCount
        }
      }))
    }
  }

  const onAdminIndexFormFinish = (values: any) => {
    debugger

  }

  const onAdminIndexFormFailed = (error:any) => {
    debugger
    console.error("error")
  }

  const formLayoutItem = {wrapperCol: {span: 18}, labelCol: {span: 6}}

  const adminTableColumns: Array<ColumnProps<UserList>> = [
    {
      title: "用户ID",
      dataIndex: "id",
      width: 150,
      fixed: "left",
      align:"center",
      render: (text: string) => text || "--",
    },
    {
      title: "用户名称",
      dataIndex: "userName",
      align:"center",
      width: 150,
      render: (text: string) => text || "--",
    },
    {
      title: "用户账号",
      dataIndex: "name",
      align:"center",
      width: 150,
      render: (text: string) => text || "--",
    },
    {
      title: "微知ID",
      dataIndex: "wzUserID",
      align:"center",
      width: 150,
      render: (text: string) => text || "--",
    },
    {
      title: "是否能登录管理端",
      dataIndex: "isadminSide",
      align:"center",
      width: 150,
      render: (text: string) => +text ? "是" : "否",
    },
    {
      title: "机器人code",
      dataIndex: "robotsNumber",
      align:"center",
      width: 150,
      render: (text: string) => text || "--",
    },
    {
      title: "状态",
      dataIndex: "status",
      align:"center",
      width: 150,
      render: (text: string) => +text ? "生效" : "失效",
    },
    {
      title: "创建时间",
      dataIndex: "createtime",
      align:"center",
      width: 150,
      render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm:ss") || "--",
    },
    {
      title: "创建人",
      dataIndex: "createName",
      align:"center",
      width: 150,
      render: (text: string) => text || "--",
    },
    {
      title: "修改人",
      dataIndex: "updateName",
      align:"center",
      width: 150,
      render: (text: string) => text || "--",
    },
    {
      title: "修改时间",
      dataIndex: "updatetime",
      align:"center",
      width: 150,
      render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm:ss") || "--",
    },
    {
      title: "操作",
      align:"center",
      width: 240,
      fixed: "right",
      render: (text: string, record: UserList) => {
        return (
          <>
            <Button
              type="link"

            >
              修改
            </Button>
            <Button
              type="link"

            >
              删除密码
            </Button>
            <Button
              type="link"

            >
              修改密码
            </Button>
          </>
        )
      },
    },
  ]

  const onChange = (page: number, pageSize: number ) => {

  }

  const pagination = {
    ...adminIndexModule.pagination,
    onChange: { onChange },
    onShowSizeChange: { onChange },
    pageSizeOptions: ["25", "50", "100"],
    showTotal: (total: number) => `共${ total }条`,
    showSizeChanger: true,
    showQuickJumper: true
  }

  return (
    <div className="admin-index-container">
      <Form
        {...formLayoutItem}
        labelAlign={"left"}
        className="admin-index-form"
        onFinish={ onAdminIndexFormFinish }
        onFinishFailed={ onAdminIndexFormFailed }
        name="form"
        form={ admin_index_form }
        layout="horizontal"
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name="name"
              label="用户名"
              initialValue=""
            >
              <Input placeholder = "请输入用户名"></Input>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="userName"
              label="登录名"
              initialValue=""
            >
              <Input placeholder = "请输入登录名"></Input>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="isadminSide"
              label="是否能登录管理端"
              initialValue=""
            >
              <Select placeholder="请选择">
                <Select.Option value={""}>全部</Select.Option>
                <Select.Option value={"1"}>是</Select.Option>
                <Select.Option value={"0"}>否</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="status"
              label="状态"
              initialValue=""
            >
              <Select placeholder="请选择">
                <Select.Option value={""}>全部</Select.Option>
                <Select.Option value={"1"}>启用</Select.Option>
                <Select.Option value={"0"}>禁用</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Row gutter={16}>
        <Col span={8}>
          <Button className="toggle-boss-window" size="large" onClick={() => {

          }} type="primary" block={true}>查询</Button>
        </Col>
        <Col span={8}>
          <Button className="toggle-boss-window" size="large" onClick={() => {

          }} type="ghost" block={true}>重置</Button>
        </Col>
        <Col span={8}>
          <Button className="toggle-boss-window" size="large" onClick={() => {

          }} type="default" block={true}>新增用户</Button>
        </Col>
      </Row>

      <Table
        rowKey="id"
        dataSource={ adminIndexModule.userList }
        columns={ adminTableColumns }
        scroll={{ x: 1000 }}
        pagination={ pagination }
      />
    </div>
  );
};


export default AdminIndex;
