"use client"

import { useTelegramUser } from "./tma/TelegramUserProvider"

export const MyUser = () => {
    const user = useTelegramUser()

    console.log(user)

    return(
        <p>{user?.firstName}</p>
    )
}