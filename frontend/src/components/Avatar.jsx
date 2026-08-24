"use client"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {API_BASE_URL} from "../util/constant"
import { useDispatch } from 'react-redux';
import { resetUser } from '../store/userSlice';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AvatarDropdown({name, photo}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const Logout = async() => {
    await axios.post(API_BASE_URL + "/logout", {}, { withCredentials: true }).then(dispatch(resetUser())).catch((err) => {console.log("err", err)})
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-8 shrink-0 items-center justify-center gap-2 rounded-full text-xs font-medium text-white transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none">
        <Avatar>
          <AvatarImage src={photo} alt={`${name}'s profile`} />
          <AvatarFallback>{name?.[0] ?? "?"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate("/profile")}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={Logout}>Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AvatarDropdown;
