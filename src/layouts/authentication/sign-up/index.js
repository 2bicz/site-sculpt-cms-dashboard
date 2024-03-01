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
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import curved6 from "assets/images/curved-images/curved14.jpg";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { env } from "environment/environment";

function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [agreement, setAgremment] = useState(true);
  const handleSetAgremment = () => setAgremment(!agreement);

  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState()
  const [passworResetError, setPassworResetError] = useState(false);
  const [passwordResetEmailSent, setPasswordResetEmailSent] = useState(false);

  // const handleRegister = () => {
  //   axios.post(env.baseUrl + "/auth/signup", {
  //     username: username,
  //     email: email,
  //     password: password
  //   })
  //   .then((response) => {
  //     if (response.status === 200) {
  //       navigate("/dashboard/authentication/sign-in");
  //     }
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // }

  const handlePasswordReset = () => {
    axios.post(env.baseUrl + "/auth/password-reset", {
      email: email,
    })
    .then((response) => {
      if (response.status === 200) {
        setPasswordResetEmailSent(true);
        setPassworResetError(false);
      }
    })
    .catch((error) => {
      console.log(error);
      setPassworResetError(true);
      setPasswordResetEmailSent(false);

    });
  }

  return (
    <BasicLayout
      title={t('authentication.welcome')}
      // description={t('authentication.welcome_text')}
      description={"Wykorzystaj poniższy formularz by zresetować swoje hasło. Na podany adres e-mail zostanie wysłany link, za pomocą którego będziesz w stanie to zrobić."}
      image={curved6}
    >
      <Card>
        <SoftBox p={3} mb={1} textAlign="center">
          <SoftTypography variant="h5" fontWeight="medium">
            {/* {t('authentication.register')} */}
            Resetuj hasło
          </SoftTypography>
        </SoftBox>
        <SoftBox pt={2} pb={3} px={3}>
          <SoftBox component="form" role="form">
            {/* <SoftBox mb={2}>
              <SoftInput placeholder={t('authentication.username')} onChange={(content) => setUsername(content.target.value)} />
            </SoftBox> */}
            <SoftBox mb={2}>
              <SoftInput type="email" placeholder={t('authentication.email')} onChange={(content) => setEmail(content.target.value)} />
            </SoftBox>
            {/* <SoftBox mb={2}>
              <SoftInput type="password" placeholder={t('authentication.password')} onChange={(content) => setPassword(content.target.value)} />
            </SoftBox> */}
            {/* <SoftBox display="flex" alignItems="center">
              <Checkbox checked={agreement} onChange={handleSetAgremment} />
              <SoftTypography
                variant="button"
                fontWeight="regular"
                onClick={handleSetAgremment}
                sx={{ cursor: "poiner", userSelect: "none" }}
              >
                &nbsp;&nbsp;{t('authentication.agree')}&nbsp;
              </SoftTypography>
              <SoftTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                textGradient
              >
                {t('authentication.terms_conditions')}
              </SoftTypography>
            </SoftBox> */}
            <SoftBox mt={4} mb={1}>
              <SoftButton variant="gradient" color="dark" fullWidth onClick={() => handlePasswordReset()}>
                {/* {t('authentication.sign_up')} */}
                Resetuj hasło
              </SoftButton>
            </SoftBox>
            {/* <SoftBox mt={3} textAlign="center">
              <SoftTypography variant="button" color="text" fontWeight="regular">
              {t('authentication.already_account')}&nbsp;
                <SoftTypography
                  component={Link}
                  to="/dashboard/authentication/sign-in"
                  variant="button"
                  color="dark"
                  fontWeight="bold"
                  textGradient
                >
                  {t('authentication.sign_in')}
                </SoftTypography>
              </SoftTypography>
            </SoftBox> */}
          </SoftBox>
        </SoftBox>
      </Card>
    </BasicLayout>
  );
}

export default SignUp;
