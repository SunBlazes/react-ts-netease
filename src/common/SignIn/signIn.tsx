import React from "react";
import { connect } from "react-redux";
import { UnionStateTypes } from "../../store";
import { PageHeader } from "antd";
import { Input, Form } from "antd";
import { LockOutlined, MobileOutlined } from "@ant-design/icons";
import classnames from "classnames";
import { userLogIn } from "../Header/store/actionCreator";
import { getChangeSignInShowAction } from "./store/actionCreator";

interface SignInProps {
  show: boolean;
  handleUserLogin: (user: LoginRequestConfig) => void;
  changeSignInShow: (flag: boolean) => void;
}

const SignIn: React.FC<SignInProps> = (props) => {
  const [form] = Form.useForm();
  const { show, handleUserLogin, changeSignInShow } = props;
  const classes = classnames("signin", {
    show
  });

  function handleSubmit() {
    form.validateFields().then((values) => {
      const { phone, password } = values;
      handleUserLogin({ phone, password });
    });
  }

  return (
    <div className={classes}>
      <div className="content">
        <PageHeader
          title="退出"
          onBack={() => changeSignInShow(false)}
          className="nav"
        />
        <h2 className="title">手机 · 登录</h2>
        <Form form={form} style={{ padding: "2rem 1rem" }}>
          <Form.Item
            name="phone"
            rules={[{ required: true, message: "手机号必须填写" }]}
            initialValue="18257712408"
          >
            <Input prefix={<MobileOutlined />} allowClear />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "密码必须填写" }]}
            initialValue="a986176132"
          >
            <Input.Password prefix={<LockOutlined />} allowClear />
          </Form.Item>
          <div className="btn" onClick={handleSubmit}>
            登 录
          </div>
        </Form>
      </div>
    </div>
  );
};

const mapStateToProps = (state: UnionStateTypes) => {
  return {
    show: state.signIn.show
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    handleUserLogin(user: LoginRequestConfig) {
      const action = userLogIn(user);
      dispatch(action);
    },
    changeSignInShow(flag: boolean) {
      const action = getChangeSignInShowAction(flag);
      dispatch(action);
    }
  };
};

SignIn.displayName = "SignIn";

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(SignIn));
