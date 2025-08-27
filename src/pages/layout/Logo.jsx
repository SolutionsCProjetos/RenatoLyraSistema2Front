import React from "react";
import logoImage from "../../assets/LogoRena.png";
import { Link } from "react-router-dom";

const Logo = () => {
    return (
        <div className="logo h-auto rounded w-40 ml-1">
            <Link to={`/irl/home`}>
                <img src={logoImage} alt="Logo Tec" className="h-full w-full object-contain" />
            </Link>
        </div>
    );
}

export default Logo;
