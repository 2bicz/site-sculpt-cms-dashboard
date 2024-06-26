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

/** 
  All of the routes for the Soft UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

import Dashboard from "layouts/dashboard";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

import Document from "examples/Icons/Document";
import SpaceShip from "examples/Icons/SpaceShip";

import DashboardIcon from '@mui/icons-material/Dashboard';
import WebIcon from '@mui/icons-material/Web';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import BookIcon from '@mui/icons-material/Book';
import CommentIcon from '@mui/icons-material/Comment';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import Websites from "layouts/websites/Websites";
import { Pages } from "layouts/pages/Pages";
import Configurator from "examples/Configurator";
import CategoryIcon from '@mui/icons-material/Category';
import { Categories } from "layouts/categories/Categories";
import { Themes } from "layouts/themes/Themes";
import { Posts } from "layouts/posts/Posts";
import { Sections } from "layouts/sections/Sections";
import { Components } from "layouts/components/Components";
import { PageRenderer } from "layouts/page-renderer/PageRenderer";
import LanguageIcon from '@mui/icons-material/Language';

const routes = [
  // {
  //   type: "collapse",
  //   name: "Dashboard",
  //   key: "dashboard",
  //   route: "/dashboard",
  //   icon: <DashboardIcon size="12px" />,
  //   component: <Dashboard />,
  //   noCollapse: true
  // },
  
  { type: "title", title: "Kreator", key: "tables" },
  // {
  //   type: "collapse",
  //   name: "Websites",
  //   key: "websites",
  //   route: "/dashboard/websites",
  //   icon: <WebIcon size="12px" />,
  //   component: <Websites />,
  //   noCollapse: true
  // },
  {
    type: "collapse",
    name: "Website theme",
    key: "website",
    route: "/dashboard/website",
    icon: <LanguageIcon size="12px" />,
    component: <Themes />,
    noCollapse: true
  },
  {
    type: "collapse",
    name: "Pages",
    key: "pages",
    route: "/dashboard/pages",
    icon: <WebAssetIcon size="12px" />,
    component: <Pages />,
    noCollapse: true
  },
  {
    // type: "collapse",
    name: "Page sections",
    key: ":pageId",
    route:  "/dashboard/pages/page-sections/:pageId",
    icon: <WebAssetIcon size="12px" />,
    component: <Sections />,
    noCollapse: true
  },
  {
    // type: "collapse",
    name: "Section components",
    key: ":sectionId",
    route:  "/dashboard/pages/page-sections/components/:sectionId",
    icon: <WebAssetIcon size="12px" />,
    component: <Components />,
    noCollapse: true
  },
  
  // { type: "title", title: "Blog", key: "tables" },
  // {
  //   type: "collapse",
  //   name: "Categories",
  //   key: "categories",
  //   route: "/dashboard/categories",
  //   icon: <CategoryIcon size="12px" />,
  //   // component: <Categories />,
  //   component: <PageRenderer />,
  //   noCollapse: true
  // },


  // {
  //   // type: "collapse",
  //   name: "Pages",
  //   key: ":websiteId",
  //   route: "/dashboard/websites/:websiteId",
  //   icon: <WebAssetIcon size="12px" />,
  //   component: <Pages />,
  //   noCollapse: true
  // },

  // {
  //   type: "collapse",
  //   name: "Posts",
  //   key: "posts",
  //   route: "/dashboard/posts/:websiteId",
  //   icon: <BookIcon size="12px" />,
  //   component: <Posts />,
  //   noCollapse: true
  // },
 
  // {
  //   // type: "collapse",
  //   name: "Comments",
  //   key: "comments",
  //   route: "/dashboard/comments",
  //   icon: <CommentIcon size="12px" />,
  //   // component: <Tables />,
  //   noCollapse: true
  // },
  // {
  //   // type: "collapse",
  //   name: "Reactions",
  //   key: "reactions",
  //   route: "/dashboard/reactions",
  //   icon: <EmojiEmotionsIcon size="12px" />,
  //   // component: <Tables />,
  //   noCollapse: true
  // },
  {
    name: "Sign In",
    key: "sign-in",
    route: "/dashboard/authentication/sign-in",
    icon: <Document size="12px" />,
    component: <SignIn />,
    noCollapse: true,
    public: true
  },
  {
    name: "Reset password",
    key: "password-reser",
    route: "/dashboard/authentication/reset-password",
    icon: <SpaceShip size="12px" />,
    component: <SignUp />,
    noCollapse: true,
    public: true
  },
];

export default routes;
