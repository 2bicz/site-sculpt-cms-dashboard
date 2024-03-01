/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect, useState } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Switch from "@mui/material/Switch";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import curved9 from "assets/images/curved-images/curved-6.jpg";
import { useTranslation } from "react-i18next";
import api from "api/api";
import Cookies from "js-cookie";

function SignIn() {
  const { t } = useTranslation();
  const [rememberMe, setRememberMe] = useState(true);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  // const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleSignIn = () => {
    api.post("/auth/signin", {
      username: username,
      password: password
    })
    .then((response) => {
      if (response.status === 200) {
        const token = response.data.token
        if (token) {
          Cookies.set('jwtToken', token, { expires: 1, secure: true, sameSite: 'Strict' });
          Cookies.set('username', username, { expires: 1, secure: true, sameSite: 'Strict' });
          if (Cookies.get("jwtToken")) {
            navigate("/dashboard");
          }
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  return (
    <CoverLayout
      title={t('authentication.welcome_back')}
      description={t('authentication.enter_credentials')}
      image={curved9}
    >
      <SoftBox component="form" role="form">
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              {t('authentication.username')}
            </SoftTypography>
          </SoftBox>
          <SoftInput placeholder={t('authentication.username')} onChange={(content) => setUsername(content.target.value)} />
        </SoftBox>
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
            {t('authentication.password')}
            </SoftTypography>
          </SoftBox>
          <SoftInput type="password" placeholder={t('authentication.password')} onChange={(content) => setPassword(content.target.value)} />
        </SoftBox>
        {/* <SoftBox display="flex" alignItems="center">
          <Switch checked={rememberMe} onChange={handleSetRememberMe} />
          <SoftTypography
            variant="button"
            fontWeight="regular"
            onClick={handleSetRememberMe}
            sx={{ cursor: "pointer", userSelect: "none" }}
          >
            &nbsp;&nbsp;{t('authentication.remember_me')}
          </SoftTypography>
        </SoftBox> */}
        <SoftBox mt={4} mb={1}>
          <SoftButton variant="gradient" color="info" fullWidth onClick={() => handleSignIn()}>
            {t('authentication.sign_in')}
          </SoftButton>
        </SoftBox>
        {/* <SoftBox mt={3} textAlign="center">
          <SoftTypography variant="button" color="text" fontWeight="regular">
          {t('authentication.not_account')}{" "}
            <SoftTypography
              component={Link}
              to="/dashboard/authentication/sign-up"
              variant="button"
              color="info"
              fontWeight="medium"
              textGradient
            >
              {t('authentication.register')}
            </SoftTypography>
          </SoftTypography>
        </SoftBox> */}
      </SoftBox>
    </CoverLayout>
  );
}

export default SignIn;
