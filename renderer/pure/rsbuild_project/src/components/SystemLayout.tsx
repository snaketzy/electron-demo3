import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';

import Index from './Index';
import Login from "./Login";
import AdminLogin from "./AdminLogin";
import AdminIndex from "./AdminIndex";
import {Layout, Spin} from "antd";
import {Route, Routes, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {ApplicationState} from "../store";
import {getCookie} from "../utils/commonUtil";
import {updateCommonState} from "../store/commonSlice";



const SystemLayout = () => {
  const dispatch = useDispatch();
  const commonModule = useSelector((state: ApplicationState) => state.commonModule);
  const navigate = useNavigate();

  const [state, setState] = useState({
    loading: true,
  })

  useEffect(() => {
    if(getCookie("token")) {
      fetchLoginUserInfo()
    } else {
      setState({
        loading: false
      })
    }
  }, []);

  const fetchLoginUserInfo = async () => {
    try {
      const res = await fetch("/api/User/QueryUserLogin",{
        method:"POST",
        headers: {
          'Content-Type': "application/json",
          "Authorization": getCookie("token")
        },
      });
      if(res.ok) {
        const data = await res.json();
        dispatch(updateCommonState({
          loginUserInfo: data
        }))
        setState({
          loading: false
        })
      } else {
        navigate("/")
      }
    } catch (error) {
      navigate("/")
      console.log(error)
    }
  }

  return (
    <Layout>
      <Layout.Content>
        {
          !state.loading &&
          <Routes>
            <Route path="/" element={<AdminLogin/>} />
            <Route path="/index" element={ <Index/> } />
            <Route path="/login" element={ <Login/> } />
            <Route path="/admin-index" element={ <AdminIndex/> } />
          </Routes>
        }
      </Layout.Content>
      <Spin spinning={state.loading}/>
    </Layout>
  )
}

export default SystemLayout;