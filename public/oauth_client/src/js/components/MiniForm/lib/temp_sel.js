// template selector

import { lazy } from "react";

console.log("[form] loading lazy");

const Access = lazy(() => import(/* webpackChunkName: "templates/miniform" */ `../../Access`));

const MiniWonder = lazy(() => import(/* webpackChunkName: "templates/miniform" */ `./MiniWonder/MiniWonder`));

export default { Access, MiniWonder };
