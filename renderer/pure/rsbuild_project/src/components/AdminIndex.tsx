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
import {
  Button,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Table,
  TimePicker,
  Tooltip
} from "antd";
import * as dayjs from "dayjs";
import * as fetch from "node-fetch";
import {
  AdminIndexSliceType,
  initialSearchParams,
  SearchParams,
  updateAdminIndexState,
  UserListType
} from "../store/adminIndexSlice";
import {ColumnProps} from "antd/es/table";
import AdminUserEdit from "./AdminUserEdit";
import AdminPasswordEdit from "./AdminPasswordEdit";

interface StateInterface {
  showAddUserModal: boolean;
  showEditUserModal: boolean;
  showPasswordModal: boolean;
  loading: boolean;
}

/** 管理后台 */
const AdminIndex = () => {
  let nextPageUrl = "";
  
  const [state, setState] = useState<StateInterface>({
    showAddUserModal:false,
    showEditUserModal:false,
    showPasswordModal:false,
    loading: false
  });

  const navigate = useNavigate();

  const location = useLocation();

  const dispatch = useDispatch();

  const adminIndexModule: AdminIndexSliceType = useSelector((state: ApplicationState) => state.adminIndexModule);

  const refObject = useRef({
    searchParams: {...initialSearchParams},
    user: undefined,
  })

  const [admin_index_form] = Form.useForm();

  useEffect(() => {
    fetchData(refObject.current.searchParams)
  }, [])

  const fetchData = async (params) => {
    try {
      setState({
        ...state,
        loading: true
      })
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
        setState({
          ...state,
          loading: false
        })
        const body = await res.json();
        dispatch(updateAdminIndexState({
          searchParams: params,
          userList: body.data,
          pagination: {
            ...adminIndexModule.pagination,
            pageIndex: body.pageIndex,
            pageSize: body.pageSize,
            total: body.totalCount
          }
        }))
      } else {
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
      message.error(error.message);
      console.log(error);
    }
  }

  const onAdminIndexFormFinish = (values: any) => {
    fetchData({
      ...refObject.current.searchParams,
      ...values
    })
  }

  const onAdminIndexFormFailed = (error:any) => {
    debugger
    console.error("error")
  }

  const handleDeleteUser = async (record: UserListType) => {
    setState({
      ...state,
      loading: true
    })
    try {
      const res = await fetch(`/api/User/DeleteUser?id=${record.id}`,{
        headers: {
          'Content-Type': "application/json",
          "Authorization": getCookie("token")
        },
      })
      if(res.ok){
        setState({
          ...state,
          loading: false
        })
        message.success(`删除${record.name}成功`)
        fetchData(refObject.current.searchParams)
      } else {
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
      message.error(error)
      console.log(error)
    }
  }

  const formLayoutItem = {wrapperCol: {span: 18}, labelCol: {span: 6}}

  const adminTableColumns: Array<ColumnProps<UserListType>> = [
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
      render: (text: string) => +text ? "启用" : "禁用",
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
      width: 210,
      fixed: "right",
      render: (text: string, record: UserListType) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                refObject.current.user = record;
                setState({...state, showEditUserModal: true})
              }}
            >
              修改
            </Button>
            <Button
              type="link"
            >
              <Popconfirm title={`确认删除【${record.name}】`} onConfirm={() =>  handleDeleteUser(record)}>删除</Popconfirm>
            </Button>
            <Button
              type="link"
              onClick={() => {
                refObject.current.user = record;
                setState({...state, showPasswordModal: true})
              }}
            >
              修改密码
            </Button>
          </>
        )
      },
    },
  ]

  const onChange = (page: number, pageSize: number ) => {
    if(pagination.current === page) {
      refObject.current.searchParams = {
        ...refObject.current.searchParams,
        pageSize: pageSize,
        pageIndex: 1
      }
    } else {
      refObject.current.searchParams = {
        ...refObject.current.searchParams,
        pageIndex: 1
      }
    }
    fetchData(refObject.current.searchParams)
  }

  const pagination = {
    ...adminIndexModule.pagination,
    onChange: onChange,
    onShowSizeChange: onChange,
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
        name="admin-index-form"
        form={ admin_index_form }
        layout="horizontal"
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name="name"
              label="用户名"
              initialValue=""
              getValueFromEvent = {(e) => {
                const value = e.target.value.trim();
                return value;
              }}
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
                <Select.Option value={1}>是</Select.Option>
                <Select.Option value={0}>否</Select.Option>
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
          <Button className="toggle-boss-window" size="large" type="primary" onClick={ () => admin_index_form.submit() } block={true}>查询</Button>
        </Col>
        <Col span={8}>
          <Button className="toggle-boss-window" size="large" onClick={() => {
              refObject.current.searchParams = {...initialSearchParams};
              admin_index_form.resetFields()
              fetchData(refObject.current.searchParams)
          }} type="ghost" block={true}>重置</Button>
        </Col>
        <Col span={8}>
          <Button className="toggle-boss-window" size="large" onClick={() => {
            setState({
              ...state,
              showAddUserModal: true
            })
          }} type="default" block={true}>新增用户</Button>
        </Col>
      </Row>

      <Table
        rowKey="id"
        dataSource={ adminIndexModule.userList }
        columns={ adminTableColumns }
        scroll={{ x: 1000 }}
        pagination={ pagination }
        loading={ state.loading }
      />
      {
        state.showEditUserModal &&
        <AdminUserEdit
          mode= "edit"
          user = { refObject.current.user }
          onClose={() => {
            fetchData(refObject.current.searchParams)
            setState({...state,showEditUserModal: false})
          }} />
      }
      {
        state.showAddUserModal &&
        <AdminUserEdit
          mode= "add"
          user = { refObject.current.user }
          onClose={() => {
            fetchData(refObject.current.searchParams)
            setState({...state,showAddUserModal: false})
          }} />
      }
      {
        state.showPasswordModal &&
        <AdminPasswordEdit
          user = { refObject.current.user }
          onClose={() => {
            fetchData(refObject.current.searchParams)
            setState({...state,showPasswordModal: false})
          }} />
      }
    </div>
  );
};


export default AdminIndex;
