import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import "../styles/confirmEmailPage.css";
const CryptoJS = require("crypto-js");

const ThirdPartyLogin = () => {
  const [message, setMessage] = useState('Confirmation is in progress...');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const test = () => {
      const regex = new RegExp("[?&]" + "data" + "=([^&]*)");
      const results = regex.exec(window.location.search);
      const encryptedData =
        results === null
          ? ""
          : decodeURIComponent(results[1].replace(/\+/g, " "));

      if (encryptedData) {
        try {
          const decryptedData = decrypt(encryptedData);
          console.log("Decrypted data:", decryptedData);

          if (isValidJSON(decryptedData)) {
            const loginResponse = JSON.parse(decryptedData);
            dispatch(
                setCredentials({
                    user: {
                        dateOfBirth:loginResponse.User.DateOfBirth,
                        email:loginResponse.User.Email,
                        firstName:loginResponse.User.FirstName,
                        id:loginResponse.User.Id,
                        lastName:loginResponse.User.LastName,
                        profilePictureUrl:loginResponse.User.ProfilePictureUrl,
                        userName:loginResponse.User.UserName,
                    },
                    token: {
                        expiresOn:loginResponse.Token.ExpiresOn,
                        token: loginResponse.Token.Token
                    },
                    thirdParty:true
                })
            );
            navigate('/workspaces');    
            console.log("Login response:", loginResponse);
          } else {
            setMessage("Confirmation error")
            console.error("Decrypted data is not valid JSON:", decryptedData);
          }
        } catch (error) {
          console.error("Decryption failed:", error);
          setMessage("Confirmation error")
        }
      } else {
        console.error("No 'data' parameter found in the URL");
        setMessage("Confirmation error")
      }
    };

    test();
  }, []);

  function decrypt(encryptedText) {
    const key = CryptoJS.enc.Base64.parse("gCjK+DN/bCLbKIGied1qCA==");
    const iv = CryptoJS.enc.Base64.parse("47lSQRde1POo31adQ/u7KQ==");
    const encryptedData = CryptoJS.enc.Base64.parse(encryptedText);

    const decrypted = CryptoJS.AES.decrypt({ ciphertext: encryptedData }, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  function isValidJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  return (
    <div className='confirm-email-container'>
        <div className='confirm-email-message'>
            <h2 className='confirm-email-h2'>{message}</h2>
        </div>
    </div>
  );
};

export default ThirdPartyLogin;
