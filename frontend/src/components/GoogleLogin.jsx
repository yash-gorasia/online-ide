import React from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { googleAuth } from '../utils/googleAuth';
import { useNavigate } from 'react-router-dom';

const GoogleLogin = () => {
    const navigate = useNavigate();
    const responseGoogle = async (authResult) => {
        try {
            if (authResult['code']) {
                const result = await googleAuth(authResult['code']);
                const { _id, email, name, profilePic } = result.data.user;
                const token = result.data.token;
                const obj = { _id, email, name, profilePic, token };
                localStorage.setItem('user-info', JSON.stringify(obj));
                console.log("result data:", result.data.user);
                navigate('/dashboard');
            }

        } catch (err) {
            console.error(`Error while requesting google code : ${err}`);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: 'auth-code'
    });

    return (
        <div className=' w-[10%] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md'>
            <button
                onClick={googleLogin}
            >
                Login with Google
            </button>
        </div>
    )
}

export default GoogleLogin
