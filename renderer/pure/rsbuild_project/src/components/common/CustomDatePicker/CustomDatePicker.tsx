import React, { useCallback, useState } from "react";
import { Button, DatePicker, DatePickerProps, Form, Input, Picker, Radio, Selector, Space, TextArea } from "antd-mobile";
import { PickerValue } from "antd-mobile/es/components/picker";
import { PickerDate } from "antd-mobile/es/components/date-picker/util";
import dayjs from "dayjs";


interface CustomDatePickerProps {
  value?: PickerDate;
  onChange?: (value: any) => void
}

/** 自定义日期组件 */
const CustomDatePicker = (props: (CustomDatePickerProps & DatePickerProps)) => {
  const { value, onChange } = props;
  
  const [visible, setVisible] = useState<boolean>(false);

  const renderLabel = useCallback((type: string, data: number) => {
    switch (type) {
      case "year":
        return data + "年"
      case "month":
        return data + "月"
      case "day":
        return data + "日"
      case "hour":
        return data + "时"
      case "minute":
        return data + "分"
      case "second":
        return data + "秒"
      default:
        return data
    }
  }, [])

  return (
    <DatePicker 
      {...props}
      visible = { visible }
      onCancel={ () => setVisible(false) }
      onConfirm={(value) => {
        setVisible(false)
        onChange && onChange(value)
      }}
      renderLabel={ renderLabel }
    >
      {value => value ? <div style={{ width: "100%"}} onClick={ () => setVisible(true) }>{ dayjs(value).format("YYYY-MM-DD") } </div> : <div style={{ width: "100%"}} onClick={ () => setVisible(true) }>请选择日期</div>}
    </DatePicker>
  )
}

export default CustomDatePicker;