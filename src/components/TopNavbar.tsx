"use client"
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'
import kakao from "../../public/kakao.png"
import Image from 'next/image'

type Props = {}

function TopNavbar({ }: Props) {

    const { data, status } = useSession();

    const login = async () => {
        await signIn('kakao', {
            callbackUrl: `http://${process.env.NEXT_PUBLIC_REDIRECT_URI}/api/auth/callback/kakao`
        })
    }

    const logout = async () => {
        await signOut()
    }



    const update = async () => {
        const response = await fetch('/api/account')

        const result = await response.json()

        console.log(result)
    }

    return (
        <div className='p-1 flex w-full'>
            {
                status == "authenticated" ? (
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={update}
                    >
                        동의 갱신
                    </button>

                ) : (
                    <></>
                )
            }
            {status == "authenticated" ? <button
                className="ml-auto bg-yellow-500 text-white px-4 py-2 rounded"
                onClick={logout}
            >
                로그아웃
            </button> : <button
                className="ml-auto text-white rounded"
                onClick={login}
            >
                <Image
                    src={kakao}
                    alt="kakao"
                    width={64}
                    height={32}
                />
            </button>
            }
        </div>
    )
}

export default TopNavbar