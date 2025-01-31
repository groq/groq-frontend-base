"use client";

import * as React from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ModeToggle() {
	const { setTheme, theme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="fixed top-4 right-4 rounded-full"
				>
					<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					onClick={() => setTheme("light")}
					className="flex items-center justify-between min-w-[150px]"
				>
					<div className="flex items-center gap-2">
						<Sun size={16} />
						Light
					</div>
					<Check
						size={16}
						className={cn("opacity-0", theme === "light" && "opacity-100")}
					/>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("dark")}
					className="flex items-center justify-between min-w-[150px]"
				>
					<div className="flex items-center gap-2">
						<Moon size={16} />
						Dark
					</div>
					<Check
						size={16}
						className={cn("opacity-0", theme === "dark" && "opacity-100")}
					/>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("system")}
					className="flex items-center justify-between min-w-[150px]"
				>
					<div className="flex items-center gap-2">
						<Monitor size={16} />
						System
					</div>
					<Check
						size={16}
						className={cn("opacity-0", theme === "system" && "opacity-100")}
					/>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
