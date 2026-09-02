/**
 * v0 by Vercel.
 * @see https://v0.app/t/rOqoNXIKk01
 * Documentation: https://v0.app/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {Funnel} from "lucide-react"


export default function SearchBar() {
  const [ search, setSearch ] = useState("")

  return (
    <div className="flex items-center w-full max-w-md mx-auto space-x-2">
      <div className="relative flex-1">
        <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#7e8e83]">
          search
        </span>
        <Input
          value = {search}
          type="text"
          placeholder="Search PeerMates..."
          onChange = {(e) => {setSearch(e.target.value)}}
          className="w-75 pl-12 py-2 border border-[#202932] bg-[#0e1318] text-[#dde4dd] placeholder:text-[#7e8e83] focus:border-[#4edea3] focus:ring-[#4edea3] focus:outline-none"
        />
      </div>
      <DropdownMenu className="">
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="hidden sm:flex items-center">
            <Funnel />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 p-2">
          <DropdownMenuLabel>Sort By</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem>
            <span className="font-medium">Price: Low to High</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>
            <span className="font-medium">Price: High to Low</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>
            <span className="font-medium">Newest</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>
            <span className="font-medium">Oldest</span>
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
