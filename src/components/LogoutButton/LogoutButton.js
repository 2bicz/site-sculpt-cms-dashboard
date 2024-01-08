import PropTypes from 'prop-types';
import { useTranslation } from "react-i18next";
import { IconButton } from "@mui/material";
import { navbarIconButton } from "examples/Navbars/DashboardNavbar/styles";
import SoftTypography from "components/SoftTypography";
import LogoutIcon from '@mui/icons-material/Logout';
import Cookies from 'js-cookie';

export const LogoutButton = ({ color }) => {
    const { t } = useTranslation();

    const handleLogout = () => {
        Cookies.remove('jwtToken', { path: '/' });
        window.location.reload(false);
    }

    return (
        <IconButton sx={navbarIconButton} size="medium" onClick={() => handleLogout()}>
            <LogoutIcon />
            <SoftTypography
              variant="button"
              fontWeight="medium"
              color={color}
            >
              {t('authentication.log_out')}
            </SoftTypography>
        </IconButton>
    );
}

LogoutButton.propTypes = {
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "light",
      "dark",
    ]),
  };