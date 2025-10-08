import { slide as Menu } from "react-burger-menu";
import { GrSpa } from "react-icons/gr";
import { BiDonateHeart, BiDumbbell } from "react-icons/bi";
import { FcConferenceCall, FcDonate } from "react-icons/fc";
import { LiaCommentSolid } from "react-icons/lia";
import { FaUtensils } from "react-icons/fa";
import "./Sidebar.css";
import React, { useState, useEffect } from "react";
import {
  BiHomeAlt,
  BiUser,
  BiMedal,
  BiLogInCircle,
  BiLogOutCircle
} from "react-icons/bi";

type SidemenuProps = {
  pageWrapId: string;
  outerContainerId: string;
};

export const Sidebar = ({ pageWrapId, outerContainerId }: SidemenuProps) => {


  return (
    <Menu>
      <a className="menu-item" href="/feed/feed_index">
        <LiaCommentSolid />
        Feed
      </a>

      <a className="menu-item" href="/gym/gym_index">
        <BiDumbbell />
        Gym
      </a>
      <a className="menu-item" href="/food_delivery/food_delivery_index">
        <FaUtensils />
        Food delivery
      </a>
      <a className="menu-item" href="/charity/charity_index">
        <BiDonateHeart />
        Charity donations
      </a>

    </Menu>
  );
};